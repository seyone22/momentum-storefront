import { NextResponse } from "next/server";
import { clearCustomerSessionCookie } from "@/lib/customer-auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  return clearCustomerSessionCookie(res);
}
