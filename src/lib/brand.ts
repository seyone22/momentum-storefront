export interface BrandLine {
  id: "denim" | "everyday" | "work" | "casual";
  name: string;
  subtitle: string;
  role: string;
  priceRange: string;
  summary: string;
  occasions: string[];
  palette: string[];
  queryCategory: string;
}

export const BRAND_INFO = {
  name: "Momentum Clothing",
  shortName: "MOMENTUM",
  company: "Grace Hood Ventures (PVT) LTD",
  regNo: "PV 00329182",
  warehouseLocation: "Ja-Ela, Sri Lanka",
  marketFocus: "Colombo & Islandwide, Sri Lanka",
  email: "care@momentumclothing.lk",
  whatsappNumber: "94770413814",
  whatsappDisplay: "+94 77 041 3814",
  tagline: "Fashion Beyond Boundaries",
  manifesto: "MOMENTUM — MOVE FORWARD — A lifestyle. An attitude. A continuous movement.",
  philosophy: "The world never stands still, and neither should we.",
  vision:
    "To become one of Sri Lanka’s most recognized and trusted premium women’s fashion brands by redefining accessible luxury through contemporary designs, superior quality, and affordable elegance.",
  mission:
    "To empower women in Sri Lanka with stylish, high-quality denim and casual wear that combine contemporary fashion, comfort, durability, and affordability—bridging the gap between fast fashion and expensive luxury apparel.",
  originStory:
    "Born from the real-life experiences and challenges of three young adults navigating the complexities of modern lifestyles, MOMENTUM represents resilience, transformation, individuality, and the continuous pursuit of progress.",
} as const;

export const CORE_VALUES = [
  {
    title: "Quality Excellence",
    description:
      "Delivering clothing that reflects high standards of material quality, craftsmanship, comfort, and durability.",
  },
  {
    title: "Accessible Luxury",
    description:
      "Making premium fashion more attainable by offering an appealing balance of quality, style, and price.",
  },
  {
    title: "Innovation & Creativity",
    description:
      "Continuously developing fresh designs and collections that reflect evolving fashion trends and customer preferences.",
  },
  {
    title: "Customer Satisfaction",
    description:
      "Prioritizing customer needs, providing reliable service, and building long-term relationships through trust and consistency.",
  },
  {
    title: "Continuous Growth",
    description:
      "Embracing learning, adaptability, and strategic investment to strengthen the brand and expand its market presence.",
  },
] as const;

export const TRUST_PILLARS = [
  {
    title: "Limited Batch Drops",
    detail: "Numbered drops that don’t restock forever—once a design sells out, we move forward.",
  },
  {
    title: "Pre-Dispatch QC",
    detail: "Every garment is individually inspected at our Ja-Ela warehouse before dispatch.",
  },
  {
    title: "Tailored Sri Lankan Fit",
    detail: "Cut and proportioned for Sri Lankan body types and tropical all-day comfort.",
  },
] as const;

export const MOMENTUM_LINES: BrandLine[] = [
  {
    id: "denim",
    name: "Momentum Denim",
    subtitle: "The Icon",
    role: "Hero Statement Pieces",
    priceRange: "LKR 6,990 – 10,990",
    summary:
      "Quiet luxury, bold yet minimal. Wide-leg, flared, straight-fit, and signature lace-hem & side-lace denim tailored for Sri Lankan body types.",
    occasions: ["Weekend", "Café", "Evening", "Gatherings"],
    palette: ["Light Wash", "Mid-Blue", "Black", "Greenish Blue", "Dark Indigo"],
    queryCategory: "Specialty Denim",
  },
  {
    id: "everyday",
    name: "Momentum Everyday",
    subtitle: "The Uniform",
    role: "Elevated Daily Basics",
    priceRange: "LKR 3,990 – 5,990",
    summary:
      "Soft, breathable cotton blends in a refined neutral palette—effortlessly chic essentials designed to pair seamlessly with Momentum Denim.",
    occasions: ["Daily Wear", "Campus", "Coffee Dates"],
    palette: ["Beige", "White", "Sand", "Sage", "Charcoal", "Navy"],
    queryCategory: "Basics",
  },
  {
    id: "work",
    name: "Momentum Work",
    subtitle: "The Power",
    role: "Office to Evening",
    priceRange: "LKR 4,990 – 8,990",
    summary:
      "Structured, wrinkle-resistant tailored trousers, crisp shirts, dark-wash work denim, and co-ords built for 9am meetings and 7pm dinners.",
    occasions: ["Office", "Meetings", "Corporate Events", "Formal Dinners"],
    palette: ["Black", "Navy", "Charcoal", "White", "Camel"],
    queryCategory: "Denim Outerwear",
  },
  {
    id: "casual",
    name: "Momentum Casual",
    subtitle: "The Vibe",
    role: "Casual Going-Out",
    priceRange: "LKR 3,990 – 4,990",
    summary:
      "Trendy, wearable silhouettes—oversized tees, cropped cuts, knit tops, and flowy skirts made to move effortlessly from brunch to Galle Face evenings.",
    occasions: ["Brunch", "Travel", "Girls' Day Out", "Going Out"],
    palette: ["White", "Baby Blue", "Olive", "Black", "Cream", "Sand"],
    queryCategory: "Basics",
  },
];
