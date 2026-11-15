import crypto from "crypto";

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
}

export interface CreateCheckoutParams {
  orderId: string;
  amountLkr: number;
  description: string;
  customer: CustomerInfo;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentsLkCheckoutResponse {
  object?: string;
  id?: string;
  mode?: string;
  status?: string;
  url?: string;
  expiresAt?: string;
  payment?: any;
  error?: string;
  message?: string;
}

const PAYMENTS_LK_API_URL = "https://api.payments.lk/v1";

/**
 * Creates a Payments.lk checkout session for the customer.
 * Following official documentation at https://payments.lk/developers/guide
 */
export async function createPaymentsLkCheckout(
  params: CreateCheckoutParams
): Promise<PaymentsLkCheckoutResponse> {
  const secretKey = process.env.PAYMENTS_LK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing PAYMENTS_LK_SECRET_KEY in environment variables.");
  }

  const amountCents = Math.round(params.amountLkr * 100);

  const payload: Record<string, any> = {
    amountCents,
    description: params.description,
    reference: params.orderId,
  };

  if (params.returnUrl) {
    payload.successUrl = params.returnUrl;
  }

  if (params.cancelUrl) {
    payload.cancelUrl = params.cancelUrl;
  }

  const response = await fetch(`${PAYMENTS_LK_API_URL}/checkouts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secretKey}`,
      "Idempotency-Key": `order_${params.orderId}_${Date.now()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Payments.lk API responded with status ${response.status}`
    );
  }

  return data;
}

/**
 * Validates a webhook payload received from Payments.lk using HMAC-SHA256.
 * Supports `t=<unix_ts>,v1=<hex>` (timestamped) and raw/prefixed hex signatures.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.PAYMENTS_LK_WEBHOOK_SECRET;

  if (!secret) {
    console.warn("PAYMENTS_LK_WEBHOOK_SECRET is not set; skipping webhook signature check.");
    return process.env.NODE_ENV !== "production";
  }

  if (!signatureHeader || !signatureHeader.trim()) {
    return false;
  }

  const safeCompareHex = (aHex: string, bHex: string): boolean => {
    const a = Buffer.from(aHex.trim().toLowerCase(), "utf8");
    const b = Buffer.from(bHex.trim().toLowerCase(), "utf8");
    if (a.length !== b.length || a.length === 0) return false;
    return crypto.timingSafeEqual(a, b);
  };

  // Format 1: t=1745488800,v1=abc123... (Stripe / Payments.lk signed event header)
  const parts = signatureHeader.split(",").map((p) => p.trim());
  const timestampPart = parts.find((p) => p.startsWith("t="));
  const v1Parts = parts.filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));

  if (timestampPart && v1Parts.length > 0) {
    const timestamp = timestampPart.slice(2);
    const tsNum = Number(timestamp);
    if (!Number.isFinite(tsNum)) return false;

    // Allow 5-minute clock tolerance (supports seconds or milliseconds)
    const tsSeconds = tsNum > 1e12 ? Math.floor(tsNum / 1000) : tsNum;
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSeconds - tsSeconds) > 300) {
      return false;
    }

    const signedPayload = `${timestamp}.${rawBody}`;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(signedPayload, "utf8")
      .digest("hex");

    return v1Parts.some((sig) => safeCompareHex(sig, expected));
  }

  // Format 2: raw hex or sha256=<hex>
  const normalizedSig = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice(7)
    : signatureHeader;

  const expectedRaw = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  return safeCompareHex(normalizedSig, expectedRaw);
}
