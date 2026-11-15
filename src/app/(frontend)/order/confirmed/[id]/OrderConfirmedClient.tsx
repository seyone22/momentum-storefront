"use client";

import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import Link from "next/link";
import { CheckCircle2, Package, Calendar, ArrowRight, MessageCircle } from "lucide-react";

interface OrderConfirmedClientProps {
  orderId: string;
}

export default function OrderConfirmedClient({ orderId }: OrderConfirmedClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center w-full">
        <div className="inline-flex p-3 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-600 mb-6">
          <CheckCircle2 size={36} />
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-medium block">
          Pre-Order Confirmed
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl uppercase tracking-tight text-neutral-950 mt-1">
          Allocation Reserved
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mt-3">
          Thank you for joining the Momentum inaugural drop. Your denim piece has entered the production schedule.
        </p>

        {/* Order Reference Box */}
        <div className="my-8 p-6 bg-white border border-[#e5e5e0] rounded-xs shadow-xs text-left max-w-lg mx-auto space-y-4">
          <div className="flex justify-between items-baseline pb-3 border-b border-neutral-200">
            <span className="text-xs uppercase tracking-wider text-neutral-500">Order Reference</span>
            <span className="font-mono font-bold text-sm text-black">#{orderId}</span>
          </div>

          <div className="flex items-start gap-3 text-xs text-neutral-700">
            <Calendar size={16} className="text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-black block">Production &amp; Dispatch Timeline</strong>
              <span>Target dispatch: 2nd Week of December 2026 via Prompt Xpress.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-neutral-700">
            <Package size={16} className="text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-black block">SMS &amp; Courier Notifications</strong>
              <span>Tracking details will be messaged to your phone upon courier handoff.</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium py-4 px-8 rounded-xs transition-all shadow-md inline-flex items-center justify-center gap-2"
          >
            <span>Return to Storefront</span>
            <ArrowRight size={14} />
          </Link>

          <a
            href={`https://wa.me/94770413814?text=${encodeURIComponent(
              `Hi Momentum, I am following up on my pre-order reference #${orderId}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 text-xs uppercase tracking-[0.18em] font-medium py-4 px-6 rounded-xs transition-all inline-flex items-center justify-center gap-2"
          >
            <MessageCircle size={15} className="text-emerald-600" />
            <span>Inquire on WhatsApp</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
