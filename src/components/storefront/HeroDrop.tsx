import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { BRAND_INFO } from "@/lib/brand";
import { Product } from "@/lib/products";

interface HeroDropProps {
  products?: Product[];
}

export default function HeroDrop({ products = [] }: HeroDropProps) {
  const leftImage = products[0]?.featuredImage?.url;
  const rightImage = products[1]?.featuredImage?.url ?? products[2]?.featuredImage?.url;

  return (
    <section className="relative border-b border-[#e5e5e0] bg-[#111111] text-[#fbfbf9] overflow-hidden">
      {/* Split-panel editorial backdrop inspired by high-fashion lookbooks */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[540px] sm:min-h-[620px]">
        <div className="relative min-h-[280px] md:min-h-full bg-[#1a1a18] overflow-hidden">
          {leftImage ? (
            <img
              src={leftImage}
              alt={products[0]?.name || "Momentum Denim Look 01"}
              className="w-full h-full object-cover object-center opacity-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#20201d] via-[#141412] to-[#0c0c0b]" />
          )}
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative min-h-[280px] md:min-h-full bg-[#141412] border-t md:border-t-0 md:border-l border-white/10 overflow-hidden hidden md:block">
          {rightImage ? (
            <img
              src={rightImage}
              alt={products[1]?.name || "Momentum Denim Look 02"}
              className="w-full h-full object-cover object-center opacity-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-bl from-[#22211e] via-[#151513] to-[#0b0b0a]" />
          )}
          <div className="absolute inset-0 bg-black/35" />
        </div>
      </div>

      {/* Centered Editorial Overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-center space-y-5 bg-[#111111]/65 backdrop-blur-xs border border-white/15 px-6 py-10 sm:px-12 sm:py-12">
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-300 font-medium">
            Inaugural Drop 01 · {BRAND_INFO.tagline}
          </p>

          <h1 className="font-editorial text-4xl sm:text-6xl font-normal leading-[1.06] tracking-tight text-white">
            Quiet Luxury. Feminine Denim.
          </h1>

          <p className="text-neutral-200 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-light">
            Tailored for Sri Lankan body types and tropical all-day movement. Limited numbered
            batch with contrast panels and artisan lace detailing.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#collection"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fbfbf9] hover:bg-neutral-200 text-[#111111] text-[11px] uppercase tracking-[0.2em] font-semibold py-4 px-8 transition-all"
            >
              <span>Shop Drop 01</span>
              <ArrowDown size={14} />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/40 hover:border-white text-white text-[11px] uppercase tracking-[0.2em] font-medium py-4 px-7 transition-all"
            >
              <span>Our Story</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
