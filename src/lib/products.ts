export interface ProductVariant {
  size: '26' | '27' | '28' | '29' | '30' | '32';
  stock: number;
  reserved: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  priceLkr: number;
  compareAtPriceLkr?: number;
  description: string;
  details: string[];
  fabric: string;
  care: string[];
  deliveryNotice: string;
  images: string[];
  heroImage: string;
  variants: ProductVariant[];
  colorways: {
    name: string;
    hex: string;
    slug: string;
  }[];
}

export const PRODUCTS: Product[] = [
  {
    id: "prod_01",
    slug: "the-head-turner-wide-leg",
    name: "The Head Turner Wide Leg",
    tagline: "High rise, contrast wash, tailored drape",
    priceLkr: 14500,
    compareAtPriceLkr: 16500,
    description: "An exaggerated wide-leg silhouette cut from custom ring-spun cotton denim. Features hand-finished contrast panels, refined side-seam detailing, and an ultra-flattering high rise engineered to pair effortlessly with clean tailoring or a relaxed basic tank.",
    details: [
      "Deep indigo front with washed contrast lateral panels",
      "Reinforced contrast waistband and custom copper hardware",
      "Finished hem with subtle raw fray detail",
      "Pre-shrunk 13.5oz premium rigid denim (100% Cotton)"
    ],
    fabric: "100% Rigid Ring-Spun Cotton Denim, 13.5oz. Milled exclusively for Momentum.",
    care: [
      "Machine wash cold inside out with like colors",
      "Do not bleach",
      "Line dry in shade to preserve indigo wash",
      "Warm iron on reverse if desired"
    ],
    deliveryNotice: "Limited Pre-Order Batch (100 Units) — Handcrafted & Dispatched 2nd Week of December",
    heroImage: "/images/products/WhatsApp Image 2026-10-24 at 03.26.29.jpeg",
    images: [
      "/images/products/WhatsApp Image 2026-10-24 at 03.26.29.jpeg",
      "/images/products/WhatsApp Image 2026-10-24 at 03.26.29 (2).jpeg",
      "/images/products/WhatsApp Image 2026-10-24 at 03.26.29 (1).jpeg",
      "/images/products/WhatsApp Image 2026-10-24 at 03.26.31.jpeg",
    ],
    colorways: [
      { name: "Contrast Indigo Wash", hex: "#47617b", slug: "contrast-indigo" },
      { name: "Vintage Bleach Blue", hex: "#8da9c4", slug: "vintage-bleach" },
      { name: "Raw Obsidian Noir", hex: "#1c2128", slug: "obsidian-noir" },
    ],
    variants: [
      { size: "26", stock: 12, reserved: 2, inStock: true },
      { size: "27", stock: 18, reserved: 4, inStock: true },
      { size: "28", stock: 24, reserved: 6, inStock: true },
      { size: "29", stock: 20, reserved: 3, inStock: true },
      { size: "30", stock: 16, reserved: 1, inStock: true },
      { size: "32", stock: 10, reserved: 0, inStock: true },
    ],
  },
  {
    id: "prod_02",
    slug: "lace-detailed-straight-cut",
    name: "Lace Accent Straight Leg",
    tagline: "Effortless femininity meets rugged street denim",
    priceLkr: 15500,
    compareAtPriceLkr: 17500,
    description: "Architectural straight cut featuring delicate sheer lace cut-outs along the pocket borders and rear yoke. A study in sensual contrasts, balancing heavy-duty workwear denim with delicate couture lace detailing.",
    details: [
      "Custom woven floral lace insets along seam boundaries",
      "Medium stonewash with natural whisker fades",
      "High waist with fitted hips and a straight knee-to-hem cut",
      "Signature branded leather patch and engraved rivets"
    ],
    fabric: "99% Cotton, 1% Comfort Elastane for all-day contouring and drape.",
    care: [
      "Hand wash or delicate cycle in laundry bag",
      "Wash cold inside out",
      "Dry flat in shade — do not tumble dry"
    ],
    deliveryNotice: "Limited Pre-Order Batch (75 Units) — Handcrafted & Dispatched 2nd Week of December",
    heroImage: "/images/products/WhatsApp Image 2026-10-24 at 03.26.31.jpeg",
    images: [
      "/images/products/WhatsApp Image 2026-10-24 at 03.26.31.jpeg",
      "/images/products/WhatsApp Image 2026-10-24 fat 03.26.38.jpeg",
      "/images/products/WhatsApp Image 2026-10-24 at d03.26.34.jpeg",
    ],
    colorways: [
      { name: "Vintage Stone Blue", hex: "#7a9cb8", slug: "stone-blue" },
      { name: "Chalk White Denim", hex: "#f0efe9", slug: "chalk-white" },
    ],
    variants: [
      { size: "26", stock: 10, reserved: 1, inStock: true },
      { size: "27", stock: 15, reserved: 3, inStock: true },
      { size: "28", stock: 20, reserved: 5, inStock: true },
      { size: "29", stock: 15, reserved: 2, inStock: true },
      { size: "30", stock: 10, reserved: 0, inStock: true },
      { size: "32", stock: 5, reserved: 0, inStock: true },
    ],
  },
  {
    id: "prod_03",
    slug: "sculpt-denim-corset-jacket",
    name: "The Sculpt Denim Trucker",
    tagline: "Couture tailoring meets staple denim",
    priceLkr: 16800,
    compareAtPriceLkr: 19000,
    description: "Structured silhouette with corseted waist paneling and flared sleeves. Designed to create a dramatic hourglass line when worn buttoned up as a statement top, or unbuttoned over a ribbed tank.",
    details: [
      "Hourglass contour seams with double topstitching",
      "Silver-toned custom shank buttons",
      "Flared cuff with turn-up option",
      "Deep indigo saturated rinse with zero fading"
    ],
    fabric: "100% Rigid Heavyweight Japanese Denim, 14oz.",
    care: [
      "Dry clean recommended for first wash",
      "Cold gentle wash thereafter, line dry"
    ],
    deliveryNotice: "Limited Pre-Order Batch (50 Units) — Handcrafted & Dispatched 2nd Week of December",
    heroImage: "/images/products/WhatsApp Image 2026-10-24 at 03.26.29 (3).jpeg",
    images: [
      "/images/products/WhatsApp Image 2026-10-24 at 03.26.29 (3).jpeg",
      "/images/products/WhatsApp Imaage 2026-10-25 at 22.02.19.jpeg",
      "/images/products/WhatsApp Image 2026-10-2s5 at 22.02.39.jpeg",
    ],
    colorways: [
      { name: "Deep Indigo Rinse", hex: "#1f2d3d", slug: "deep-indigo" },
    ],
    variants: [
      { size: "26", stock: 8, reserved: 1, inStock: true },
      { size: "27", stock: 12, reserved: 2, inStock: true },
      { size: "28", stock: 15, reserved: 4, inStock: true },
      { size: "29", stock: 10, reserved: 1, inStock: true },
      { size: "30", stock: 5, reserved: 0, inStock: true },
      { size: "32", stock: 0, reserved: 0, inStock: false },
    ],
  },
];
