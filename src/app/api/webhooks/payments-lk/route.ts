import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-payable-signature") || req.headers.get("x-signature");

    console.log("Payments.lk Webhook Received:", {
      signature,
      payload: rawBody,
    });

    let eventData: any = {};
    try {
      eventData = JSON.parse(rawBody);
    } catch {
      // Raw string payload
    }

    // In production, update the order status in PostgreSQL / Payload CMS
    // and fire Meta CAPI "Purchase" event.
    return NextResponse.json({ received: true, status: "success" });
  } catch (error: any) {
    console.error("Payments.lk webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
