"use client";

import { useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { formatPriceLKR } from "@/lib/utils";
import { Search, Package, Clock, CheckCircle2, Truck, Loader2, RotateCcw, Upload } from "lucide-react";

interface TrackedReturn {
  rmaNumber: string;
  type: string;
  status: string;
  refundStatus: string;
  refundAmountLkr: number;
  pickupTrackingNumber: string | null;
  createdAt: string;
}

interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  city: string;
  totalLkr: number;
  refundedLkr?: number;
  paymentRail: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  promptTrackingNumber: string | null;
  items: Array<{
    productId?: string;
    productName: string;
    size: string;
    quantity: number;
    unitPriceLkr: number;
  }>;
  returns?: TrackedReturn[];
}

const STATUS_LABELS: Record<string, string> = {
  pre_order_placed: "Pre-Order Placed",
  payment_verified: "Payment Verified — Queued",
  in_production: "In Handcrafted Production",
  dispatched: "Dispatched via Prompt Xpress",
};

const RMA_STATUS_LABELS: Record<string, string> = {
  requested: "Requested (Under Review)",
  approved: "Approved for Pickup",
  pickup_scheduled: "Prompt Xpress Pickup Scheduled",
  received_inspecting: "Received & Inspecting (Ja-Ela)",
  completed: "Completed",
  rejected: "Rejected",
};

