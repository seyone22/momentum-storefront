export interface AttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  capturedAt?: string;
}

const ATTRIBUTION_STORAGE_KEY = "momentum_attribution_v1";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getMetaCookies(fbclidFallback?: string): { fbp?: string; fbc?: string } {
  const fbp = readCookie("_fbp") || undefined;
  let fbc = readCookie("_fbc") || undefined;
  if (!fbc && fbclidFallback) {
    fbc = `fb.1.${Date.now()}.${fbclidFallback}`;
  }
  return { fbp, fbc };
}

export function getSavedAttribution(): AttributionData {
  if (typeof window === "undefined") return {};
  let stored: AttributionData = {};
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (raw) {
      stored = JSON.parse(raw) as AttributionData;
    }
  } catch {
    stored = {};
  }
  const { fbp, fbc } = getMetaCookies(stored.fbclid);
  return {
    ...stored,
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
  };
}

export function captureAttributionFromUrl(): AttributionData {
  if (typeof window === "undefined") return {};

  const existing = getSavedAttribution();
  const params = new URLSearchParams(window.location.search);

  const utmSource = params.get("utm_source")?.trim() || undefined;
  const utmMedium = params.get("utm_medium")?.trim() || undefined;
  const utmCampaign = params.get("utm_campaign")?.trim() || undefined;
  const utmContent = params.get("utm_content")?.trim() || undefined;
  const utmTerm = params.get("utm_term")?.trim() || undefined;
  const fbclid = params.get("fbclid")?.trim() || undefined;

  const hasNewParams = Boolean(
    utmSource || utmMedium || utmCampaign || utmContent || utmTerm || fbclid
  );

  const merged: AttributionData = {
    ...existing,
    ...(utmSource ? { utmSource } : {}),
    ...(utmMedium ? { utmMedium } : {}),
    ...(utmCampaign ? { utmCampaign } : {}),
    ...(utmContent ? { utmContent } : {}),
    ...(utmTerm ? { utmTerm } : {}),
    ...(fbclid ? { fbclid } : {}),
    ...(hasNewParams || !existing.capturedAt ? { capturedAt: new Date().toISOString() } : {}),
  };

  const { fbp, fbc } = getMetaCookies(merged.fbclid);
  if (fbp) merged.fbp = fbp;
  if (fbc) merged.fbc = fbc;

  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Ignore storage quota errors
  }

  return merged;
}
