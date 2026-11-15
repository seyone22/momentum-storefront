import { getSavedAttribution } from "@/lib/attribution";
import { getSavedConsent } from "@/lib/cookie-consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export interface MetaFunnelContentItem {
  id: string;
  quantity: number;
  item_price?: number;
}

export interface TrackFunnelEventParams {
  eventName: "ViewContent" | "ViewSizeChart" | "AddToCart" | "InitiateCheckout" | "Purchase" | string;
  eventId?: string;
  customData?: {
    currency?: string;
    value?: number;
    order_id?: string;
    content_name?: string;
    content_type?: string;
    contents?: MetaFunnelContentItem[];
  };
  userData?: {
    email?: string;
    phone?: string;
    name?: string;
    city?: string;
    externalId?: string;
  };
}

const STANDARD_META_EVENTS = new Set([
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
]);

export function createMetaEventId(prefix = "evt"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function trackFunnelEvent(params: TrackFunnelEventParams): string | null {
  if (typeof window === "undefined") return null;

  const consent = getSavedConsent();
  if (!consent?.marketing) {
    return null;
  }

  const eventId = params.eventId || createMetaEventId(params.eventName.toLowerCase());
  const attribution = getSavedAttribution();

  if (typeof window.fbq === "function") {
    const method = STANDARD_META_EVENTS.has(params.eventName) ? "track" : "trackCustom";
    const payload = {
      ...(params.customData || {}),
      ...(params.customData?.contents
        ? {
            content_ids: params.customData.contents.map((c) => c.id),
          }
        : {}),
    };
    window.fbq(method, params.eventName, payload, { eventID: eventId });
  }

  fetch("/api/tracking/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventName: params.eventName,
      eventId,
      eventSourceUrl: window.location.href,
      customData: params.customData,
      userData: params.userData,
      fbp: attribution.fbp,
      fbc: attribution.fbc,
    }),
  }).catch(() => {
    // Non-blocking telemetry
  });

  return eventId;
}
