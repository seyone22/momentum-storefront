"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import {
  CONSENT_CHANGE_EVENT,
  OPEN_PREFERENCES_EVENT,
  getSavedConsent,
  isGpcEnabled,
  saveConsent,
} from "@/lib/cookie-consent";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): boolean {
  if (isGpcEnabled() && !getSavedConsent()) {
    // Honor Global Privacy Control (GPC) automatically without forcing a banner
    saveConsent({ analytics: false, marketing: false });
    return false;
  }
  return getSavedConsent() === null;
}

function getServerSnapshot(): boolean {
  return false;
}

export default function CookieConsent() {
  const showBanner = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [modalOpen, setModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      const existing = getSavedConsent();
      setAnalytics(existing?.analytics ?? false);
      setMarketing(existing?.marketing ?? false);
      setModalOpen(true);
    };

    window.addEventListener(OPEN_PREFERENCES_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, handleOpen);
  }, []);

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
    setModalOpen(false);
  };

  const essentialOnly = () => {
    saveConsent({ analytics: false, marketing: false });
    setModalOpen(false);
  };

  const saveCustom = () => {
    saveConsent({ analytics, marketing });
    setModalOpen(false);
  };

  return (
    <>
      {showBanner && !modalOpen && (
        <aside
          aria-label="Cookie preferences"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-[#111111] text-[#fbfbf9] border border-neutral-800 p-5 shadow-2xl"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-neutral-400 mb-2">
            Privacy &amp; Cookies
          </p>
          <p className="text-xs text-neutral-300 leading-relaxed mb-4">
            We use essential cookies to keep your pre-order bag intact, and optional cookies only
            with your consent to measure storefront performance. Read our{" "}
            <Link href="/legal/privacy#cookies" className="underline text-white hover:opacity-80">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={acceptAll}
              className="flex-1 bg-[#fbfbf9] text-[#111111] hover:bg-neutral-200 text-[11px] uppercase tracking-[0.16em] font-semibold py-2.5 px-3 transition-colors cursor-pointer"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={essentialOnly}
              className="flex-1 border border-neutral-700 text-neutral-200 hover:text-white hover:border-neutral-500 text-[11px] uppercase tracking-[0.16em] font-medium py-2.5 px-3 transition-colors cursor-pointer"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={() => {
                const existing = getSavedConsent();
                setAnalytics(existing?.analytics ?? false);
                setMarketing(existing?.marketing ?? false);
                setModalOpen(true);
              }}
              className="border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 text-[11px] uppercase tracking-[0.16em] font-medium py-2.5 px-3 transition-colors cursor-pointer"
            >
              Preferences
            </button>
          </div>
        </aside>
      )}

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-[#fbfbf9] text-neutral-800 border border-[#e5e5e0] shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#e5e5e0] pb-4">
              <div>
                <h2
                  id="cookie-modal-title"
                  className="font-editorial text-xl uppercase tracking-wide text-black"
                >
                  Cookie Preferences
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Manage your consent settings at any time. See our{" "}
                  <Link
                    href="/legal/privacy#cookies"
                    onClick={() => setModalOpen(false)}
                    className="underline text-black hover:opacity-75"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close cookie preferences"
                className="p-1 text-neutral-500 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-white border border-[#e5e5e0] flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-black uppercase tracking-wider text-[11px]">
                    Strictly Necessary
                  </p>
                  <p className="text-neutral-600 mt-1 leading-relaxed">
                    Required for your pre-order shopping bag, checkout security, and saving your
                    privacy preferences. Cannot be disabled.
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500 shrink-0 pt-0.5">
                  Always Active
                </span>
              </div>

              <label className="p-4 bg-white border border-[#e5e5e0] flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <p className="font-semibold text-black uppercase tracking-wider text-[11px]">
                    Analytics &amp; Performance
                  </p>
                  <p className="text-neutral-600 mt-1 leading-relaxed">
                    Helps us understand storefront traffic and improve page speed. Only enabled with
                    your explicit opt-in consent.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-black cursor-pointer shrink-0"
                />
              </label>

              <label className="p-4 bg-white border border-[#e5e5e0] flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <p className="font-semibold text-black uppercase tracking-wider text-[11px]">
                    Marketing &amp; Personalization
                  </p>
                  <p className="text-neutral-600 mt-1 leading-relaxed">
                    Used to measure campaign relevance for future drops. Never sold to third
                    parties.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-black cursor-pointer shrink-0"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={essentialOnly}
                className="flex-1 border border-neutral-300 text-neutral-800 hover:border-black text-[11px] uppercase tracking-[0.16em] font-medium py-3 px-4 transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={saveCustom}
                className="flex-1 bg-[#111111] text-white hover:bg-black text-[11px] uppercase tracking-[0.16em] font-semibold py-3 px-4 transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 border border-black bg-white text-black hover:bg-neutral-100 text-[11px] uppercase tracking-[0.16em] font-semibold py-3 px-4 transition-colors cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
