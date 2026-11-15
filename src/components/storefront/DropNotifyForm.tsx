"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function DropNotifyForm() {
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubmitted(true);
    setContact("");
  };

  return (
    <section className="border-t border-[#e5e5e0] bg-[#f4f4f0] py-14 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2 max-w-md">
          <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 font-medium block">
            Drop 02 · Early Access
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-wide text-black">
            Never Miss A Limited Drop
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Once a batch sells out, it doesn&apos;t restock. Leave your email or WhatsApp number
            for priority access to upcoming Denim, Everyday, Work, and Casual drops.
          </p>
        </div>

        <div className="w-full md:w-auto md:min-w-[380px]">
          {submitted ? (
            <div className="bg-white border border-[#e5e5e0] px-5 py-4 flex items-center gap-3 text-xs text-black">
              <Check size={16} className="text-emerald-700 shrink-0" />
              <span>
                You&apos;re on the Drop 02 priority list. We&apos;ll notify you before public
                launch.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or WhatsApp (e.g. 077...)"
                aria-label="Email or WhatsApp number for Drop 02 early access"
                className="flex-1 bg-white border border-neutral-300 focus:border-black focus:outline-none px-4 py-3.5 text-xs text-black placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="bg-[#111111] hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-3.5 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <span>Join List</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
