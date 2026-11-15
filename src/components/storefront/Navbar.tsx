"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const cart = useCart();
  const displayCount = cartCount ?? cart.cartCount;
  const handleOpenCart = onOpenCart ?? cart.openCart;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fbfbf9]/95 backdrop-blur-md border-b border-[#e5e5e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Left: Mobile Menu Button + Desktop Links */}
        <div className="justify-self-start flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 -ml-2 text-neutral-900 hover:opacity-75 transition-opacity"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>

          <nav className="hidden md:flex items-center md:space-x-5 lg:space-x-7 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600">
            <Link href="/#collection" className="hover:text-black transition-colors whitespace-nowrap">
              Drop 01
            </Link>
            <Link href="/products" className="hover:text-black transition-colors whitespace-nowrap">
              Shop All
            </Link>
            <Link href="/about" className="hover:text-black transition-colors whitespace-nowrap">
              Our Story
            </Link>
            <Link href="/track" className="hidden lg:inline-block hover:text-black transition-colors whitespace-nowrap">
              Track Order
            </Link>
          </nav>
        </div>

        {/* Center Logo */}
        <div className="justify-self-center flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/logo.svg"
              alt="Momentum"
              width={160}
              height={50}
              priority
              className="h-6 sm:h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Cart Trigger */}
        <div className="justify-self-end flex items-center">
          <button
            onClick={handleOpenCart}
            className="flex items-center space-x-2 text-neutral-900 hover:opacity-75 transition-opacity p-2 -mr-2 relative"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {displayCount > 0 && (
              <span className="text-[11px] font-mono font-medium">({displayCount})</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-[#e5e5e0] bg-[#fbfbf9] px-6 py-5 flex flex-col space-y-4 text-[11px] uppercase tracking-[0.22em] font-medium text-neutral-800"
        >
          <Link
            href="/#collection"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-black transition-colors py-1"
          >
            Drop 01
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-black transition-colors py-1"
          >
            Shop All
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-black transition-colors py-1"
          >
            Our Story
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-black transition-colors py-1"
          >
            Track Order
          </Link>
        </nav>
      )}
    </header>
  );
}
