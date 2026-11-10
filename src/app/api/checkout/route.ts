import { NextRequest, NextResponse } from "next/server";
import { createPaymentsLkCheckout } from "@/lib/payments-lk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amountLkr, description, customer } = body;

    if (!orderId || !amountLkr || !customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: "Missing required order parameters (orderId, amountLkr, customer details)" },
        { status: 400 }
      );
    }

    const checkout = await createPaymentsLkCheckout({
      orderId,
      amountLkr,
      description: description || `Momentum Clothing Pre-Order #${orderId}`,
      customer,
    });

    return NextResponse.json(checkout);
  } catch (error: any) {
    console.error("Payments.lk checkout initiation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate Payments.lk checkout" },
      { status: 500 }
    );
  }
}
