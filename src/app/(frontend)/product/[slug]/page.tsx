import { getProductBySlug, getStorefrontProducts } from "@/lib/payload-products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getStorefrontProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const others = allProducts.filter((p) => p.slug !== product.slug);
  const preferred = product.pairsWithSlugs?.length
    ? others.filter((p) => product.pairsWithSlugs?.includes(p.slug))
    : [];
  const pairings = (preferred.length > 0 ? preferred : others).slice(0, 3);

  return <ProductDetailClient product={product} pairings={pairings} />;
}
