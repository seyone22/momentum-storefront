import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { createPaymentsLkCheckout } from "@/lib/payments-lk";

function formatSriLankaWaPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("94")) return digits;
  if (digits.startsWith("0") && digits.length >= 10) return `94${digits.slice(1)}`;
  return digits;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const orderId = Number(id);
    if (Number.isNaN(orderId) || orderId <= 0) {
      return NextResponse.json({ error: "Invalid Order ID." }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const { user } = await payload.auth({ headers: req.headers });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const orderDoc = (await payload.findByID({
      collection: "orders",
      id: orderId,
    })) as unknown as Record<string, unknown>;

    if (!orderDoc) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const paymentStatus = String(orderDoc.paymentStatus ?? "pending");
    if (paymentStatus === "paid" || paymentStatus === "refunded" || paymentStatus === "partially_refunded") {
      return NextResponse.json(
        { error: `Cannot generate payment link for an order that is already ${paymentStatus}.` },
        { status: 400 }
      );
    }

    const totalLkr = Number(orderDoc.totalLkr ?? 0);
    if (!Number.isFinite(totalLkr) || totalLkr <= 0) {
      return NextResponse.json(
        { error: "Order Total (LKR) must be greater than 0 before generating a payment link." },
        { status: 400 }
      );
    }

    const orderNumber = String(orderDoc.orderNumber ?? `MMTM-${orderId}`);
    const customerName = String(orderDoc.customerName ?? "Customer");
    const customerPhone = String(orderDoc.customerPhone ?? "");
    const customerEmail = String(orderDoc.customerEmail ?? "care@momentumclothing.lk");

    const orderItems = Array.isArray(orderDoc.items)
      ? (orderDoc.items as Array<Record<string, unknown>>)
      : [];
    const summaryDescription =
      orderItems.length > 0
        ? orderItems
            .map((i) => `${String(i.productName)} (${String(i.size)}) x${Number(i.quantity ?? 1)}`)
            .join(", ")
        : "Momentum Pre-Order";

    const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const origin = forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : req.nextUrl.origin;

    const checkout = await createPaymentsLkCheckout({
      orderId: orderNumber,
      amountLkr: totalLkr,
      description: `WhatsApp Order ${orderNumber}: ${summaryDescription}`.slice(0, 250),
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: String(orderDoc.shippingAddress ?? ""),
        city: String(orderDoc.city ?? ""),
      },
      returnUrl: `${origin}/order/confirmed/${orderNumber}`,
      cancelUrl: `${origin}/track`,
    });

    const paymentUrl = String(checkout.url || "");
    if (!paymentUrl) {
      throw new Error("Payments.lk did not return a checkout URL.");
    }

    await payload.update({
      collection: "orders",
      id: orderId,
      data: {
        paymentRail: "Payments.lk",
        paymentsLkCheckoutId: checkout.id ? String(checkout.id) : undefined,
        paymentLinkUrl: paymentUrl,
      },
    });

    const whatsappText = `Hi ${customerName}, here is your secure Momentum Clothing checkout link for Order ${orderNumber} (LKR ${totalLkr.toLocaleString()}): ${paymentUrl}`;
    const waPhone = formatSriLankaWaPhone(customerPhone);
    const whatsappUrl = waPhone
      ? `https://wa.me/${waPhone}?text=${encodeURIComponent(whatsappText)}`
      : `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

    return NextResponse.json({
      success: true,
      url: paymentUrl,
      checkoutId: checkout.id || null,
      whatsappText,
      whatsappUrl,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to generate Payments.lk link";
    console.error("WhatsApp payment link error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
