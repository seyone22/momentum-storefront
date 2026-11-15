import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { attachCustomerSessionCookie } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!token) {
      return NextResponse.json(
        { error: "Reset token is missing or invalid." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    const result = await payload.resetPassword({
      collection: "customers",
      data: {
        token,
        password,
      },
      overrideAccess: true,
    });

    const res = NextResponse.json({
      success: true,
      user: result.user ? { email: result.user.email } : null,
    });

    return attachCustomerSessionCookie(res, result.token);
  } catch {
    return NextResponse.json(
      { error: "Reset link is invalid or has expired." },
      { status: 400 }
    );
  }
}
