"use client";

import { X, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPriceLKR } from "@/lib/utils";

export interface CartItem {
  id: string;
  name: string;
  size: string;
  priceLkr: number;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string, size: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.priceLkr * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#fbfbf9] h-full shadow-2xl flex flex-col z-10 border-l border-[#e5e5e0]">
        {/* Header */}
        <div className="p-6 border-b border-[#e5e5e0] flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl uppercase tracking-wider text-black">
              Your Pre-Order
            </h2>
            <p className="text-[11px] uppercase tracking-widest text-neutral-500 mt-0.5">
              Limited Drop 01 Batch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-neutral-500">
              <p className="text-sm tracking-wide">Your pre-order cart is currently empty.</p>
              <button
                onClick={onClose}
                className="text-xs uppercase tracking-widest font-semibold text-black underline underline-offset-4 hover:opacity-75"
              >
                Explore The Drop
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-4 pb-6 border-b border-neutral-200"
              >
                <div className="relative w-20 h-26 bg-neutral-100 flex-shrink-0 border border-neutral-300 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-black">{item.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Size: <span className="font-semibold text-neutral-800">{item.size}</span>
                    </p>
                    <p className="text-xs font-mono font-medium text-black mt-1">
                      {formatPriceLKR(item.priceLkr)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>Qty: {item.quantity}</span>
                    <button
                      onClick={() => onRemoveItem(item.id, item.size)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-6 bg-[#f4f4f0] border-t border-[#e5e5de] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-mono text-black font-semibold">
                  {formatPriceLKR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Island-wide Delivery (Prompt Xpress)</span>
                <span className="text-emerald-700 font-medium">Complimentary</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-300 flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider font-semibold text-black">
                Total Pre-Order
              </span>
              <span className="text-lg font-mono font-bold text-black">
                {formatPriceLKR(subtotal)}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xs border border-neutral-200 text-[11px] text-neutral-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-800 flex-shrink-0 mt-0.5" />
              <span>
                Pre-order allocation reserved. Handcrafted delivery begins 2nd week of December.
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold py-4 px-6 rounded-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
