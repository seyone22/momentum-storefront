import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { verifyWebhookSignature } from "@/lib/payments-lk";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("payments-signature") ||
      req.headers.get("x-payable-signature") ||
      req.headers.get("x-signature");

    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error("Invalid Payments.lk webhook signature");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    let eventData: Record<string, unknown> = {};
    try {
      eventData = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON webhook payload" }, { status: 400 });
    }

    const nestedData =
      eventData.data && typeof eventData.data === "object"
        ? (eventData.data as Record<string, unknown>)
        : undefined;

    const orderNumber = String(
      nestedData?.reference ||
        nestedData?.orderId ||
        nestedData?.order_id ||
        eventData.reference ||
        eventData.orderId ||
        eventData.order_id ||
        ""
    ).trim();

    const rawStatus = String(
      eventData.type ||
        eventData.event ||
        eventData.status ||
        eventData.paymentStatus ||
        nestedData?.status ||
        ""
    ).toLowerCase();

    console.log("Payments.lk Webhook Received:", {
      signature,
      orderNumber,
      rawStatus,
    });

    if (!orderNumber) {
      return NextResponse.json({ received: true, ignored: "No orderId in payload" });
    }

    const payload = await getPayload({ config: configPromise });
    const found = await payload.find({
      collection: "orders",
      where: {
        orderNumber: {
          equals: orderNumber,
        },
      },
      limit: 1,
    });

    if (found.docs.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = found.docs[0] as unknown as Record<string, unknown>;
    const isSuccess = ["paid", "success", "succeeded", "completed", "approved"].some(
      (s) => rawStatus.includes(s)
    );
    const isFailed = ["failed", "cancelled", "canceled", "declined", "expired"].some(
      (s) => rawStatus.includes(s)
    );

    if (isSuccess && order.paymentStatus !== "paid") {
      await payload.update({
        collection: "orders",
        id: Number(order.id),
        data: {
          paymentStatus: "paid",
          fulfillmentStatus: "payment_verified",
        },
      });

      // Increment sold count on ordered product variants
      const orderItems = Array.isArray(order.items)
        ? (order.items as Array<Record<string, unknown>>)
        : [];

      for (const item of orderItems) {
        const prodId = Number(item.productId);
        if (Number.isNaN(prodId) || prodId <= 0) continue;

        try {
          const prod = (await payload.findByID({
            collection: "products",
            id: prodId,
          })) as unknown as Record<string, unknown>;

          const variants = Array.isArray(prod.variants)
            ? (prod.variants as Array<Record<string, unknown>>)
            : [];

          const updatedVariants = variants.map((v) => {
            if (String(v.size) === String(item.size)) {
              const currentSold = Number(v.sold ?? 0);
              const qty = Number(item.quantity ?? 1);
              return {
                ...v,
                sold: currentSold + qty,
              };
            }
            return v;
          });

          await payload.update({
            collection: "products",
            id: prodId,
            data: {
              variants: updatedVariants as never,
            },
          });
        } catch (err) {
          console.error(`Failed updating variant stock for product ${prodId}:`, err);
        }
      }
    } else if (isFailed && order.paymentStatus === "pending") {
      await payload.update({
        collection: "orders",
        id: Number(order.id),
        data: {
          paymentStatus: "failed",
        },
      });
    }

    return NextResponse.json({ received: true, orderNumber, status: "processed" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook error";
    console.error("Payments.lk webhook error:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
