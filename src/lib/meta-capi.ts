import crypto from "crypto";

export interface MetaCapiUserInput {
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  city?: string | null;
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
}

export interface MetaCapiContentItem {
  id: string;
  quantity: number;
  item_price: number;
}

export interface SendMetaCapiEventParams {
  eventName: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | string;
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  actionSource?: "website" | "chat" | "system_generated" | "other";
  userData: MetaCapiUserInput;
  customData?: {
    currency?: string;
    value?: number;
    order_id?: string;
    contents?: MetaCapiContentItem[];
    content_type?: string;
  };
  pixelIdOverride?: string | null;
}

export function hashSha256(raw: string): string {
  return crypto.createHash("sha256").update(raw, "utf8").digest("hex");
}

function normalizePhoneForMeta(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("94")) return digits;
  if (digits.startsWith("0") && digits.length >= 10) return `94${digits.slice(1)}`;
  return digits;
}

export function normalizeAndHashUserData(input: MetaCapiUserInput): Record<string, unknown> {
  const userData: Record<string, unknown> = {
    country: [hashSha256("lk")],
  };

  if (input.email && input.email.trim()) {
    userData.em = [hashSha256(input.email.trim().toLowerCase())];
  }

  if (input.phone && input.phone.trim()) {
    const normalizedPhone = normalizePhoneForMeta(input.phone);
    if (normalizedPhone) {
      userData.ph = [hashSha256(normalizedPhone)];
    }
  }

  if (input.name && input.name.trim()) {
    const parts = input.name.trim().toLowerCase().split(/\s+/);
    if (parts[0]) {
      userData.fn = [hashSha256(parts[0])];
    }
    if (parts.length > 1) {
      userData.ln = [hashSha256(parts.slice(1).join(" "))];
    }
  }

  if (input.city && input.city.trim()) {
    const normalizedCity = input.city.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalizedCity) {
      userData.ct = [hashSha256(normalizedCity)];
    }
  }

  if (input.externalId && input.externalId.trim()) {
    userData.external_id = [hashSha256(input.externalId.trim())];
  }

  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  return userData;
}

export async function sendMetaCapiEvent(
  params: SendMetaCapiEventParams
): Promise<{ sent: boolean; skipped?: boolean; eventId: string; error?: string }> {
  const pixelId = (params.pixelIdOverride || process.env.META_PIXEL_ID || "").trim();
  const accessToken = (process.env.META_CAPI_ACCESS_TOKEN || "").trim();
  const testEventCode = (process.env.META_TEST_EVENT_CODE || "").trim();

  const hashedUserData = normalizeAndHashUserData(params.userData);
  const payloadBody: Record<string, unknown> = {
    data: [
      {
        event_name: params.eventName,
        event_time: params.eventTime || Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        action_source: params.actionSource || "website",
        ...(params.eventSourceUrl ? { event_source_url: params.eventSourceUrl } : {}),
        user_data: hashedUserData,
        ...(params.customData ? { custom_data: params.customData } : {}),
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  if (!pixelId || !accessToken) {
    console.info(
      "[Meta CAPI Dry-Run] Missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN. Event prepared:",
      JSON.stringify({ eventName: params.eventName, eventId: params.eventId })
    );
    return { sent: false, skipped: true, eventId: params.eventId };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBody),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.error?.message || `Meta CAPI responded with ${res.status}`;
      console.error("[Meta CAPI Error]", errMsg);
      return { sent: false, eventId: params.eventId, error: errMsg };
    }

    return { sent: true, eventId: params.eventId };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Meta CAPI network error";
    console.error("[Meta CAPI Exception]", errMsg);
    return { sent: false, eventId: params.eventId, error: errMsg };
  }
}
