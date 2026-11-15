import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || searchParams.get("orderNumber") || "").trim();

    if (!query) {
      return NextResponse.json(
        { error: "Please provide an order reference or phone number." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });
    const normalized = query.replace(/^#/, "").toUpperCase();

    const result = await payload.find({
      collection: "orders",
      where: {
        or: [
          {
            orderNumber: {
              equals: normalized,
            },
          },
          {
            customerPhone: {
              equals: query,
            },
          },
        ],
      },
      sort: "-createdAt",
      limit: 1,
    });

    if (result.docs.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const doc = result.docs[0] as unknown as Record<string, unknown>;

    const rmaResults = await payload.find({
      collection: "returns",
      where: {
        order: {
          equals: Number(doc.id),
        },
      },
      sort: "-createdAt",
      limit: 10,
    });

    const returns = rmaResults.docs.map((r) => {
      const rDoc = r as unknown as Record<string, unknown>;
      return {
        rmaNumber: rDoc.rmaNumber,
        type: rDoc.type,
        status: rDoc.status,
        refundStatus: rDoc.refundStatus || "none",
        refundAmountLkr: Number(rDoc.refundAmountLkr ?? 0),
        pickupTrackingNumber: rDoc.pickupTrackingNumber || null,
        createdAt: rDoc.createdAt,
      };
    });

    return NextResponse.json({
      orderNumber: doc.orderNumber,
      customerName: doc.customerName,
      city: doc.city,
      totalLkr: doc.totalLkr,
      refundedLkr: Number(doc.refundedLkr ?? 0),
      paymentRail: doc.paymentRail,
      paymentStatus: doc.paymentStatus,
      fulfillmentStatus: doc.fulfillmentStatus,
      promptTrackingNumber: doc.promptTrackingNumber || null,
      items: Array.isArray(doc.items) ? doc.items : [],
      returns,
      createdAt: doc.createdAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to lookup order";
    console.error("Order lookup error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
