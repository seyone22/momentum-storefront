"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#fbfbf9]/95 backdrop-blur-md border-b border-[#e5e5e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Links */}
        <nav className="flex items-center space-x-8 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600">
          <Link href="/#collection" className="hover:text-black transition-colors">
            Drop 01
          </Link>
          <Link href="/track" className="hover:text-black transition-colors">
            Track Order
          </Link>
        </nav>

        {/* Center Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.svg"
              alt="Momentum"
              width={140}
              height={36}
              priority
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Cart Trigger */}
        <div className="flex items-center">
          <button
            onClick={onOpenCart}
            className="flex items-center space-x-2 text-neutral-900 hover:opacity-75 transition-opacity p-2 relative"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="text-[11px] font-mono font-medium">({cartCount})</span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
