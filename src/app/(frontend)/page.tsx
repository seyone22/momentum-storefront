"use client";

import { useState } from "react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import HeroDrop from "@/components/storefront/HeroDrop";
import ProductCard from "@/components/storefront/ProductCard";
import Footer from "@/components/storefront/Footer";
import CartDrawer, { CartItem } from "@/components/storefront/CartDrawer";
import { PRODUCTS } from "@/lib/products";

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
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-editorial text-3xl sm:text-4xl uppercase tracking-wider text-black">
              Drop 01 Pieces
            </h2>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mt-2">
              Select a cut to view garment specifications and pre-order
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
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
