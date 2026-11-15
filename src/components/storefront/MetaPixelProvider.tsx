"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { captureAttributionFromUrl } from "@/lib/attribution";
import {
  CONSENT_CHANGE_EVENT,
  CookiePreferences,
  getSavedConsent,
} from "@/lib/cookie-consent";

interface MetaPixelProviderProps {
  pixelId?: string | null;
}

export default function MetaPixelProvider({ pixelId }: MetaPixelProviderProps) {
  const [marketingConsented, setMarketingConsented] = useState(false);

  useEffect(() => {
    captureAttributionFromUrl();

    const syncConsent = (prefs: CookiePreferences | null) => {
      setMarketingConsented(Boolean(prefs?.marketing));
    };

    syncConsent(getSavedConsent());

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<CookiePreferences>;
      syncConsent(customEvent.detail || getSavedConsent());
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    };
  }, []);

  const sanitizedPixelId = pixelId?.trim();
  if (!sanitizedPixelId || !marketingConsented) {
    return null;
  }

  return (
    <Script
      id="momentum-meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${sanitizedPixelId.replace(/[^a-zA-Z0-9_-]/g, "")}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}
