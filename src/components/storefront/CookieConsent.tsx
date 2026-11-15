"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const CONSENT_STORAGE_KEY = "momentum_cookie_consent_v1";
const CONSENT_EVENT = "momentum-cookie-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getSnapshot(): boolean {
  try {
    return !window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export default function CookieConsent() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleChoice = (choice: "accepted" | "essential") => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
      window.dispatchEvent(new Event(CONSENT_EVENT));
    } catch {
      // Ignore storage access errors in restricted browsing modes
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-[#111111] text-[#fbfbf9] border border-neutral-800 p-5 shadow-2xl"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-neutral-400 mb-2">
        Privacy &amp; Cookies
      </p>
      <p className="text-xs text-neutral-300 leading-relaxed mb-4">
        We use essential cookies to keep your pre-order bag intact and optional cookies to measure
        storefront performance. Read our{" "}
        <Link href="/legal/privacy#cookies" className="underline text-white hover:opacity-80">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleChoice("accepted")}
          className="flex-1 bg-[#fbfbf9] text-[#111111] hover:bg-neutral-200 text-[11px] uppercase tracking-[0.18em] font-semibold py-2.5 px-4 transition-colors cursor-pointer"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => handleChoice("essential")}
          className="flex-1 border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 text-[11px] uppercase tracking-[0.18em] font-medium py-2.5 px-4 transition-colors cursor-pointer"
        >
          Essential Only
        </button>
      </div>
    </aside>
  );
}
