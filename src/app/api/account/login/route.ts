import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { attachCustomerSessionCookie } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    const result = await payload.login({
      collection: "customers",
      data: { email, password },
    });

    const user = result.user as unknown as Record<string, unknown>;
    const res = NextResponse.json({
      customer: {
        id: user.id,
        name: String(user.name || ""),
        email: String(user.email || ""),
        phone: user.phone ? String(user.phone) : null,
        defaultAddress: user.defaultAddress ? String(user.defaultAddress) : null,
        defaultCity: user.defaultCity ? String(user.defaultCity) : null,
      },
    });

    return attachCustomerSessionCookie(res, result.token);
  } catch {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }
}
