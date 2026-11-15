"use client";

import { useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { formatPriceLKR } from "@/lib/utils";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "Sashini Perera",
    email: "sashini.perera@example.com",
    phone: "0771234567",
    address: "No. 42, Ward Place",
    city: "Colombo 07",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderItems = [
    {
      id: "01",
      name: "Design 01 — Wide Leg",
      size: "28",
      priceLkr: 14500,
      quantity: 1,
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

      const redirectUrl = data.checkoutUrl || data.paymentUrl || data.url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="font-editorial text-3xl sm:text-4xl uppercase tracking-wide text-neutral-950">
            Checkout
          </h1>
        </div>

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
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.2em] font-semibold py-4 px-6 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-5 bg-[#f4f4f0] p-6 border border-[#e5e5de] space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-black pb-3 border-b border-neutral-300">
              Order Summary
            </h3>

            {orderItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-black">{item.name}</h4>
                  <p className="text-neutral-500">Size: {item.size}</p>
                </div>
                <span className="font-mono font-medium text-black">
                  {formatPriceLKR(item.priceLkr)}
                </span>
              </div>
            ))}

            <div className="border-t border-neutral-300 pt-4 flex justify-between text-sm font-semibold text-black">
              <span>Total</span>
              <span className="font-mono">{formatPriceLKR(subtotal)}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
