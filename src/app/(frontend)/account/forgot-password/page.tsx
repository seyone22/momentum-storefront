"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/account/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to send reset request");
      setMessage(data.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to send reset request");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto px-4 sm:px-6 py-16 w-full">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-500 hover:text-black mb-8"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>

        <h1 className="font-editorial text-3xl uppercase tracking-wide text-neutral-950 mb-2">
          Reset Password
        </h1>
        <p className="text-xs text-neutral-600 mb-6">
          Enter the email address associated with your Momentum account.
        </p>

        <div className="bg-white border border-[#e5e5e0] p-6 rounded-xs shadow-xs">
          {message ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xs flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xs">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-neutral-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#111111] hover:bg-black disabled:opacity-60 text-white text-xs uppercase tracking-[0.2em] font-medium py-3.5 rounded-xs transition-colors flex items-center justify-center gap-2"
              >
                {busy ? <Loader2 size={15} className="animate-spin" /> : null}
                <span>{busy ? "Sending..." : "Request Reset Link"}</span>
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
