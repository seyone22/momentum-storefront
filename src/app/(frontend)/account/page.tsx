"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { formatPriceLKR } from "@/lib/utils";
import { SRI_LANKA_DISTRICTS } from "@/lib/sri-lanka";
import {
  User,
  Package,
  Lock,
  LogOut,
  Loader2,
  CheckCircle2,
  ArrowRight,
  MapPin,
} from "lucide-react";

interface CustomerProfile {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  defaultAddress?: string | null;
  defaultCity?: string | null;
  defaultDistrict?: string | null;
  defaultPostalCode?: string | null;
  marketingEmailOptIn?: boolean;
}

interface CustomerOrder {
  id: string | number;
  orderNumber: string;
  totalLkr: number;
  refundedLkr?: number;
  paymentRail: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  promptTrackingNumber?: string | null;
  city: string;
  createdAt: string;
  items: Array<{
    productName: string;
    size: string;
    quantity: number;
    unitPriceLkr: number;
  }>;
}

const FULFILLMENT_LABELS: Record<string, string> = {
  pre_order_placed: "Pre-Order Placed",
  payment_verified: "Payment Verified",
  in_production: "In Production",
  dispatched: "Dispatched",
};

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  // Auth form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    defaultAddress: "",
    defaultCity: "",
    defaultDistrict: "Colombo",
    defaultPostalCode: "",
    marketingEmailOptIn: false,
  });
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password change state
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadAccount = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        if (data.customer) {
          setProfileForm({
            name: data.customer.name || "",
            phone: data.customer.phone || "",
            defaultAddress: data.customer.defaultAddress || "",
            defaultCity: data.customer.defaultCity || "",
            defaultDistrict: data.customer.defaultDistrict || "Colombo",
            defaultPostalCode: data.customer.defaultPostalCode || "",
            marketingEmailOptIn: Boolean(data.customer.marketingEmailOptIn),
          });
        }
      } else {
        setCustomer(null);
        setOrders([]);
      }
    } catch {
      setCustomer(null);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      await loadAccount();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      await loadAccount();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/account/logout", { method: "POST" });
    setCustomer(null);
    setOrders([]);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileBusy(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/account/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setCustomer(data.customer);
      setProfileMsg({ type: "ok", text: "Profile and delivery address saved." });
    } catch (err: unknown) {
      setProfileMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save profile",
      });
    } finally {
      setProfileBusy(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    setPwBusy(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update failed");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwMsg({ type: "ok", text: "Password updated successfully." });
    } catch (err: unknown) {
      setPwMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to update password",
      });
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-neutral-500 flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span>Loading account...</span>
          </div>
        ) : !customer ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-medium block">
                Momentum Client Portal
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl uppercase tracking-wide text-neutral-950 mt-1">
                {authTab === "login" ? "Sign In" : "Create Account"}
              </h1>
              <p className="text-xs text-neutral-600 mt-2">
                View your pre-orders, save your delivery address, and manage your account.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e0] rounded-xs p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-2 border-b border-neutral-200 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("login");
                    setAuthError(null);
                  }}
                  className={`pb-3 text-xs uppercase tracking-[0.18em] font-medium border-b-2 transition-colors ${
                    authTab === "login"
                      ? "border-black text-black"
                      : "border-transparent text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("register");
                    setAuthError(null);
                  }}
                  className={`pb-3 text-xs uppercase tracking-[0.18em] font-medium border-b-2 transition-colors ${
                    authTab === "register"
                      ? "border-black text-black"
                      : "border-transparent text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  Register
                </button>
              </div>

              {authError && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xs">
                  {authError}
                </div>
              )}

              {authTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full border border-neutral-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600">
                        Password
                      </label>
                      <Link
                        href="/account/forgot-password"
                        className="text-[11px] text-neutral-500 hover:text-black underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full border border-neutral-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authBusy}
                    className="w-full bg-[#111111] hover:bg-black disabled:opacity-60 text-white text-xs uppercase tracking-[0.2em] font-medium py-3.5 rounded-xs transition-colors flex items-center justify-center gap-2"
                  >
                    {authBusy ? <Loader2 size={15} className="animate-spin" /> : null}
                    <span>{authBusy ? "Signing In..." : "Sign In"}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full border border-neutral-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
                      placeholder="Amaya Perera"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full border border-neutral-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5">
                      WhatsApp / Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full border border-neutral-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
                      placeholder="077 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5">
                      Password (min. 8 characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full border border-neutral-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authBusy}
                    className="w-full bg-[#111111] hover:bg-black disabled:opacity-60 text-white text-xs uppercase tracking-[0.2em] font-medium py-3.5 rounded-xs transition-colors flex items-center justify-center gap-2"
                  >
                    {authBusy ? <Loader2 size={15} className="animate-spin" /> : null}
                    <span>{authBusy ? "Creating Account..." : "Create Account"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5e5e0]">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-medium block">
                  Momentum Member
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl uppercase tracking-wide text-neutral-950 mt-1">
                  Welcome, {customer.name}
                </h1>
                <p className="text-xs text-neutral-600 mt-1">{customer.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="self-start sm:self-auto inline-flex items-center gap-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900 text-xs uppercase tracking-[0.18em] px-4 py-2.5 rounded-xs transition-colors"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Order History */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-neutral-700" />
                  <h2 className="font-editorial text-2xl uppercase tracking-wider text-neutral-950">
                    Order History
                  </h2>
                </div>
                <Link
                  href="/track"
                  className="text-xs uppercase tracking-wider text-neutral-600 hover:text-black underline"
                >
                  Track or Request Return
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white border border-[#e5e5e0] p-8 text-center space-y-3 rounded-xs">
                  <p className="text-sm text-neutral-600">No pre-orders linked to this account yet.</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-[#111111] text-white text-xs uppercase tracking-[0.18em] px-5 py-3 rounded-xs"
                  >
                    <span>Explore Drop 01</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderNumber}
                      className="bg-white border border-[#e5e5e0] p-5 sm:p-6 rounded-xs space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                        <div>
                          <span className="font-mono font-bold text-sm text-black">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-neutral-500 ml-3">
                            {new Date(order.createdAt).toLocaleDateString("en-LK", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
                          <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-xs">
                            {FULFILLMENT_LABELS[order.fulfillmentStatus] || order.fulfillmentStatus}
                          </span>
                          <span className="px-2.5 py-1 border border-neutral-200 text-neutral-700 rounded-xs">
                            Payment: {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-neutral-800">
                              {item.productName} (Size {item.size}) &times; {item.quantity}
                            </span>
                            <span className="font-mono text-neutral-900">
                              {formatPriceLKR(item.unitPriceLkr * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
                        <div className="font-semibold">
                          Total:{" "}
                          <span className="font-mono">{formatPriceLKR(order.totalLkr)}</span>
                          {order.promptTrackingNumber && (
                            <span className="text-neutral-500 font-normal ml-3">
                              Prompt Xpress: <span className="font-mono">{order.promptTrackingNumber}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/order/confirmed/${order.orderNumber}`}
                            className="text-neutral-800 hover:text-black underline uppercase tracking-wider text-[11px]"
                          >
                            View Receipt
                          </Link>
                          <Link
                            href="/track"
                            className="text-neutral-600 hover:text-black underline uppercase tracking-wider text-[11px]"
                          >
                            Returns / Track
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Profile + Password Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Saved Profile & Address */}
              <section className="bg-white border border-[#e5e5e0] p-6 rounded-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <MapPin size={17} className="text-neutral-700" />
                  <h2 className="font-editorial text-xl uppercase tracking-wider text-neutral-950">
                    Profile &amp; Saved Address
                  </h2>
                </div>

                {profileMsg && (
                  <div
                    className={`p-3 text-xs rounded-xs border flex items-center gap-2 ${
                      profileMsg.type === "ok"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {profileMsg.type === "ok" && <CheckCircle2 size={14} />}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                      Default Delivery Address
                    </label>
                    <textarea
                      rows={2}
                      value={profileForm.defaultAddress}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, defaultAddress: e.target.value })
                      }
                      className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileForm.defaultCity}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, defaultCity: e.target.value })
                      }
                      className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                        District
                      </label>
                      <select
                        value={profileForm.defaultDistrict}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, defaultDistrict: e.target.value })
                        }
                        className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                      >
                        {SRI_LANKA_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                        Zip / Postal Code
                      </label>
                      <input
                        type="text"
                        value={profileForm.defaultPostalCode}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, defaultPostalCode: e.target.value })
                        }
                        placeholder="e.g. 00700"
                        className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                  <label className="flex items-start gap-2.5 text-xs text-neutral-600 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={profileForm.marketingEmailOptIn}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, marketingEmailOptIn: e.target.checked })
                      }
                      className="mt-0.5 h-4 w-4 accent-black border-neutral-300 cursor-pointer shrink-0"
                    />
                    <span className="leading-relaxed">
                      Email me with news, limited drop announcements, and exclusive Momentum offers.
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={profileBusy}
                    className="bg-[#111111] hover:bg-black disabled:opacity-60 text-white text-xs uppercase tracking-[0.18em] font-medium px-6 py-3 rounded-xs transition-colors inline-flex items-center gap-2"
                  >
                    {profileBusy ? <Loader2 size={14} className="animate-spin" /> : <User size={14} />}
                    <span>{profileBusy ? "Saving..." : "Save Profile"}</span>
                  </button>
                </form>
              </section>

              {/* Change Password */}
              <section className="bg-white border border-[#e5e5e0] p-6 rounded-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <Lock size={17} className="text-neutral-700" />
                  <h2 className="font-editorial text-xl uppercase tracking-wider text-neutral-950">
                    Change Password
                  </h2>
                </div>

                {pwMsg && (
                  <div
                    className={`p-3 text-xs rounded-xs border flex items-center gap-2 ${
                      pwMsg.type === "ok"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {pwMsg.type === "ok" && <CheckCircle2 size={14} />}
                    <span>{pwMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                      New Password (min. 8 characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={pwForm.confirmPassword}
                      onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                      className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pwBusy}
                    className="bg-[#111111] hover:bg-black disabled:opacity-60 text-white text-xs uppercase tracking-[0.18em] font-medium px-6 py-3 rounded-xs transition-colors inline-flex items-center gap-2"
                  >
                    {pwBusy ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                    <span>{pwBusy ? "Updating..." : "Update Password"}</span>
                  </button>
                </form>
              </section>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
