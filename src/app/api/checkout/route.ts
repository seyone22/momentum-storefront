import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { createPaymentsLkCheckout } from "@/lib/payments-lk";
import { getAuthenticatedCustomer } from "@/lib/customer-auth";

interface CheckoutItemInput {
  id: string;
  name?: string;
  size: string;
  quantity: number;
  priceLkr?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, attribution } = body as {
      items?: CheckoutItemInput[];
      customer?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
      };
      attribution?: {
        utmSource?: string;
        utmMedium?: string;
        utmCampaign?: string;
        utmContent?: string;
        utmTerm?: string;
        fbclid?: string;
        fbp?: string;
        fbc?: string;
      };
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your bag is empty." },
        { status: 400 }
      );
    }

    if (
      !customer?.name?.trim() ||
      !customer?.email?.trim() ||
      !customer?.phone?.trim() ||
      !customer?.address?.trim() ||
      !customer?.city?.trim()
    ) {
      return NextResponse.json(
        { error: "Please complete all required delivery details." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // Validate items & compute authoritative total from Payload DB
    const verifiedItems: Array<{
      productId: string;
      productName: string;
      size: string;
      quantity: number;
      unitPriceLkr: number;
    }> = [];

    let totalLkr = 0;

    for (const item of items) {
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const numericId = Number(item.id);
      let productDoc: Record<string, unknown> | null = null;

      if (!Number.isNaN(numericId) && numericId > 0) {
        try {
          const found = await payload.findByID({
            collection: "products",
            id: numericId,
          });
          productDoc = found as unknown as Record<string, unknown>;
        } catch {
          productDoc = null;
        }
      }

      if (!productDoc && item.id) {
        const bySlug = await payload.find({
          collection: "products",
          where: { slug: { equals: String(item.id) } },
          limit: 1,
        });
        if (bySlug.docs.length > 0) {
          productDoc = bySlug.docs[0] as unknown as Record<string, unknown>;
        }
      }

      if (!productDoc) {
        return NextResponse.json(
          { error: `Product "${item.name || item.id}" is no longer available.` },
          { status: 400 }
        );
      }

      const variants = Array.isArray(productDoc.variants)
        ? (productDoc.variants as Array<Record<string, unknown>>)
        : [];
      const variant = variants.find((v) => String(v.size) === String(item.size));

      if (!variant) {
        return NextResponse.json(
          { error: `Size ${item.size} is not available for ${String(productDoc.name)}.` },
          { status: 400 }
        );
      }

      const remaining = Math.max(
        0,
        Number(variant.stockCap ?? 0) - Number(variant.sold ?? 0)
      );
      if (remaining < qty) {
        return NextResponse.json(
          {
            error: `Only ${remaining} unit(s) left for ${String(productDoc.name)} (Size ${item.size}).`,
          },
          { status: 400 }
        );
      }

      const unitPriceLkr = Number(productDoc.priceLkr ?? 0);
      totalLkr += unitPriceLkr * qty;

      verifiedItems.push({
        productId: String(productDoc.id),
        productName: String(productDoc.name),
        size: String(item.size),
        quantity: qty,
        unitPriceLkr,
      });
    }

    const orderNumber = `MMTM-${Math.floor(100000 + Math.random() * 900000)}`;

    const fbpCookie = req.cookies.get("_fbp")?.value;
    const fbcCookie = req.cookies.get("_fbc")?.value;
    const { customer: authenticatedCustomer } = await getAuthenticatedCustomer(req.headers, payload);

    // Persist order in Payload CMS (PostgreSQL)
    const createdOrder = await payload.create({
      collection: "orders",
      data: {
        orderNumber,
        ...(authenticatedCustomer
          ? { customer: Number(authenticatedCustomer.id) || authenticatedCustomer.id }
          : {}),
        customerName: customer.name.trim(),
        customerPhone: customer.phone.trim(),
        customerEmail: customer.email.trim(),
        shippingAddress: customer.address.trim(),
        city: customer.city.trim(),
        totalLkr,
        paymentRail: "Payments.lk",
        paymentStatus: "pending",
        fulfillmentStatus: "pre_order_placed",
        items: verifiedItems,
        ...(attribution?.utmSource ? { utmSource: String(attribution.utmSource).slice(0, 200) } : {}),
        ...(attribution?.utmMedium ? { utmMedium: String(attribution.utmMedium).slice(0, 200) } : {}),
        ...(attribution?.utmCampaign ? { utmCampaign: String(attribution.utmCampaign).slice(0, 200) } : {}),
        ...(attribution?.utmContent ? { utmContent: String(attribution.utmContent).slice(0, 200) } : {}),
        ...(attribution?.utmTerm ? { utmTerm: String(attribution.utmTerm).slice(0, 200) } : {}),
        ...(attribution?.fbclid ? { fbclid: String(attribution.fbclid).slice(0, 255) } : {}),
        ...(attribution?.fbp || fbpCookie
          ? { fbp: String(attribution?.fbp || fbpCookie).slice(0, 255) }
          : {}),
        ...(attribution?.fbc || fbcCookie
          ? { fbc: String(attribution?.fbc || fbcCookie).slice(0, 255) }
          : {}),
      },
    });

    const summaryDescription = verifiedItems
      .map((i) => `${i.productName} (${i.size}) x${i.quantity}`)
      .join(", ");

    const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const origin = forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : req.nextUrl.origin;

    const checkout = await createPaymentsLkCheckout({
      orderId: orderNumber,
      amountLkr: totalLkr,
      description: `Pre-Order ${orderNumber}: ${summaryDescription}`.slice(0, 250),
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
      },
      returnUrl: `${origin}/order/confirmed/${orderNumber}`,
      cancelUrl: `${origin}/checkout`,
    });

    if (checkout.id) {
      await payload.update({
        collection: "orders",
        id: createdOrder.id,
        data: {
          paymentsLkCheckoutId: String(checkout.id),
        },
      });
    }

    return NextResponse.json({
      orderNumber,
      totalLkr,
      ...checkout,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to initiate Payments.lk checkout";
    console.error("Checkout initiation error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
