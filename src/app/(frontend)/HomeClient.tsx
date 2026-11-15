"use client";

import Link from "next/link";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import HeroDrop from "@/components/storefront/HeroDrop";
import ProductCard from "@/components/storefront/ProductCard";
import Footer from "@/components/storefront/Footer";
import { Product } from "@/lib/products";
import { ArrowRight } from "lucide-react";

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <AnnouncementBar />
      <Navbar />

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
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-black px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-medium text-black hover:bg-black hover:text-white transition-colors"
            >
              <span>Explore All Pieces</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
