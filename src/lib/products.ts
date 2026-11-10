export interface ProductVariant {
  size: '26' | '27' | '28' | '29' | '30' | '32';
  stock: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceLkr: number;
  description: string;
  details: string[];
  fabric: string;
  variants: ProductVariant[];
}

export const PRODUCTS: Product[] = [
  {
    id: "01",
    slug: "design-01-wide-leg",
    name: "Design 01 — Wide Leg",
    category: "Specialty Denim",
    priceLkr: 14500,
    description: "High-rise wide leg cut with contrast panel detailing and refined hardware.",
    details: [
      "Rigid ring-spun denim",
      "Contrast wash panelling",
      "Reinforced waistband",
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
    priceLkr: 15500,
    description: "Classic straight leg cut featuring subtle lace accent detailing along seam lines.",
    details: [
      "Structured straight silhouette",
      "Hand-finished lace trim accents",
      "Mid-stonewash finish",
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
    priceLkr: 16800,
    description: "Tailored corseted denim jacket with sculpted waist and silver-toned hardware.",
    details: [
      "Contoured waist seam detailing",
      "Custom shank buttons",
      "Deep indigo rinse",
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
