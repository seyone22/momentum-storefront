import Link from "next/link";
import { Product } from "@/lib/products";
import { formatPriceLKR } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col justify-between border border-[#e5e5e0] bg-white p-6 transition-all hover:border-black">
      <Link href={`/product/${product.slug}`} className="block">
        {product.featuredImage?.url ? (
          <div className="aspect-[3/4] w-full bg-[#f4f4f0] border border-neutral-200 overflow-hidden relative">
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.alt || product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-neutral-700 border border-neutral-300 px-2.5 py-1 bg-white/90 backdrop-blur-sm">
              Pre-Order
            </span>
          </div>
        ) : (
          <div className="aspect-[3/4] w-full bg-[#f4f4f0] flex flex-col items-center justify-center p-6 text-center border border-neutral-200">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
              Momentum Capsule
            </span>
            <span className="font-editorial text-2xl uppercase tracking-wider text-black mt-2">
              {product.name}
            </span>
            <span className="text-xs text-neutral-500 mt-1">
              {product.category}
            </span>
            <span className="mt-6 text-[10px] uppercase tracking-widest text-neutral-400 border border-neutral-300 px-3 py-1 bg-white">
              Pre-Order
            </span>
          </div>
        )}
      </Link>

      <div className="pt-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-baseline gap-2">
            <h3 className="text-sm uppercase tracking-wider font-semibold text-black">
              <Link href={`/product/${product.slug}`}>
                {product.name}
              </Link>
            </h3>
            <span className="font-mono text-sm font-semibold text-black">
              {formatPriceLKR(product.priceLkr)}
            </span>
          </div>

          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-1.5 mt-4">
            {product.variants.map((v) => (
              <span
                key={v.size}
                className="text-[10px] font-mono px-2 py-0.5 border border-neutral-300 text-neutral-700 bg-white"
              >
                {v.size}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="mt-6 block w-full text-center bg-black hover:bg-neutral-800 text-white text-[11px] uppercase tracking-[0.2em] font-medium py-3 transition-colors"
        >
          Select Size &amp; Pre-Order
        </Link>
      </div>
    </article>
  );
}
