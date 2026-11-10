"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import { formatPriceLKR } from "@/lib/utils";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import SizeGuideModal from "@/components/storefront/SizeGuideModal";
import CartDrawer, { CartItem } from "@/components/storefront/CartDrawer";
import { Ruler, ArrowLeft } from "lucide-react";

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

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <AnnouncementBar />
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

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
          
          {/* Minimal Silhouette Box */}
          <div className="md:col-span-6 aspect-[3/4] bg-[#f4f4f0] border border-[#e5e5e0] flex flex-col items-center justify-center p-8 text-center">
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

          {/* Sizing & Pre-Order Action Box */}
          <div className="md:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-medium block">
                {product.category}
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
            </div>

            {/* Pre-Order CTA */}
            <div className="pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.2em] font-semibold py-4 px-6 transition-all"
              >
                Pre-Order Size {selectedSize}
              </button>
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
