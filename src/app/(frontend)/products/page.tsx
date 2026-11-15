import { getStorefrontProducts } from "@/lib/payload-products";
import ProductsCatalogClient from "./ProductsCatalogClient";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function AllProductsPage({ searchParams }: ProductsPageProps) {
  const [{ category }, products] = await Promise.all([
    searchParams,
    getStorefrontProducts(),
  ]);

  return <ProductsCatalogClient products={products} initialCategory={category} />;
}
