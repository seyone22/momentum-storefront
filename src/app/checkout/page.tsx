"use client";

import { useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { formatPriceLKR } from "@/lib/utils";
import { ShieldCheck, Lock, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "Sashini Perera",
    email: "sashini.perera@example.com",
    phone: "0771234567",
    address: "No. 42, Ward Place",
    city: "Colombo 07",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock checkout order from drop
  const orderItems = [
    {
      id: "prod_01",
      name: "The Head Turner Wide Leg",
      size: "28",
      priceLkr: 14500,
      quantity: 1,
      image: "/images/products/WhatsApp Image 2026-10-24 at 03.26.29.jpeg",
    },
  ];

  const subtotal = orderItems.reduce((s, i) => s + i.priceLkr * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const orderId = `MMTM-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amountLkr: subtotal,
          description: `Pre-Order ${orderId}: ${orderItems[0].name} (Size ${orderItems[0].size})`,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Payments.lk returns redirect URL in checkoutUrl or url
      const redirectUrl = data.checkoutUrl || data.paymentUrl || data.url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        // Fallback simulation for sandbox if no direct redirect URL
        window.location.href = `/order/confirmed/${orderId}`;
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
            Pre-Order Allocation Check
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl uppercase tracking-wide text-neutral-950 mt-1">
            Express Checkout
          </h1>
          <p className="text-xs text-neutral-600 mt-2">
            Secured by <strong>Payments.lk</strong> (Central Bank of Sri Lanka Certified Gateway)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Customer & Shipping Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#e5e5e0] rounded-xs shadow-xs">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-black mb-6 pb-3 border-b border-neutral-200">
              1. Delivery &amp; Contact Details
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 border border-neutral-300 rounded-xs focus:border-black focus:outline-none"
                  placeholder="e.g. Kasun Fernando"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 rounded-xs focus:border-black focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                    Mobile Phone (for Courier SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 rounded-xs focus:border-black focus:outline-none"
                    placeholder="077XXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs p-3 border border-neutral-300 rounded-xs focus:border-black focus:outline-none"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                  City / Postal Region *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-3 border border-neutral-300 rounded-xs focus:border-black focus:outline-none"
                  placeholder="Colombo 03 / Kandy / Galle"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-3 border border-neutral-300 rounded-xs focus:border-black focus:outline-none"
                  placeholder="Leave at security gate / Call before delivery"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold py-4.5 px-6 rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Connecting to Payments.lk Secure Rail...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>Pay {formatPriceLKR(subtotal)} with Payments.lk</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-2">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>256-Bit SSL Encrypted. Supports Visa, Mastercard, LankaQR &amp; Amex.</span>
              </div>
            </form>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#f4f4f0] p-6 border border-[#e5e5de] rounded-xs space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-black pb-3 border-b border-neutral-300">
                Pre-Order Summary
              </h3>

              {orderItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 bg-neutral-200 border border-neutral-300 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-neutral-900">{item.name}</h4>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Size: <span className="font-mono font-medium">{item.size}</span> (Inches)
                    </p>
                    <p className="text-[11px] font-mono text-black font-semibold mt-1">
                      {formatPriceLKR(item.priceLkr)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-neutral-300 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-black">
                    {formatPriceLKR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Prompt Xpress Courier Delivery</span>
                  <span className="text-emerald-700 font-medium">Free (Inaugural Drop)</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-black pt-2 border-t border-neutral-300">
                  <span>Total Due</span>
                  <span className="font-mono">{formatPriceLKR(subtotal)}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-200">
                <strong>Pre-Order Schedule:</strong> Handcrafted to your selected sizing specifications in Colombo. Courier dispatch commences the 2nd week of December 2026.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
