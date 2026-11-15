"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import { trackFunnelEvent } from "@/lib/meta-pixel";
import { formatPriceLKR } from "@/lib/utils";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import SizeGuideModal from "@/components/storefront/SizeGuideModal";
import { useCart } from "@/context/CartContext";
import { BRAND_INFO } from "@/lib/brand";
import { Ruler, ArrowLeft, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  pairings?: Product[];
}

export default function ProductDetailClient({ product, pairings = [] }: ProductDetailClientProps) {
  const defaultSize =
    product.variants.find((v) => v.inStock && v.stock > 0)?.size ??
    product.variants[0]?.size ??
    "28";
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    trackFunnelEvent({
      eventName: "ViewContent",
      customData: {
        currency: "LKR",
        value: product.priceLkr,
        content_name: product.name,
        content_type: "product",
        contents: [{ id: product.slug || product.id, quantity: 1, item_price: product.priceLkr }],
      },
    });
  }, [product.id, product.slug, product.name, product.priceLkr]);

  const selectedVariant = product.variants.find((v) => v.size === selectedSize);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      size: selectedSize,
      priceLkr: product.priceLkr,
      image: product.featuredImage?.url,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Drop 01</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Product Image / Minimal Silhouette Box */}
          <div className="md:col-span-6 space-y-4">
            {product.featuredImage?.url ? (
              <div className="aspect-[3/4] bg-[#f4f4f0] border border-[#e5e5e0] overflow-hidden">
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.alt || product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] bg-[#f4f4f0] border border-[#e5e5e0] flex flex-col items-center justify-center p-8 text-center">
                <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
                  Momentum Denim
                </span>
                <h2 className="font-editorial text-3xl uppercase tracking-wider text-black mt-2">
                  {product.name}
                </h2>
                <span className="text-xs font-mono text-neutral-500 mt-2">
                  Official Lookbook Imagery Pending Studio Handoff
                </span>
              </div>
            )}

            {product.gallery && product.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {product.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-[3/4] bg-[#f4f4f0] border border-[#e5e5e0] overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt || `${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizing & Pre-Order Action Box */}
          <div className="md:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-medium block">
                {product.line || product.category}
              </span>
              <h1 className="font-editorial text-3xl text-neutral-950 uppercase tracking-wide mt-1">
                {product.name}
              </h1>
              <p className="font-mono text-xl font-bold text-black mt-3">
                {formatPriceLKR(product.priceLkr)}
              </p>
              <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {product.occasions && product.occasions.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 mr-1">
                    Where Worn:
                  </span>
                  {product.occasions.map((occ) => (
                    <span
                      key={occ}
                      className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-white border border-[#e5e5e0] text-neutral-700"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Size Selector */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                  Select Size
                </label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-600 hover:text-black underline underline-offset-4"
                >
                  <Ruler size={13} />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    onClick={() => setSelectedSize(v.size)}
                    className={`py-3 text-xs font-mono font-medium border transition-all ${
                      selectedSize === v.size
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white text-neutral-800 hover:border-black"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>

              <div className="flex items-start gap-2 pt-1 text-[11px] text-neutral-600">
                <ShieldCheck size={14} className="text-neutral-500 shrink-0 mt-0.5" />
                <span>
                  {product.fitNote ||
                    "Cut & proportioned for Sri Lankan body types · Pre-dispatch QC in Ja-Ela"}
                </span>
              </div>
            </div>

            {/* Pre-Order CTA & WhatsApp Concierge */}
            <div className="pt-4 border-t border-neutral-200 space-y-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.2em] font-semibold py-4 px-6 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? `Size ${selectedSize} Sold Out` : `Pre-Order Size ${selectedSize}`}
              </button>

              <a
                href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent(
                  `Hi Momentum, I need sizing help for ${product.name} (Size ${selectedSize}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 text-[11px] uppercase tracking-[0.18em] font-medium py-3 px-5 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} className="text-emerald-700" />
                <span>Need Sizing Help? Chat on WhatsApp</span>
              </a>
            </div>

            {/* Specifications */}
            <div className="pt-4 border-t border-neutral-200 space-y-3 text-xs text-neutral-700">
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-black mb-1">
                  Specifications
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-neutral-600">
                  {product.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold uppercase tracking-wider text-black mb-1">
                  Fabric
                </h4>
                <p className="text-neutral-600">{product.fabric}</p>
              </div>
            </div>

          </div>

        </div>

        {/* Complete the Look / Pair It With */}
        {pairings.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#e5e5e0]">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 block">
                  Complete The Look
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl uppercase tracking-wide text-black mt-1">
                  Pair It With
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-black hover:opacity-70"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {pairings.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="group bg-white border border-[#e5e5e0] hover:border-black transition-colors p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-20 bg-[#f4f4f0] border border-[#e5e5e0] shrink-0 overflow-hidden flex items-center justify-center">
                    {item.featuredImage?.url ? (
                      <img
                        src={item.featuredImage.url}
                        alt={item.featuredImage.alt || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-[9px] uppercase tracking-widest text-neutral-400 text-center px-1">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block truncate">
                      {item.line || item.category}
                    </span>
                    <h3 className="text-xs font-semibold text-black truncate group-hover:underline">
                      {item.name}
                    </h3>
                    <p className="text-xs font-mono text-neutral-800">
                      {formatPriceLKR(item.priceLkr)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
