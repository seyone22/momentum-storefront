import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";
import { formatPriceLKR } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <article className="group flex flex-col justify-between">
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] bg-neutral-100 overflow-hidden border border-[#e5e5e0]">
        <Image
          src={product.heroImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Floating Pre-Order Tag */}
        <div className="absolute top-3 left-3 bg-[#111111]/90 backdrop-blur-xs text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium">
          Pre-Order Drop
        </div>

        {/* Stock pill */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-black text-[10px] uppercase tracking-widest px-2 py-0.5 font-medium border border-neutral-200">
          {totalStock} Pieces Planned
        </div>
      </Link>

      <div className="pt-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-baseline gap-2">
            <h3 className="font-editorial text-xl uppercase tracking-wide text-neutral-900 group-hover:opacity-80 transition-opacity">
              <Link href={`/product/${product.slug}`}>
                {product.name}
              </Link>
            </h3>
            <span className="font-mono text-sm font-semibold text-black">
              {formatPriceLKR(product.priceLkr)}
            </span>
          </div>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
            {product.tagline}
          </p>

          <div className="flex gap-1.5 mt-3">
            {product.variants.map((v) => (
              <span
                key={v.size}
                className={`text-[10px] font-mono px-2 py-0.5 border ${
                  v.stock > 0
                    ? "border-neutral-300 text-neutral-700 bg-white"
                    : "border-neutral-200 text-neutral-300 bg-neutral-100 line-through"
                }`}
              >
                {v.size}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-semibold text-neutral-900 group-hover:underline underline-offset-4"
        >
          <span>View Piece</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}
