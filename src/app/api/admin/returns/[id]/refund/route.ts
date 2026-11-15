import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { createPaymentsLkRefund } from "@/lib/payments-lk";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const rmaId = Number(id);
    if (Number.isNaN(rmaId) || rmaId <= 0) {
      return NextResponse.json({ error: "Invalid RMA ID." }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const { user } = await payload.auth({ headers: req.headers });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const rma = (await payload.findByID({
      collection: "returns",
      id: rmaId,
      depth: 1,
    })) as unknown as Record<string, unknown>;

    if (!rma) {
      return NextResponse.json({ error: "RMA record not found." }, { status: 404 });
    }

    const orderObj =
      rma.order && typeof rma.order === "object"
        ? (rma.order as Record<string, unknown>)
        : null;

    if (!orderObj) {
      return NextResponse.json({ error: "Linked order not found." }, { status: 404 });
    }

    const totalLkr = Number(orderObj.totalLkr ?? 0);
    const alreadyRefunded = Number(orderObj.refundedLkr ?? 0);
    const remainingRefundable = Math.max(0, totalLkr - alreadyRefunded);

    const requestedAmount = Number(body.amountLkr ?? rma.refundAmountLkr ?? 0);
    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      return NextResponse.json(
        { error: "Refund amount must be greater than LKR 0." },
        { status: 400 }
      );
    }

    if (requestedAmount > remainingRefundable) {
      return NextResponse.json(
        {
          error: `Requested refund (LKR ${requestedAmount.toLocaleString()}) exceeds remaining refundable balance (LKR ${remainingRefundable.toLocaleString()}).`,
        },
        { status: 400 }
      );
    }

    const paymentRail = String(orderObj.paymentRail ?? "");
    const paymentId = String(orderObj.paymentsLkPaymentId ?? "").trim();

    if (paymentRail === "Payments.lk" && paymentId) {
      const refund = await createPaymentsLkRefund({
        paymentId,
        amountLkr: requestedAmount,
        reason: String(rma.reason || "customer_request").slice(0, 120),
        idempotencyKey: `rma_${rmaId}_${Math.round(requestedAmount * 100)}`,
      });

      await payload.update({
        collection: "returns",
        id: rmaId,
        data: {
          refundAmountLkr: requestedAmount,
          refundStatus: "pending",
          paymentsLkRefundId: String(refund.id || ""),
        },
      });

      return NextResponse.json({
        success: true,
        refundId: refund.id,
        status: "pending",
        message: "Payments.lk refund initiated. Status will sync automatically via webhook.",
      });
    }

    // Manual bank transfer / WhatsApp order refund
    const newRefundedTotal = Math.min(totalLkr, alreadyRefunded + requestedAmount);
    await payload.update({
      collection: "returns",
      id: rmaId,
      data: {
        refundAmountLkr: requestedAmount,
        refundStatus: "manual_bank_transfer",
        status: "completed",
      },
    });

    await payload.update({
      collection: "orders",
      id: Number(orderObj.id),
      data: {
        refundedLkr: newRefundedTotal,
        paymentStatus: newRefundedTotal >= totalLkr ? "refunded" : "partially_refunded",
      },
    });

    return NextResponse.json({
      success: true,
      status: "manual_bank_transfer",
      message: "Manual bank transfer refund recorded and order updated.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process refund";
    console.error("Admin refund error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
