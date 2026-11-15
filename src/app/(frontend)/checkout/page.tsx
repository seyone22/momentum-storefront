"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { useCart } from "@/context/CartContext";
import { formatPriceLKR } from "@/lib/utils";
import { getSavedAttribution } from "@/lib/attribution";
import { trackFunnelEvent } from "@/lib/meta-pixel";
import { SRI_LANKA_DISTRICTS } from "@/lib/sri-lanka";
import { Lock, ArrowRight, Loader2, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const hasTrackedCheckoutRef = useRef(false);

  useEffect(() => {
    if (!isHydrated || items.length === 0 || hasTrackedCheckoutRef.current) return;
    hasTrackedCheckoutRef.current = true;
    trackFunnelEvent({
      eventName: "InitiateCheckout",
      customData: {
        currency: "LKR",
        value: subtotal,
        content_type: "product",
        contents: items.map((i) => ({
          id: i.slug || i.id,
          quantity: i.quantity,
          item_price: i.priceLkr,
        })),
      },
    });
  }, [isHydrated, items, subtotal]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "Colombo",
    postalCode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [marketingEmailOptIn, setMarketingEmailOptIn] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/account/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.customer) {
          setSignedInEmail(data.customer.email);
          setFormData((prev) => ({
            name: prev.name || data.customer.name || "",
            email: prev.email || data.customer.email || "",
            phone: prev.phone || data.customer.phone || "",
            address: prev.address || data.customer.defaultAddress || "",
            city: prev.city || data.customer.defaultCity || "",
            district: data.customer.defaultDistrict || prev.district || "Colombo",
            postalCode: prev.postalCode || data.customer.defaultPostalCode || "",
          }));
          if (data.customer.marketingEmailOptIn) {
            setMarketingEmailOptIn(true);
          }
        }
      })
      .catch(() => {
        // Optional session prefill
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!acceptedPolicies) {
      setError("Please accept the Terms & Conditions and Privacy Policy to proceed.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            size: i.size,
            quantity: i.quantity,
            priceLkr: i.priceLkr,
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            district: formData.district,
            postalCode: formData.postalCode,
            marketingEmailOptIn,
          },
          attribution: getSavedAttribution(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      const redirectUrl = data.checkoutUrl || data.paymentUrl || data.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        clearCart();
        window.location.href = `/order/confirmed/${data.orderNumber}`;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="font-editorial text-3xl sm:text-4xl uppercase tracking-wide text-neutral-950">
            Checkout
          </h1>
          <p className="text-xs text-neutral-600 mt-2">
            {signedInEmail ? (
              <span>
                Signed in as <strong className="text-black">{signedInEmail}</strong> &middot;{" "}
                <Link href="/account" className="underline hover:text-black">
                  Manage Account
                </Link>
              </span>
            ) : (
              <span>
                Have an account?{" "}
                <Link href="/account" className="underline hover:text-black">
                  Sign in
                </Link>{" "}
                to prefill your saved address &amp; track orders.
              </span>
            )}
          </p>
        </div>

        {!isHydrated ? (
          <div className="py-20 text-center text-xs uppercase tracking-widest text-neutral-500">
            Loading your bag...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-[#e5e5e0] p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="inline-flex p-3 bg-[#f4f4f0] border border-[#e5e5e0] text-neutral-600">
              <ShoppingBag size={24} strokeWidth={1.5} />
            </div>
            <h2 className="font-editorial text-2xl uppercase tracking-wider text-black">
              Your bag is empty
            </h2>
            <p className="text-xs text-neutral-500">
              Select a piece and size before proceeding to pre-order checkout.
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white text-[11px] uppercase tracking-[0.2em] px-6 py-3.5 hover:bg-neutral-800 transition-colors"
            >
              Browse All Pieces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-7 bg-white p-6 sm:p-8 border border-[#e5e5e0]">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-black mb-6 pb-3 border-b border-neutral-200">
                Delivery Details
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="07X XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Street address / apartment"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombo 07"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                      District
                    </label>
                    <select
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full text-xs p-3 border border-neutral-300 bg-white focus:border-black focus:outline-none"
                    >
                      {SRI_LANKA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                      Zip / Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 00700"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <label className="flex items-start gap-2.5 text-xs text-neutral-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={marketingEmailOptIn}
                      onChange={(e) => setMarketingEmailOptIn(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-black border-neutral-300 cursor-pointer shrink-0"
                    />
                    <span className="leading-relaxed">
                      Email me with news, limited drop announcements, and exclusive Momentum offers.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-neutral-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedPolicies}
                      onChange={(e) => setAcceptedPolicies(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-black border-neutral-300 cursor-pointer shrink-0"
                    />
                    <span className="leading-relaxed">
                      I have read and agree to the{" "}
                      <Link
                        href="/legal/terms"
                        target="_blank"
                        className="underline text-black hover:opacity-75"
                      >
                        Terms &amp; Conditions
                      </Link>
                      ,{" "}
                      <Link
                        href="/legal/privacy"
                        target="_blank"
                        className="underline text-black hover:opacity-75"
                      >
                        Privacy Policy
                      </Link>
                      ,{" "}
                      <Link
                        href="/legal/shipping"
                        target="_blank"
                        className="underline text-black hover:opacity-75"
                      >
                        Shipping Policy
                      </Link>
                      , and{" "}
                      <Link
                        href="/legal/returns"
                        target="_blank"
                        className="underline text-black hover:opacity-75"
                      >
                        Refund &amp; Exchange Policy
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !acceptedPolicies}
                    className="w-full bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.2em] font-semibold py-4 px-6 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Redirecting to Payments.lk...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>Pay {formatPriceLKR(subtotal)}</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-[11px] text-neutral-500 text-center">
                    256-bit SSL encrypted checkout via Payments.lk (CBSL compliant) · All prices in LKR.
                  </p>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-5 bg-[#f4f4f0] p-6 border border-[#e5e5de] space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-black pb-3 border-b border-neutral-300">
                Order Summary
              </h3>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between text-xs gap-3">
                    <div>
                      <h4 className="font-semibold text-black">{item.name}</h4>
                      <p className="text-neutral-500">
                        Size: {item.size} &times; {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-medium text-black shrink-0">
                      {formatPriceLKR(item.priceLkr * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-300 pt-4 flex justify-between text-sm font-semibold text-black">
                <span>Total</span>
                <span className="font-mono">{formatPriceLKR(subtotal)}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
