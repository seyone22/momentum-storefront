"use client";

import Link from "next/link";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import HeroDrop from "@/components/storefront/HeroDrop";
import ProductCard from "@/components/storefront/ProductCard";
import DropNotifyForm from "@/components/storefront/DropNotifyForm";
import Footer from "@/components/storefront/Footer";
import { Product } from "@/lib/products";
import { BRAND_INFO, MOMENTUM_LINES, TRUST_PILLARS } from "@/lib/brand";
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
        {/* Split-Panel Editorial Hero */}
        <HeroDrop products={products} />

        {/* Value & Trust Strip */}
        <section className="border-b border-[#e5e5e0] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {TRUST_PILLARS.map((pillar) => (
              <div key={pillar.title} className="space-y-1">
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-black">
                  {pillar.title}
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Drop 01 Collection Grid */}
        <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 block mb-2">
              Limited Batch · 200 Units
            </span>
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

        {/* 2x2 Editorial Four Signature Lines Grid */}
        <section className="border-t border-[#e5e5e0] bg-[#f4f4f0] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                The Momentum Wardrobe
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl uppercase tracking-wider text-black">
                Four Signature Lines
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                From statement feminine denim to effortless everyday basics, structured workwear,
                and weekend going-out silhouettes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOMENTUM_LINES.map((line, index) => (
                <Link
                  key={line.id}
                  href={`/products?category=${encodeURIComponent(line.queryCategory)}`}
                  className="group bg-white border border-[#e5e5e0] hover:border-black p-8 sm:p-10 flex flex-col justify-between transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                      <span>
                        0{index + 1} · {line.subtitle}
                      </span>
                      <span className="font-mono text-neutral-700">{line.priceRange}</span>
                    </div>

                    <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-wide text-black group-hover:underline underline-offset-4">
                      {line.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {line.summary}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#e5e5e0] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {line.occasions.map((occ) => (
                        <span
                          key={occ}
                          className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#fbfbf9] border border-[#e5e5e0] text-neutral-700"
                        >
                          {occ}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-black">
                      <span>Shop</span>
                      <ArrowRight
                        size={13}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Centered Editorial Brand Manifesto */}
        <section className="border-t border-[#e5e5e0] bg-white py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 block">
              {BRAND_INFO.tagline}
            </span>
            <p className="font-editorial text-2xl sm:text-3xl text-black leading-snug">
              &ldquo;{BRAND_INFO.manifesto}&rdquo;
            </p>
            <p className="text-xs text-neutral-600 max-w-xl mx-auto leading-relaxed">
              {BRAND_INFO.originStory}
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-black underline underline-offset-4 hover:opacity-70"
              >
                <span>Read Our Full Story</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* Drop 02 Early Access Bar */}
        <DropNotifyForm />
      </main>

      <Footer />
    </div>
  );
}
