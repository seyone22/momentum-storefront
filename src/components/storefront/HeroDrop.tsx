import Link from "next/link";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

export default function HeroDrop() {
  return (
    <section className="relative border-b border-[#e5e5e0] overflow-hidden bg-[#f4f4f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Editorial Title & Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-white/70 backdrop-blur-xs px-3 py-1 rounded-xs text-[11px] uppercase tracking-[0.2em] text-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Drop 01 / Capsule Pre-Order</span>
            </div>

            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-neutral-950">
              Effortless <br />
              <span className="italic font-serif">Tailored</span> Denim.
            </h1>

            <p className="text-neutral-600 text-sm sm:text-base max-w-xl leading-relaxed tracking-wide">
              Milled from rigid 13.5oz ring-spun cotton with hand-finished lace detailing and contrast wash paneling. A limited inaugural run of 200 pieces, engineered in Colombo and crafted strictly on pre-order.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6">
              <Link
                href="/#collection"
                className="bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium py-4 px-8 rounded-xs transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Reserve Allocation</span>
                <ArrowDown size={14} />
              </Link>
              
              <Link
                href="/track"
                className="text-xs uppercase tracking-[0.18em] font-medium text-neutral-700 hover:text-black underline underline-offset-8 transition-colors"
              >
                Track An Existing Order
              </Link>
            </div>

            <div className="pt-8 border-t border-neutral-300/80 grid grid-cols-3 gap-4 max-w-md text-left">
              <div>
                <span className="block font-mono text-xl font-bold text-black">200</span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">Batch Limit</span>
              </div>
              <div>
                <span className="block font-mono text-xl font-bold text-black">Dec W2</span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">Dispatch Window</span>
              </div>
              <div>
                <span className="block font-mono text-xl font-bold text-black">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">Ring-Spun Cotton</span>
              </div>
            </div>
          </div>

          {/* Editorial Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/5] bg-neutral-200 border border-[#e5e5e0] overflow-hidden shadow-xl">
              <Image
                src="/images/products/WhatsApp Image 2026-10-24 at 03.26.29.jpeg"
                alt="Momentum Denim Editorial Silhouette"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 border border-neutral-200">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-medium block">
                  Featured Cut
                </span>
                <span className="font-editorial text-lg text-black uppercase tracking-wider block mt-0.5">
                  The Head Turner Wide Leg
                </span>
                <span className="text-xs font-mono font-medium text-neutral-800">
                  LKR 14,500
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
