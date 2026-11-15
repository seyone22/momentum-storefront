import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CookieConsent from "@/components/storefront/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Momentum Clothing | Contemporary Sri Lankan Apparel",
  description:
    "Limited-batch contemporary apparel by Momentum Clothing, operated by Grace Hood Ventures (PVT) LTD, Colombo, Sri Lanka.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

import { getPayload } from "payload";
import configPromise from "@payload-config";
import MetaPixelProvider from "@/components/storefront/MetaPixelProvider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || null;
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({ slug: "store-settings" });
    if (settings?.metaPixelId) {
      metaPixelId = String(settings.metaPixelId);
    }
  } catch {
    // Safe fallback to env variable during build or if DB is unavailable
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <MetaPixelProvider pixelId={metaPixelId} />
          {children}
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}
