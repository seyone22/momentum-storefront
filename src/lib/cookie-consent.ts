export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
  gpcApplied?: boolean;
}

export const CONSENT_STORAGE_KEY = "momentum_cookie_consent_v1";
export const CONSENT_COOKIE_NAME = "momentum_consent";
export const CONSENT_CHANGE_EVENT = "momentum-cookie-consent-change";
export const OPEN_PREFERENCES_EVENT = "momentum-open-cookie-preferences";
const CONSENT_VERSION = 1;
const SIX_MONTHS_SECONDS = 60 * 60 * 24 * 180;

export function isGpcEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  return Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
}

export function getSavedConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    // Handle legacy string values ("accepted" | "essential") gracefully
    if (raw === "accepted") {
      return {
        essential: true,
        analytics: true,
        marketing: true,
        updatedAt: new Date().toISOString(),
        version: CONSENT_VERSION,
      };
    }
    if (raw === "essential") {
      return {
        essential: true,
        analytics: false,
        marketing: false,
        updatedAt: new Date().toISOString(),
        version: CONSENT_VERSION,
      };
    }
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    if (typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") {
      return {
        essential: true,
        analytics: parsed.analytics,
        marketing: parsed.marketing,
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
        version: parsed.version ?? CONSENT_VERSION,
        gpcApplied: parsed.gpcApplied,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveConsent(prefs: { analytics: boolean; marketing: boolean }): CookiePreferences {
  const gpc = isGpcEnabled();
  const record: CookiePreferences = {
    essential: true,
    analytics: gpc ? false : prefs.analytics,
    marketing: gpc ? false : prefs.marketing,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
    ...(gpc ? { gpcApplied: true } : {}),
  };

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    const cookieVal = encodeURIComponent(
      JSON.stringify({ e: 1, a: record.analytics ? 1 : 0, m: record.marketing ? 1 : 0 })
    );
    document.cookie = `${CONSENT_COOKIE_NAME}=${cookieVal}; Path=/; Max-Age=${SIX_MONTHS_SECONDS}; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: record }));
  } catch {
    // Ignore storage errors in restricted environments
  }

  return record;
}

export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
