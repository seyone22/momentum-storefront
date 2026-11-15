"use client";

import { useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { Search, Package, Clock, CheckCircle2, Truck } from "lucide-react";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    if (query.trim().toUpperCase().includes("MMTM") || query.length >= 7) {
      setResult({
        orderId: query.trim().toUpperCase(),
        product: "The Head Turner Wide Leg",
        size: "28",
        customer: "Sashini Perera",
        status: "in_production",
        statusLabel: "In Handcrafted Production",
        courier: "Prompt Xpress (Tracking pending handover)",
        dispatchWindow: "2nd Week of December 2026",
      });
    } else {
      setResult(null);
    }
  };

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
            Enter your order reference code (e.g. MMTM-10294) or mobile phone number to view live garment status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-12">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. MMTM-48921 or 077XXXXXXX"
            className="flex-1 text-xs p-3.5 border border-neutral-300 rounded-xs focus:border-black focus:outline-none uppercase font-mono"
          />
          <button
            type="submit"
            className="bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold px-6 rounded-xs transition-all flex items-center gap-2"
          >
            <Search size={14} />
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
                    <span className="font-mono font-bold text-lg text-black">{result.orderId}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider rounded-xs">
                    <Clock size={13} />
                    <span>{result.statusLabel}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                      Piece &amp; Selected Size
                    </span>
                    <span className="font-semibold text-black mt-0.5 block">
                      {result.product} (Size {result.size})
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                      Estimated Dispatch Window
                    </span>
                    <span className="font-semibold text-black mt-0.5 block">
                      {result.dispatchWindow}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                      Fulfillment Partner
                    </span>
                    <span className="text-neutral-800 mt-0.5 block flex items-center gap-1.5">
                      <Truck size={14} />
                      {result.courier}
                    </span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="pt-6 border-t border-neutral-200">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-4">
                    Lifecycle Timeline
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium uppercase tracking-wider">
                    <div className="space-y-1.5 text-black">
                      <div className="h-1 bg-black rounded-full" />
                      <span>Pre-Order Placed</span>
                    </div>
                    <div className="space-y-1.5 text-black">
                      <div className="h-1 bg-black rounded-full" />
                      <span>Payment Verified</span>
                    </div>
                    <div className="space-y-1.5 text-blue-600">
                      <div className="h-1 bg-blue-600 rounded-full animate-pulse" />
                      <span>In Production</span>
                    </div>
                    <div className="space-y-1.5 text-neutral-300">
                      <div className="h-1 bg-neutral-200 rounded-full" />
                      <span>Dispatched</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-neutral-50 border border-neutral-200 text-center rounded-xs text-xs text-neutral-600">
                No active pre-order found for "<strong>{query}</strong>". Please verify your reference number or contact our WhatsApp concierge.
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
