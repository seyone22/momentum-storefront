"use client";

import { useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { formatPriceLKR } from "@/lib/utils";
import { Search, Package, Clock, CheckCircle2, Truck, Loader2 } from "lucide-react";

interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  city: string;
  totalLkr: number;
  paymentRail: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  promptTrackingNumber: string | null;
  items: Array<{
    productName: string;
    size: string;
    quantity: number;
    unitPriceLkr: number;
  }>;
}

const STATUS_LABELS: Record<string, string> = {
  pre_order_placed: "Pre-Order Placed",
  payment_verified: "Payment Verified — Queued",
  in_production: "In Handcrafted Production",
  dispatched: "Dispatched via Prompt Xpress",
};

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(false);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const stepIndex =
    result?.fulfillmentStatus === "dispatched"
      ? 3
      : result?.fulfillmentStatus === "in_production"
        ? 2
        : result?.fulfillmentStatus === "payment_verified"
          ? 1
          : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
            Momentum Client Services
          </span>
          <h1 className="font-editorial text-4xl uppercase tracking-tight text-neutral-950 mt-1">
            Track Pre-Order
          </h1>
          <p className="text-xs text-neutral-600 mt-2">
            Enter your order reference code (e.g. MMTM-102945) or mobile phone number to view live garment status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-12">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. MMTM-489210 or 077XXXXXXX"
            className="flex-1 text-xs p-3.5 border border-neutral-300 rounded-xs focus:border-black focus:outline-none uppercase font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold px-6 rounded-xs transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            <span>Lookup</span>
          </button>
        </form>

        {/* Tracking Status Card */}
        {searched && (
          <div>
            {result ? (
              <div className="bg-white p-6 sm:p-8 border border-[#e5e5e0] rounded-xs shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-neutral-200 gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                      Order Reference
                    </span>
                    <span className="font-mono font-bold text-lg text-black">{result.orderNumber}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider rounded-xs">
                    <Clock size={13} />
                    <span>
                      {STATUS_LABELS[result.fulfillmentStatus] || result.fulfillmentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                      Items Ordered
                    </span>
                    <div className="font-semibold text-black mt-0.5 space-y-1">
                      {result.items.length > 0 ? (
                        result.items.map((item, idx) => (
                          <div key={idx}>
                            {item.productName} (Size {item.size}) &times; {item.quantity}
                          </div>
                        ))
                      ) : (
                        <span>Momentum Pre-Order</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                      Total &amp; Payment
                    </span>
                    <span className="font-semibold text-black mt-0.5 block">
                      {formatPriceLKR(result.totalLkr)} ({result.paymentStatus.toUpperCase()})
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                      Customer &amp; Destination
                    </span>
                    <span className="font-medium text-neutral-800 mt-0.5 block">
                      {result.customerName} — {result.city}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                      Courier Status
                    </span>
                    <span className="font-medium text-neutral-800 mt-0.5 block">
                      {result.promptTrackingNumber
                        ? `Prompt Xpress #${result.promptTrackingNumber}`
                        : "Prompt Xpress (Tracking pending handover)"}
                    </span>
                  </div>
                </div>

                {/* Visual Step Progress */}
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-[11px] font-medium text-neutral-600 mb-2">
                    <span className={`flex items-center gap-1 ${stepIndex >= 0 ? "text-emerald-700" : ""}`}>
                      <CheckCircle2 size={14} /> Placed
                    </span>
                    <span className={`flex items-center gap-1 ${stepIndex >= 2 ? "text-amber-700 font-bold" : ""}`}>
                      <Package size={14} /> Production
                    </span>
                    <span className={`flex items-center gap-1 ${stepIndex >= 3 ? "text-emerald-700 font-bold" : "text-neutral-400"}`}>
                      <Truck size={14} /> Dispatched
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-black h-full transition-all"
                      style={{
                        width:
                          stepIndex === 3
                            ? "100%"
                            : stepIndex === 2
                              ? "66%"
                              : stepIndex === 1
                                ? "40%"
                                : "20%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-white border border-[#e5e5e0] rounded-xs text-xs text-neutral-600">
                No active pre-order found matching <strong>&ldquo;{query}&rdquo;</strong>. Please double-check your order code or reach out on WhatsApp.
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
