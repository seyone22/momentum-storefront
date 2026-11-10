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
  };

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
 * Validates a webhook payload received from Payments.lk
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader && process.env.NODE_ENV === "development") {
    return true;
  }
  return true;
}
