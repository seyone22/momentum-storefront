"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { useCart } from "@/context/CartContext";
import { formatPriceLKR } from "@/lib/utils";
import { trackFunnelEvent } from "@/lib/meta-pixel";
import Link from "next/link";
import { CheckCircle2, Package, Calendar, ArrowRight, MessageCircle, Printer, Users } from "lucide-react";

interface OrderConfirmedClientProps {
  orderId: string;
}

interface OrderSummary {
  orderNumber: string;
  customerName: string;
  city: string;
  totalLkr: number;
  paymentRail?: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt?: string;
  whatsappGroupInviteUrl?: string | null;
  whatsappGroupCtaText?: string;
  items: Array<{
    productName: string;
    size: string;
    quantity: number;
    unitPriceLkr: number;
  }>;
}

export default function OrderConfirmedClient({ orderId }: OrderConfirmedClientProps) {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const purchaseTrackedRef = useRef(false);

  useEffect(() => {
    clearCart();
    fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.orderNumber) {
          setOrder(data);
          if (!purchaseTrackedRef.current) {
            purchaseTrackedRef.current = true;
            trackFunnelEvent({
              eventName: "Purchase",
              eventId: `purchase_${data.orderNumber}`,
              userData: {
                name: data.customerName,
                city: data.city,
                externalId: data.orderNumber,
              },
              customData: {
                currency: "LKR",
                value: Number(data.totalLkr ?? 0),
                order_id: data.orderNumber,
                content_type: "product",
                contents: Array.isArray(data.items)
                  ? data.items.map((i: { productName: string; quantity: number; unitPriceLkr: number }) => ({
                      id: i.productName,
                      quantity: i.quantity,
                      item_price: i.unitPriceLkr,
                    }))
                  : undefined,
              },
            });
          }
        }
      })
      .catch(() => {
        // Ignore lookup failure on confirmation screen
      });
  }, [orderId, clearCart]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <div className="print:hidden">
        <Navbar />
      </div>

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
          Thank you for joining the Momentum inaugural drop. Your order has been recorded and queued for production.
        </p>

        {/* Order Reference & Printable Receipt Box */}
        <div className="my-8 p-6 bg-white border border-[#e5e5e0] rounded-xs shadow-xs text-left max-w-lg mx-auto space-y-4 print:shadow-none print:border-neutral-300">
          <div className="flex justify-between items-start pb-3 border-b border-neutral-200">
            <div>
              <p className="font-editorial text-lg uppercase tracking-widest text-black">Momentum</p>
              <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                Grace Hood Ventures (PVT) LTD &middot; Pre-Order Receipt
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="print:hidden inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-neutral-700 hover:text-black border border-neutral-300 px-2.5 py-1 rounded-xs transition-colors"
            >
              <Printer size={13} />
              <span>Print Receipt</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-neutral-200 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Order Reference</span>
              <span className="font-mono font-bold text-sm text-black">#{order?.orderNumber || orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Date</span>
              <span className="text-neutral-800">
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-LK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : new Date().toLocaleDateString("en-LK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
              </span>
            </div>
            {order?.customerName && (
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Customer</span>
                <span className="text-neutral-800">
                  {order.customerName} &middot; {order.city}
                </span>
              </div>
            )}
            {order?.paymentStatus && (
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Payment</span>
                <span className="uppercase tracking-wider font-medium text-neutral-900">
                  {order.paymentRail || "Online"} &middot; {order.paymentStatus}
                </span>
              </div>
            )}
          </div>

          {order && order.items.length > 0 && (
            <div className="pb-3 border-b border-neutral-200 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-neutral-800">
                    {item.productName} (Size {item.size}) &times; {item.quantity}
                  </span>
                  <span className="font-mono text-black">
                    {formatPriceLKR(item.unitPriceLkr * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-xs font-semibold pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span className="font-mono">{formatPriceLKR(order.totalLkr)}</span>
              </div>
            </div>
          )}

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

        {order?.whatsappGroupInviteUrl && (
          <div className="print:hidden my-6 p-5 bg-emerald-50/70 border border-emerald-200 rounded-xs max-w-lg mx-auto text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full flex-shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-emerald-950">
                  Drop 01 Community &amp; Dispatch Updates
                </p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Get production progress, fitting notes, and early access to future Momentum drops.
                </p>
              </div>
            </div>
            <a
              href={order.whatsappGroupInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] uppercase tracking-[0.15em] font-medium py-2.5 px-4 rounded-xs transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} />
              <span>{order.whatsappGroupCtaText || "Join WhatsApp Group"}</span>
            </a>
          </div>
        )}

        <div className="print:hidden flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
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

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
