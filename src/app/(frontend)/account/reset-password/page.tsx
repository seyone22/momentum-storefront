"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { Loader2, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/account/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to reset password");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-[#e5e5e0] p-6 rounded-xs shadow-xs">
      {done ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xs flex items-start gap-2.5">
            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
            <span>Your password has been reset and you are now signed in.</span>
          </div>
          <Link
            href="/account"
            className="block text-center w-full bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-medium py-3.5 rounded-xs"
          >
            Go to My Account
          </Link>
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
              New Password (min. 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-neutral-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !token}
            className="w-full bg-[#111111] hover:bg-black disabled:opacity-60 text-white text-xs uppercase tracking-[0.2em] font-medium py-3.5 rounded-xs transition-colors flex items-center justify-center gap-2"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : null}
            <span>{busy ? "Resetting..." : "Set New Password"}</span>
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />
      <main className="flex-1 max-w-md mx-auto px-4 sm:px-6 py-16 w-full">
        <h1 className="font-editorial text-3xl uppercase tracking-wide text-neutral-950 mb-2">
          Set New Password
        </h1>
        <p className="text-xs text-neutral-600 mb-6">
          Choose a strong password for your Momentum account.
        </p>
        <Suspense
          fallback={
            <div className="py-12 text-center text-xs uppercase tracking-widest text-neutral-500">
              Loading...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
