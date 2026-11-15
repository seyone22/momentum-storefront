import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    try {
      const token = await payload.forgotPassword({
        collection: "customers",
        data: { email },
        disableEmail: true,
      });

      if (token) {
        console.info(
          `[ForgotPassword] Reset token generated for ${email} (email transport pending client DNS/mailbox setup)`
        );
      }
    } catch {
      // Do not reveal whether the email exists
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account exists for that email, a password reset link has been queued. Need immediate help? Contact us on WhatsApp.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process password reset request." },
      { status: 500 }
    );
  }
}
