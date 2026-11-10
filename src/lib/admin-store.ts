export interface AdminOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  items: {
    productName: string;
    size: string;
    priceLkr: number;
    quantity: number;
  }[];
  totalLkr: number;
  paymentMethod: "Payments.lk" | "Bank Transfer (WhatsApp)";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  fulfillmentStatus: "pre_order_placed" | "payment_verified" | "in_production" | "dispatched";
  courierReference?: string;
  notes?: string;
}

export interface InventoryBatchItem {
  id: string;
  sku: string;
  productName: string;
  size: string;
  allocatedCap: number;
  reserved: number;
  sold: number;
  available: number;
}

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord_101",
    orderNumber: "MMTM-849201",
    createdAt: "2026-11-10T14:30:00Z",
    customerName: "Sashini Perera",
    customerEmail: "sashini.perera@example.com",
    customerPhone: "0771234567",
    address: "No. 42, Ward Place",
    city: "Colombo 07",
    items: [
      {
        productName: "Design 01 — Wide Leg",
        size: "28",
        priceLkr: 14500,
        quantity: 1,
      },
    ],
    totalLkr: 14500,
    paymentMethod: "Payments.lk",
    paymentStatus: "paid",
    fulfillmentStatus: "payment_verified",
    notes: "First pre-order drop customer",
  },
  {
    id: "ord_102",
    orderNumber: "MMTM-849202",
    createdAt: "2026-11-10T16:15:00Z",
    customerName: "Amara Jayasuriya",
    customerEmail: "amara.j@example.com",
    customerPhone: "0778852404",
    address: "18/4, Alfred Place",
    city: "Colombo 03",
    items: [
      {
        productName: "Design 02 — Straight Leg",
        size: "27",
        priceLkr: 15500,
        quantity: 1,
      },
    ],
    totalLkr: 15500,
    paymentMethod: "Bank Transfer (WhatsApp)",
    paymentStatus: "paid",
    fulfillmentStatus: "in_production",
    notes: "Manual order confirmed via WhatsApp receipt",
  },
];

export const INITIAL_INVENTORY: InventoryBatchItem[] = [
  { id: "inv_1", sku: "MMTM-DNM01-26", productName: "Design 01 — Wide Leg", size: "26", allocatedCap: 15, reserved: 2, sold: 1, available: 12 },
  { id: "inv_2", sku: "MMTM-DNM01-27", productName: "Design 01 — Wide Leg", size: "27", allocatedCap: 20, reserved: 3, sold: 2, available: 15 },
  { id: "inv_3", sku: "MMTM-DNM01-28", productName: "Design 01 — Wide Leg", size: "28", allocatedCap: 25, reserved: 5, sold: 4, available: 16 },
  { id: "inv_4", sku: "MMTM-DNM01-29", productName: "Design 01 — Wide Leg", size: "29", allocatedCap: 20, reserved: 1, sold: 1, available: 18 },
  { id: "inv_5", sku: "MMTM-DNM01-30", productName: "Design 01 — Wide Leg", size: "30", allocatedCap: 15, reserved: 1, sold: 0, available: 14 },
  { id: "inv_6", sku: "MMTM-DNM01-32", productName: "Design 01 — Wide Leg", size: "32", allocatedCap: 10, reserved: 0, sold: 0, available: 10 },

  { id: "inv_7", sku: "MMTM-DNM02-26", productName: "Design 02 — Straight Leg", size: "26", allocatedCap: 15, reserved: 1, sold: 0, available: 14 },
  { id: "inv_8", sku: "MMTM-DNM02-27", productName: "Design 02 — Straight Leg", size: "27", allocatedCap: 20, reserved: 2, sold: 2, available: 16 },
  { id: "inv_9", sku: "MMTM-DNM02-28", productName: "Design 02 — Straight Leg", size: "28", allocatedCap: 25, reserved: 4, sold: 3, available: 18 },
  { id: "inv_10", sku: "MMTM-DNM02-29", productName: "Design 02 — Straight Leg", size: "29", allocatedCap: 20, reserved: 1, sold: 0, available: 19 },
  { id: "inv_11", sku: "MMTM-DNM02-30", productName: "Design 02 — Straight Leg", size: "30", allocatedCap: 15, reserved: 0, sold: 0, available: 15 },
  { id: "inv_12", sku: "MMTM-DNM02-32", productName: "Design 02 — Straight Leg", size: "32", allocatedCap: 10, reserved: 0, sold: 0, available: 10 },

  { id: "inv_13", sku: "MMTM-JKT03-26", productName: "Design 03 — Sculpt Trucker", size: "26", allocatedCap: 10, reserved: 1, sold: 0, available: 9 },
  { id: "inv_14", sku: "MMTM-JKT03-27", productName: "Design 03 — Sculpt Trucker", size: "27", allocatedCap: 15, reserved: 2, sold: 1, available: 12 },
  { id: "inv_15", sku: "MMTM-JKT03-28", productName: "Design 03 — Sculpt Trucker", size: "28", allocatedCap: 20, reserved: 3, sold: 2, available: 15 },
  { id: "inv_16", sku: "MMTM-JKT03-29", productName: "Design 03 — Sculpt Trucker", size: "29", allocatedCap: 15, reserved: 1, sold: 0, available: 14 },
  { id: "inv_17", sku: "MMTM-JKT03-30", productName: "Design 03 — Sculpt Trucker", size: "30", allocatedCap: 10, reserved: 0, sold: 0, available: 10 },
  { id: "inv_18", sku: "MMTM-JKT03-32", productName: "Design 03 — Sculpt Trucker", size: "32", allocatedCap: 5, reserved: 0, sold: 0, available: 5 },
];
