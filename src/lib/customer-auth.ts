import { NextResponse } from "next/server";
import { getPayload, Payload } from "payload";
import configPromise from "@payload-config";

export const CUSTOMER_COOKIE_NAME = "payload-token";
const TWO_WEEKS_SECONDS = 60 * 60 * 24 * 14;

export interface AuthenticatedCustomer {
  id: number | string;
  email: string;
  name: string;
  phone?: string | null;
  defaultAddress?: string | null;
  defaultCity?: string | null;
  defaultDistrict?: string | null;
  defaultPostalCode?: string | null;
  marketingEmailOptIn?: boolean;
}

export async function getAuthenticatedCustomer(
  headers: Headers,
  payloadInstance?: Payload
): Promise<{ payload: Payload; customer: AuthenticatedCustomer | null }> {
  const payload = payloadInstance || (await getPayload({ config: configPromise }));
  try {
    const authResult = await payload.auth({ headers });
    const user = authResult.user as (Record<string, unknown> & { collection?: string }) | null;
    if (user && user.collection === "customers") {
      return {
        payload,
        customer: {
          id: user.id as number | string,
          email: String(user.email || ""),
          name: String(user.name || ""),
          phone: user.phone ? String(user.phone) : null,
          defaultAddress: user.defaultAddress ? String(user.defaultAddress) : null,
          defaultCity: user.defaultCity ? String(user.defaultCity) : null,
          defaultDistrict: user.defaultDistrict ? String(user.defaultDistrict) : null,
          defaultPostalCode: user.defaultPostalCode ? String(user.defaultPostalCode) : null,
          marketingEmailOptIn: Boolean(user.marketingEmailOptIn),
        },
      };
    }
  } catch {
    // Unauthenticated or invalid token
  }
  return { payload, customer: null };
}

export function attachCustomerSessionCookie(res: NextResponse, token?: string) {
  if (!token) return res;
  res.cookies.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: TWO_WEEKS_SECONDS,
  });
  return res;
}

export function clearCustomerSessionCookie(res: NextResponse) {
  res.cookies.set(CUSTOMER_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return res;
}
