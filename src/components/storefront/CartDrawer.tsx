"use client";

import { X, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPriceLKR } from "@/lib/utils";

export interface CartItem {
  id: string;
  name: string;
  size: string;
  priceLkr: number;
  image?: string;
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
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#fbfbf9] h-full shadow-2xl flex flex-col z-10 border-l border-[#e5e5e0]">
        {/* Header */}
        <div className="p-6 border-b border-[#e5e5e0] flex items-center justify-between">
          <h2 className="font-editorial text-2xl uppercase tracking-wider text-black">
            Pre-Order
          </h2>
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
              <p className="text-sm">Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex justify-between items-start pb-4 border-b border-neutral-200"
              >
                <div>
                  <h3 className="text-sm font-medium text-black">{item.name}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Size: {item.size} &times; {item.quantity}
                  </p>
                  <p className="text-xs font-mono font-medium text-black mt-1">
                    {formatPriceLKR(item.priceLkr)}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id, item.size)}
                  className="text-neutral-400 hover:text-black transition-colors p-1"
                  aria-label="Remove item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-6 bg-[#f4f4f0] border-t border-[#e5e5de] space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider font-semibold text-black">
                Total
              </span>
              <span className="text-lg font-mono font-bold text-black">
                {formatPriceLKR(subtotal)}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.2em] font-semibold py-4 px-6 flex items-center justify-center gap-2 transition-all"
            >
              <span>Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
