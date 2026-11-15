import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { attachCustomerSessionCookie } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : undefined;
    const defaultAddress =
      typeof body?.defaultAddress === "string" ? body.defaultAddress.trim() : undefined;
    const defaultCity =
      typeof body?.defaultCity === "string" ? body.defaultCity.trim() : undefined;

    if (!name || !email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide your full name and a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    const existing = await payload.find({
      collection: "customers",
      where: { email: { equals: email } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const created = await payload.create({
      collection: "customers",
      data: {
        name,
        email,
        password,
        ...(phone ? { phone } : {}),
        ...(defaultAddress ? { defaultAddress } : {}),
        ...(defaultCity ? { defaultCity } : {}),
      },
      overrideAccess: true,
    });

    // Link any previous guest orders matching this email
    try {
      const guestOrders = await payload.find({
        collection: "orders",
        where: {
          and: [
            { customerEmail: { equals: email } },
            { customer: { exists: false } },
          ],
        },
        limit: 50,
      });

      for (const order of guestOrders.docs) {
        await payload.update({
          collection: "orders",
          id: order.id,
          data: { customer: created.id },
          context: { skipCapiHook: true },
        });
      }
    } catch {
      // Non-blocking guest order linking
    }

    const loginResult = await payload.login({
      collection: "customers",
      data: { email, password },
    });

    const res = NextResponse.json(
      {
        customer: {
          id: created.id,
          name: created.name,
          email: created.email,
          phone: created.phone || null,
          defaultAddress: created.defaultAddress || null,
          defaultCity: created.defaultCity || null,
        },
      },
      { status: 201 }
    );

    return attachCustomerSessionCookie(res, loginResult.token);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create account";
    console.error("[/api/account/register] Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
