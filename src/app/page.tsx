"use client";

import { useState } from "react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import HeroDrop from "@/components/storefront/HeroDrop";
import ProductCard from "@/components/storefront/ProductCard";
import Footer from "@/components/storefront/Footer";
import CartDrawer, { CartItem } from "@/components/storefront/CartDrawer";
import { PRODUCTS } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleRemoveFromCart = (id: string, size: string) => {
    setCartItems(cartItems.filter((i) => !(i.id === id && i.size === size)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <AnnouncementBar />
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        <HeroDrop />

        {/* Collection Grid */}
        <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#e5e5e0]">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-medium block">
                The Inaugural Capsule
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl uppercase tracking-tight text-neutral-950 mt-1">
                Drop 01 Pieces
              </h2>
            </div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mt-4 md:mt-0 font-medium">
              Strict 200–300 Piece Batch Allocation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
            {PRODUCTS.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* Value Proposition Badges */}
        <section className="bg-[#f4f4f0] border-y border-[#e5e5de] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="p-3 bg-white border border-neutral-300 rounded-xs">
                  <ShieldCheck className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
                    Guaranteed Pre-Order Allocation
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Hard inventory caps prevent overselling. Your unit enters tailored production immediately.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="p-3 bg-white border border-neutral-300 rounded-xs">
                  <Truck className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
                    Prompt Xpress Delivery
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Fully tracked island-wide delivery dispatched 2nd week of December directly to your door.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="p-3 bg-white border border-neutral-300 rounded-xs">
                  <RotateCcw className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
                    Dedicated Size Exchange
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Reserved buffer stock allocated specifically for smooth, hassle-free sizing exchanges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Moodboard Section */}
        <section id="editorial" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
              Lookbook Moodboard
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl uppercase tracking-tight text-neutral-950">
              The Architecture of Denim
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Balancing classic utilitarian strength with raw edge sensuality. Contrast panelling, raw cotton weaves, and delicate lace details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative aspect-[4/5] bg-neutral-200 border border-[#e5e5e0] overflow-hidden">
              <Image
                src="/images/products/WhatsApp Imaage 2026-10-25 at 22.02.19.jpeg"
                alt="Editorial Pose 01"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] bg-neutral-200 border border-[#e5e5e0] overflow-hidden">
              <Image
                src="/images/products/WhatsApp Image 2026-10-24 fat 03.26.38.jpeg"
                alt="Editorial Pose 02"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] bg-neutral-200 border border-[#e5e5e0] overflow-hidden">
              <Image
                src="/images/products/WhatsApp Image 2026-10-2s5 at 22.02.39.jpeg"
                alt="Editorial Pose 03"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
      />
    </div>
  );
}
