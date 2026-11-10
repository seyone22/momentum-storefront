"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fbfbf9]/90 backdrop-blur-md border-b border-[#e5e5e0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-800 hover:text-black focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Left Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-[12px] uppercase tracking-[0.2em] font-medium text-neutral-700">
          <Link href="/#collection" className="hover:text-black transition-colors">
            Drop 01
          </Link>
          <Link href="/#editorial" className="hover:text-black transition-colors">
            Editorial
          </Link>
          <Link href="/track" className="hover:text-black transition-colors text-neutral-500">
            Track Order
          </Link>
        </nav>

        {/* Brand Logo Center */}
        <div className="flex-1 md:flex-initial text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.svg"
              alt="Momentum Clothing"
              width={160}
              height={48}
              priority
              className="h-9 w-auto mx-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-6">
          <Link
            href="/track"
            className="hidden sm:inline-block text-[12px] uppercase tracking-[0.18em] text-neutral-500 hover:text-black transition-colors"
          >
            Track
          </Link>
          <button
            onClick={onOpenCart}
            className="flex items-center space-x-2 text-neutral-900 hover:opacity-75 transition-opacity relative p-1.5"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e5e5e0] bg-[#fbfbf9] px-6 py-6 space-y-4">
          <Link
            href="/#collection"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-[0.2em] py-2 text-neutral-800"
          >
            Drop 01 Collection
          </Link>
          <Link
            href="/#editorial"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-[0.2em] py-2 text-neutral-800"
          >
            Editorial Lookbook
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-[0.2em] py-2 text-neutral-500"
          >
            Track Pre-Order
          </Link>
        </div>
      )}
    </header>
  );
}
