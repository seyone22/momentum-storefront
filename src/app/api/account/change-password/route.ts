import { NextRequest, NextResponse } from "next/server";
import { attachCustomerSessionCookie, getAuthenticatedCustomer } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  const { payload, customer } = await getAuthenticatedCustomer(req.headers);

  if (!customer) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const currentPassword =
      typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword =
      typeof body?.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Verify current password before updating
    try {
      await payload.login({
        collection: "customers",
        data: {
          email: customer.email,
          password: currentPassword,
        },
      });
    } catch {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    await payload.update({
      collection: "customers",
      id: customer.id,
      data: {
        password: newPassword,
      },
      overrideAccess: true,
    });

    const refreshed = await payload.login({
      collection: "customers",
      data: {
        email: customer.email,
        password: newPassword,
      },
    });

    const res = NextResponse.json({ success: true });
    return attachCustomerSessionCookie(res, refreshed.token);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to change password";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
