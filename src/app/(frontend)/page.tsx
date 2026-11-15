import { getFeaturedProducts } from "@/lib/payload-products";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getFeaturedProducts();
  return <HomeClient products={products} />;
}
