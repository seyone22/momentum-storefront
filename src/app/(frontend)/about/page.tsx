import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { BRAND_INFO, CORE_VALUES, MOMENTUM_LINES } from "@/lib/brand";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story | Momentum Clothing",
  description:
    "Momentum Clothing — Fashion Beyond Boundaries. Discover our vision, mission, core values, and the four signature lines crafted by Grace Hood Ventures (PVT) LTD in Sri Lanka.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Editorial Hero */}
        <section className="border-b border-[#e5e5e0] bg-[#111111] text-[#fbfbf9] py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
              {BRAND_INFO.company} · Reg. No. {BRAND_INFO.regNo}
            </p>
            <h1 className="font-editorial text-4xl sm:text-6xl uppercase tracking-wide leading-tight">
              {BRAND_INFO.tagline}
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed font-light">
              {BRAND_INFO.philosophy} {BRAND_INFO.originStory}
            </p>
          </div>
        </section>

        {/* Vision & Mission Split */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-[#e5e5e0] p-8 sm:p-10 space-y-4">
              <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 font-semibold block">
                01 · Our Vision
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl uppercase tracking-wide text-black">
                Redefining Accessible Luxury
              </h2>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {BRAND_INFO.vision}
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e0] p-8 sm:p-10 space-y-4">
              <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 font-semibold block">
                02 · Our Mission
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl uppercase tracking-wide text-black">
                Empowering Everyday Movement
              </h2>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {BRAND_INFO.mission}
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="border-y border-[#e5e5e0] bg-[#f4f4f0] py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                What Guides Us
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl uppercase tracking-wider text-black">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {CORE_VALUES.map((val, idx) => (
                <div
                  key={val.title}
                  className="bg-white border border-[#e5e5e0] p-6 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[11px] text-neutral-400">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-black">
                      {val.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Four Signature Lines */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e5e5e0] pb-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                The Architecture
              </span>
              <h2 className="font-editorial text-3xl uppercase tracking-wider text-black mt-1">
                Four Signature Lines
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium text-black hover:opacity-70"
            >
              <span>Browse Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOMENTUM_LINES.map((line) => (
              <div
                key={line.id}
                className="bg-white border border-[#e5e5e0] p-6 sm:p-8 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    {line.subtitle} · {line.role}
                  </span>
                  <span className="font-mono text-xs text-neutral-700">
                    {line.priceRange}
                  </span>
                </div>
                <h3 className="font-editorial text-2xl uppercase tracking-wide text-black">
                  {line.name}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{line.summary}</p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {line.occasions.map((occ) => (
                    <span
                      key={occ}
                      className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#f4f4f0] border border-[#e5e5e0] text-neutral-700"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Manifesto & Ja-Ela Operations */}
        <section className="border-t border-[#e5e5e0] bg-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <p className="font-editorial text-2xl sm:text-3xl text-black leading-snug">
              &ldquo;{BRAND_INFO.manifesto}&rdquo;
            </p>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Operated from our office and quality-inspection warehouse in{" "}
              <strong>{BRAND_INFO.warehouseLocation}</strong>, serving Colombo, Gampaha, and
              islandwide Sri Lanka.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium px-8 py-4 transition-colors"
              >
                <span>Explore Drop 01</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