const RMA_TYPE_LABELS: Record<string, string> = {
  size_exchange: "Size Exchange",
  defective_replacement: "Defective Replacement",
  refund_claim: "Refund Claim",
};

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // RMA Request form state
  const [showRmaForm, setShowRmaForm] = useState(false);
  const [rmaPhone, setRmaPhone] = useState("");
  const [rmaType, setRmaType] = useState<"size_exchange" | "defective_replacement" | "refund_claim">("size_exchange");
  const [rmaItemIndex, setRmaItemIndex] = useState(0);
  const [rmaExchangeSize, setRmaExchangeSize] = useState("28");
  const [rmaReason, setRmaReason] = useState("");
  const [rmaPhotos, setRmaPhotos] = useState<FileList | null>(null);
  const [rmaSubmitting, setRmaSubmitting] = useState(false);
  const [rmaSuccess, setRmaSuccess] = useState<string | null>(null);
  const [rmaError, setRmaError] = useState<string | null>(null);

  const fetchOrder = async (q: string) => {
    const res = await fetch(`/api/orders/track?q=${encodeURIComponent(q.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    } else {
      setResult(null);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(false);
    setShowRmaForm(false);
    setRmaSuccess(null);
    setRmaError(null);

    try {
      await fetchOrder(query);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleRmaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setRmaError(null);
    setRmaSuccess(null);
    setRmaSubmitting(true);

    try {
      const selectedItem = result.items[rmaItemIndex] || result.items[0];
      const formData = new FormData();
      formData.append("orderNumber", result.orderNumber);
      formData.append("customerPhone", rmaPhone);
      formData.append("type", rmaType);
      if (selectedItem) {
        formData.append("productId", String(selectedItem.productId || ""));
        formData.append("productName", selectedItem.productName);
        formData.append("size", selectedItem.size);
        formData.append("quantity", String(selectedItem.quantity));
        formData.append("unitPriceLkr", String(selectedItem.unitPriceLkr));
      }
      if (rmaType === "size_exchange") {
        formData.append("exchangeSize", rmaExchangeSize);
      }
      formData.append("reason", rmaReason);
      if (rmaPhotos) {
        for (let i = 0; i < Math.min(3, rmaPhotos.length); i++) {
          formData.append("photos", rmaPhotos[i]);
        }
      }

      const res = await fetch("/api/returns/request", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setRmaSuccess(`Request ${data.rmaNumber} submitted. Our Ja-Ela team will review it shortly.`);
      setRmaReason("");
      setRmaPhotos(null);
      setShowRmaForm(false);
      await fetchOrder(result.orderNumber);
    } catch (err: unknown) {
      setRmaError(err instanceof Error ? err.message : "Could not submit return request.");
    } finally {
      setRmaSubmitting(false);
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

                {/* Existing Returns / Exchanges */}
                {result.returns && result.returns.length > 0 && (
                  <div className="pt-5 border-t border-neutral-200 space-y-3">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-black">
                      Return &amp; Exchange Requests
                    </h3>
                    <div className="space-y-2">
                      {result.returns.map((rma) => (
                        <div
                          key={rma.rmaNumber}
                          className="p-3.5 bg-[#f4f4f0] border border-[#e5e5e0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-black">{rma.rmaNumber}</span>
                            <span className="text-neutral-600 ml-2">
                              — {RMA_TYPE_LABELS[rma.type] || rma.type}
                            </span>
                            {rma.pickupTrackingNumber && (
                              <span className="block text-[11px] text-neutral-500 mt-0.5">
                                Pickup Tracking: #{rma.pickupTrackingNumber}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-white border border-neutral-300 text-[10px] uppercase tracking-wider font-semibold text-black">
                              {RMA_STATUS_LABELS[rma.status] || rma.status}
                            </span>
                            {rma.refundStatus !== "none" && (
                              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-[10px] uppercase tracking-wider font-semibold text-emerald-800">
                                Refund: {rma.refundStatus.replace(/_/g, " ")}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rmaSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    {rmaSuccess}
                  </div>
                )}

                {/* Self-Service Return / Size Exchange Trigger */}
                {(result.paymentStatus === "paid" ||
                  result.fulfillmentStatus === "payment_verified" ||
                  result.fulfillmentStatus === "dispatched") && (
                  <div className="pt-4 border-t border-neutral-200">
                    {!showRmaForm ? (
                      <button
                        type="button"
                        onClick={() => setShowRmaForm(true)}
                        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-black border border-black px-4 py-2.5 hover:bg-black hover:text-white transition-colors"
                      >
                        <RotateCcw size={13} />
                        <span>Request Size Exchange or Defect Claim</span>
                      </button>
                    ) : (
                      <form onSubmit={handleRmaSubmit} className="space-y-4 bg-[#fafaf8] border border-[#e5e5e0] p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
                            Submit Return / Exchange Request
                          </h3>
                          <button
                            type="button"
                            onClick={() => setShowRmaForm(false)}
                            className="text-[11px] uppercase tracking-wider text-neutral-500 hover:text-black"
                          >
                            Cancel
                          </button>
                        </div>

                        {rmaError && (
                          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                            {rmaError}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                              Verify Order Phone Number *
                            </label>
                            <input
                              type="tel"
                              required
                              value={rmaPhone}
                              onChange={(e) => setRmaPhone(e.target.value)}
                              placeholder="077XXXXXXX"
                              className="w-full text-xs p-2.5 border border-neutral-300 bg-white focus:border-black focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                              Request Type *
                            </label>
                            <select
                              value={rmaType}
                              onChange={(e) =>
                                setRmaType(
                                  e.target.value as
                                    | "size_exchange"
                                    | "defective_replacement"
                                    | "refund_claim"
                                )
                              }
                              className="w-full text-xs p-2.5 border border-neutral-300 bg-white focus:border-black focus:outline-none"
                            >
                              <option value="size_exchange">Size Exchange (7-Day Window)</option>
                              <option value="defective_replacement">
                                Defective / Damaged Replacement (48h Claim)
                              </option>
                              <option value="refund_claim">Refund Claim</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {result.items.length > 0 && (
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                                Garment
                              </label>
                              <select
                                value={rmaItemIndex}
                                onChange={(e) => setRmaItemIndex(Number(e.target.value))}
                                className="w-full text-xs p-2.5 border border-neutral-300 bg-white focus:border-black focus:outline-none"
                              >
                                {result.items.map((item, idx) => (
                                  <option key={idx} value={idx}>
                                    {item.productName} (Size {item.size})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {rmaType === "size_exchange" && (
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                                Requested Replacement Size
                              </label>
                              <select
                                value={rmaExchangeSize}
                                onChange={(e) => setRmaExchangeSize(e.target.value)}
                                className="w-full text-xs p-2.5 border border-neutral-300 bg-white focus:border-black focus:outline-none"
                              >
                                {["26", "28", "30", "32", "34"].map((s) => (
                                  <option key={s} value={s}>
                                    Size {s}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                            Reason / Fit or Defect Notes *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={rmaReason}
                            onChange={(e) => setRmaReason(e.target.value)}
                            placeholder="Describe the size needed or manufacturing/transit issue..."
                            className="w-full text-xs p-2.5 border border-neutral-300 bg-white focus:border-black focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                            Defect / Condition Photos (Optional, up to 3 images, max 5MB each)
                          </label>
                          <label className="flex items-center gap-2 border border-dashed border-neutral-300 bg-white p-3 text-xs text-neutral-600 cursor-pointer hover:border-black transition-colors">
                            <Upload size={14} />
                            <span>
                              {rmaPhotos && rmaPhotos.length > 0
                                ? `${rmaPhotos.length} photo(s) selected`
                                : "Choose image files..."}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => setRmaPhotos(e.target.files)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={rmaSubmitting}
                          className="bg-black text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-3 hover:bg-neutral-800 transition-colors disabled:opacity-60"
                        >
                          {rmaSubmitting ? "Submitting..." : "Submit Request"}
                        </button>
                      </form>
                    )}
                  </div>
                )}
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
