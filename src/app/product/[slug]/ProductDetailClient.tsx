"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import { formatPriceLKR } from "@/lib/utils";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import ProductImageZoom from "@/components/storefront/ProductImageZoom";
import SizeGuideModal from "@/components/storefront/SizeGuideModal";
import CartDrawer, { CartItem } from "@/components/storefront/CartDrawer";
import { Ruler, ShieldCheck, Sparkles, MessageCircle, ArrowLeft } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>("28");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const selectedVariant = product.variants.find((v) => v.size === selectedSize);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const remainingStock = selectedVariant?.stock || 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const existing = cartItems.find((i) => i.id === product.id && i.size === selectedSize);
    if (existing) {
      setCartItems(
        cartItems.map((i) =>
          i.id === product.id && i.size === selectedSize
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          size: selectedSize,
          priceLkr: product.priceLkr,
          image: product.heroImage,
          quantity: 1,
        },
      ]);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string, size: string) => {
    setCartItems(cartItems.filter((i) => !(i.id === id && i.size === size)));
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const whatsAppUrl = `https://wa.me/94770413814?text=${encodeURIComponent(
    `Hi Momentum, I would like to pre-order ${product.name} in Size ${selectedSize} (Price: ${formatPriceLKR(product.priceLkr)}). Could you assist me?`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <AnnouncementBar />
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Capsule Drop</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Macro Zoom Gallery */}
          <div className="lg:col-span-7">
            <ProductImageZoom images={product.images} alt={product.name} />
          </div>

          {/* Right Column: Pre-Order Purchase Box */}
          <div className="lg:col-span-5 space-y-8 sticky top-24">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
                  Limited Batch Pre-Order
                </span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-neutral-950 uppercase tracking-wide">
                {product.name}
              </h1>
              <p className="text-xs uppercase tracking-widest text-neutral-500 mt-1 font-medium">
                {product.tagline}
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-2xl font-bold text-neutral-950">
                  {formatPriceLKR(product.priceLkr)}
                </span>
                {product.compareAtPriceLkr && (
                  <span className="font-mono text-sm text-neutral-400 line-through">
                    {formatPriceLKR(product.compareAtPriceLkr)}
                  </span>
                )}
              </div>

              {/* BNPL Split Payment Badge */}
              <div className="mt-3 p-3 bg-[#f2f2ee] border border-[#e2e2dc] rounded-xs text-[11px] text-neutral-700 flex items-center justify-between">
                <span>
                  Or 3 interest-free payments of{" "}
                  <strong className="font-mono font-bold text-black">
                    {formatPriceLKR(Math.round(product.priceLkr / 3))}
                  </strong>{" "}
                  with <strong>Koko</strong> or <strong>Mintpay</strong>
                </span>
                <Sparkles size={14} className="text-amber-600 flex-shrink-0" />
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                  Select Size (Waist in Inches)
                </label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-600 hover:text-black underline underline-offset-4"
                >
                  <Ruler size={13} />
                  <span>Interactive Size Spec</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.variants.map((v) => {
                  const outOfStock = v.stock <= 0;
                  const isSelected = selectedSize === v.size;
                  return (
                    <button
                      key={v.size}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(v.size)}
                      className={`py-3 text-xs font-mono font-medium border transition-all rounded-xs flex flex-col items-center justify-center ${
                        isSelected
                          ? "border-black bg-black text-white shadow-xs"
                          : outOfStock
                          ? "border-neutral-200 bg-neutral-100 text-neutral-300 line-through cursor-not-allowed"
                          : "border-neutral-300 bg-white text-neutral-800 hover:border-black"
                      }`}
                    >
                      <span>{v.size}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Stock Indicator */}
              <div className="text-[11px] text-neutral-600 flex items-center justify-between pt-1">
                <span>
                  {isOutOfStock ? (
                    <span className="text-red-600 font-medium">Sold Out in Size {selectedSize}</span>
                  ) : remainingStock < 10 ? (
                    <span className="text-amber-800 font-semibold animate-pulse">
                      Only {remainingStock} units remaining in Size {selectedSize}
                    </span>
                  ) : (
                    <span>Allocation Available for Pre-Order</span>
                  )}
                </span>
                <span className="font-mono text-neutral-400">SKU: MMTM-{product.id}-{selectedSize}</span>
              </div>
            </div>

            {/* Primary Action CTAs */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="w-full bg-[#111111] hover:bg-black disabled:bg-neutral-300 text-white text-xs uppercase tracking-[0.2em] font-semibold py-4.5 px-6 rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>{isOutOfStock ? "Size Allocation Exhausted" : "Reserve Pre-Order"}</span>
              </button>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 text-xs uppercase tracking-[0.18em] font-medium py-3.5 px-6 rounded-xs transition-all flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle size={15} className="text-emerald-600" />
                <span>Order via WhatsApp Concierge</span>
              </a>
            </div>

            {/* Delivery Guarantee Banner */}
            <div className="p-4 bg-[#f4f4f0] border border-[#e5e5de] rounded-xs space-y-2 text-xs">
              <div className="flex items-center gap-2 text-black font-semibold uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>Pre-Order Delivery Schedule</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                {product.deliveryNotice}. Standard island-wide domestic courier via Prompt Xpress. You will receive SMS &amp; email tracking upon dispatch.
              </p>
            </div>

            {/* Details & Fabric Accordion */}
            <div className="pt-4 border-t border-neutral-200 space-y-4 text-xs text-neutral-700">
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-black mb-1.5">
                  Design Specifications
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-neutral-600">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold uppercase tracking-wider text-black mb-1.5">
                  Fabric &amp; Weight
                </h4>
                <p className="text-neutral-600">{product.fabric}</p>
              </div>

              <div>
                <h4 className="font-semibold uppercase tracking-wider text-black mb-1.5">
                  Care Instructions
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-neutral-600">
                  {product.care.map((careItem, idx) => (
                    <li key={idx}>{careItem}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
      />
    </div>
  );
}
