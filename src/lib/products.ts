export interface ProductVariant {
  size: '26' | '27' | '28' | '29' | '30' | '32';
  sku?: string;
  stock: number;
  inStock: boolean;
}

export interface ProductMediaItem {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  line?: string;
  occasions?: string[];
  fitNote?: string;
  pairsWithSlugs?: string[];
  priceLkr: number;
  description: string;
  details: string[];
  fabric: string;
  featuredOnHome?: boolean;
  featuredImage?: ProductMediaItem | null;
  gallery?: ProductMediaItem[];
  variants: ProductVariant[];
  createdAt?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "01",
    slug: "design-01-wide-leg",
    name: "Design 01 — Wide Leg",
    category: "Specialty Denim",
    line: "Momentum Denim · The Icon",
    occasions: ["Weekend", "Café", "Evening", "Gatherings"],
    fitNote: "Cut & proportioned for Sri Lankan body types · Pre-dispatch QC in Ja-Ela",
    pairsWithSlugs: ["design-03-sculpt-trucker", "design-02-straight-cut"],
    priceLkr: 14500,
    description:
      "High-rise wide leg cut with contrast panel detailing and refined hardware—quiet luxury feminine denim built for all-day movement.",
    details: [
      "Rigid ring-spun denim",
      "Contrast wash panelling",
      "Reinforced contoured waistband",
      "Individually inspected prior to dispatch",
    ],
    fabric: "100% Cotton, 13.5oz.",
    variants: [
      { size: "26", stock: 15, inStock: true },
      { size: "27", stock: 20, inStock: true },
      { size: "28", stock: 25, inStock: true },
      { size: "29", stock: 20, inStock: true },
      { size: "30", stock: 15, inStock: true },
      { size: "32", stock: 10, inStock: true },
    ],
  },
  {
    id: "02",
    slug: "design-02-straight-cut",
    name: "Design 02 — Straight Leg",
    category: "Specialty Denim",
    line: "Momentum Denim · The Icon",
    occasions: ["Office to Evening", "Weekend", "Café"],
    fitNote: "Cut & proportioned for Sri Lankan body types · Pre-dispatch QC in Ja-Ela",
    pairsWithSlugs: ["design-03-sculpt-trucker", "design-01-wide-leg"],
    priceLkr: 15500,
    description:
      "Signature feminine denim in a clean straight-leg silhouette featuring subtle lace accent detailing along the seam lines.",
    details: [
      "Structured straight silhouette",
      "Hand-finished lace trim accents",
      "Mid-stonewash finish",
      "Individually inspected prior to dispatch",
    ],
    fabric: "99% Cotton, 1% Elastane.",
    variants: [
      { size: "26", stock: 15, inStock: true },
      { size: "27", stock: 20, inStock: true },
      { size: "28", stock: 25, inStock: true },
      { size: "29", stock: 20, inStock: true },
      { size: "30", stock: 15, inStock: true },
      { size: "32", stock: 10, inStock: true },
    ],
  },
  {
    id: "03",
    slug: "design-03-sculpt-trucker",
    name: "Design 03 — Sculpt Trucker",
    category: "Denim Outerwear",
    line: "Momentum Work · The Power",
    occasions: ["Office to Evening", "Brunch", "Travel"],
    fitNote: "Cut & proportioned for Sri Lankan body types · Pre-dispatch QC in Ja-Ela",
    pairsWithSlugs: ["design-01-wide-leg", "design-02-straight-cut"],
    priceLkr: 16800,
    description:
      "Tailored corseted denim jacket with sculpted waist and silver-toned hardware—structured enough for 9am meetings and effortless for 7pm dinners.",
    details: [
      "Contoured waist seam detailing",
      "Custom shank buttons",
      "Deep indigo rinse",
      "Individually inspected prior to dispatch",
    ],
    fabric: "100% Rigid Japanese Denim, 14oz.",
    variants: [
      { size: "26", stock: 10, inStock: true },
      { size: "27", stock: 15, inStock: true },
      { size: "28", stock: 20, inStock: true },
      { size: "29", stock: 15, inStock: true },
      { size: "30", stock: 10, inStock: true },
      { size: "32", stock: 5, inStock: true },
    ],
  },
];

export function enrichProductMetadata(product: Product): Product {
  const seed = PRODUCTS.find((p) => p.slug === product.slug);
  const categoryLineMap: Record<string, string> = {
    "Specialty Denim": "Momentum Denim · The Icon",
    "Denim Outerwear": "Momentum Work · The Power",
    Basics: "Momentum Everyday · The Uniform",
  };
  const categoryOccasionsMap: Record<string, string[]> = {
    "Specialty Denim": ["Weekend", "Café", "Evening"],
    "Denim Outerwear": ["Office to Evening", "Brunch", "Travel"],
    Basics: ["Daily Wear", "Campus", "Coffee Dates"],
  };

  return {
    ...product,
    line: product.line ?? seed?.line ?? categoryLineMap[product.category] ?? "Momentum Collection",
    occasions:
      product.occasions ??
      seed?.occasions ??
      categoryOccasionsMap[product.category] ?? ["Everyday", "Evening"],
    fitNote:
      product.fitNote ??
      seed?.fitNote ??
      "Cut & proportioned for Sri Lankan body types · Pre-dispatch QC in Ja-Ela",
    pairsWithSlugs: product.pairsWithSlugs ?? seed?.pairsWithSlugs ?? [],
  };
}
