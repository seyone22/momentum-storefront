import { getStorefrontProducts } from "@/lib/payload-products";
import ProductsCatalogClient from "./ProductsCatalogClient";

export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
  const products = await getStorefrontProducts();
  return <ProductsCatalogClient products={products} />;
}
