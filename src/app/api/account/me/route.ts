import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCustomer } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  const { payload, customer } = await getAuthenticatedCustomer(req.headers);

  if (!customer) {
    return NextResponse.json({ customer: null, orders: [] }, { status: 401 });
  }

  try {
    const ordersResult = await payload.find({
      collection: "orders",
      where: {
        or: [
          { customer: { equals: Number(customer.id) || customer.id } },
          ...(customer.email ? [{ customerEmail: { equals: customer.email } }] : []),
        ],
      },
      sort: "-createdAt",
      limit: 50,
    });

    const orders = ordersResult.docs.map((o) => {
      const doc = o as unknown as Record<string, unknown>;
      return {
        id: doc.id,
        orderNumber: doc.orderNumber,
        totalLkr: Number(doc.totalLkr ?? 0),
        refundedLkr: Number(doc.refundedLkr ?? 0),
        paymentRail: doc.paymentRail,
        paymentStatus: doc.paymentStatus,
        fulfillmentStatus: doc.fulfillmentStatus,
        promptTrackingNumber: doc.promptTrackingNumber || null,
        city: doc.city,
        items: Array.isArray(doc.items) ? doc.items : [],
        createdAt: doc.createdAt,
      };
    });

    return NextResponse.json({ customer, orders });
  } catch (err) {
    console.error("[GET /api/account/me] Error:", err);
    return NextResponse.json({ customer, orders: [] });
  }
}

export async function PATCH(req: NextRequest) {
  const { payload, customer } = await getAuthenticatedCustomer(req.headers);

  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : customer.name;
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const defaultAddress =
      typeof body?.defaultAddress === "string" ? body.defaultAddress.trim() : "";
    const defaultCity =
      typeof body?.defaultCity === "string" ? body.defaultCity.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const updated = await payload.update({
      collection: "customers",
      id: customer.id,
      data: {
        name,
        phone,
        defaultAddress,
        defaultCity,
      },
      overrideAccess: true,
    });

    return NextResponse.json({
      customer: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        phone: updated.phone || null,
        defaultAddress: updated.defaultAddress || null,
        defaultCity: updated.defaultCity || null,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
