"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const cart = useCart();
  const displayCount = cartCount ?? cart.cartCount;
  const handleOpenCart = onOpenCart ?? cart.openCart;

  return (
    <header className="sticky top-0 z-40 bg-[#fbfbf9]/95 backdrop-blur-md border-b border-[#e5e5e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">
        
        {/* Left Links */}
        <nav className="flex items-center space-x-5 sm:space-x-8 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600 justify-self-start">
          <Link href="/#collection" className="hover:text-black transition-colors whitespace-nowrap">
            Drop 01
          </Link>
          <Link href="/products" className="hover:text-black transition-colors whitespace-nowrap">
            Shop All
          </Link>
          <Link href="/track" className="hidden md:inline-block hover:text-black transition-colors whitespace-nowrap">
            Track Order
          </Link>
        </nav>

        {/* Center Logo */}
        <div className="justify-self-center flex items-center justify-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Momentum"
              width={160}
              height={50}
              priority
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Cart Trigger */}
        <div className="justify-self-end flex items-center">
          <button
            onClick={handleOpenCart}
            className="flex items-center space-x-2 text-neutral-900 hover:opacity-75 transition-opacity p-2 relative"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {displayCount > 0 && (
              <span className="text-[11px] font-mono font-medium">({displayCount})</span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
