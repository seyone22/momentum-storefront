"use client";

import { useState } from "react";
import Link from "next/link";
import { INITIAL_ORDERS, INITIAL_INVENTORY, AdminOrder } from "@/lib/admin-store";
import { formatPriceLKR } from "@/lib/utils";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck,
  ArrowUpRight
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "new_whatsapp">("orders");
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  // New WhatsApp Manual Order Form State
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    city: "Colombo",
    selectedSku: "MMTM-DNM01-28",
    notes: "Manual WhatsApp order (Slip verified)",
  });

  // Gross Analytics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalLkr, 0);

  const totalUnitsSold = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  const totalCap = inventory.reduce((sum, item) => sum + item.allocatedCap, 0);

  // Export Prompt Xpress Manifest
  const exportPromptManifest = () => {
    const rows = [
      ["Order Ref", "Customer Name", "Phone", "Delivery Address", "City", "Item", "Size", "COD Amount"],
      ...orders.map((o) => [
        o.orderNumber,
        o.customerName,
        o.customerPhone,
        o.address,
        o.city,
        o.items.map((i) => i.productName).join(" | "),
        o.items.map((i) => i.size).join(" | "),
        "0.00 (Prepaid)",
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Prompt_Xpress_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Manual Order Submission
  const handleCreateWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = inventory.find((i) => i.sku === newOrder.selectedSku);
    if (!targetItem) return;

    const orderNumber = `MMTM-WA${Math.floor(1000 + Math.random() * 9000)}`;
    const price = targetItem.sku.includes("DNM01") ? 14500 : targetItem.sku.includes("DNM02") ? 15500 : 16800;

    const createdOrder: AdminOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: newOrder.customerName,
      customerEmail: "whatsapp.order@momentumclothing.lk",
      customerPhone: newOrder.customerPhone,
      address: newOrder.address,
      city: newOrder.city,
      items: [
        {
          productName: targetItem.productName,
          size: targetItem.size,
          priceLkr: price,
          quantity: 1,
        },
      ],
      totalLkr: price,
      paymentMethod: "Bank Transfer (WhatsApp)",
      paymentStatus: "paid",
      fulfillmentStatus: "in_production",
      notes: newOrder.notes,
    };

    setOrders([createdOrder, ...orders]);
    setInventory(
      inventory.map((inv) =>
        inv.sku === targetItem.sku
          ? { ...inv, sold: inv.sold + 1, available: inv.available - 1 }
          : inv
      )
    );

    setActiveTab("orders");
    alert(`Order ${orderNumber} created and stock deducted from ${targetItem.sku}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-[#121212] font-sans">
      {/* Top Admin Bar */}
      <header className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-editorial text-xl tracking-wider text-white">
            MOMENTUM
          </Link>
          <span className="text-[11px] uppercase tracking-widest text-neutral-400 border-l border-neutral-700 pl-4">
            Operations &amp; Drop Mini-ERP
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <Link href="/" target="_blank" className="text-neutral-400 hover:text-white flex items-center gap-1">
            <span>View Live Storefront</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 border border-neutral-200">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
              Gross Collections
            </span>
            <span className="text-2xl font-mono font-bold text-black mt-1 block">
              {formatPriceLKR(totalRevenue)}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1 block">Payments.lk &amp; Bank Slips</span>
          </div>

          <div className="bg-white p-5 border border-neutral-200">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
              Pre-Orders Locked
            </span>
            <span className="text-2xl font-mono font-bold text-black mt-1 block">
              {orders.length}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">All units confirmed</span>
          </div>

          <div className="bg-white p-5 border border-neutral-200">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
              Units Committed
            </span>
            <span className="text-2xl font-mono font-bold text-black mt-1 block">
              {totalUnitsSold} / {totalCap}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1 block">Strict batch caps active</span>
          </div>

          <div className="bg-white p-5 border border-neutral-200 flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
              Courier Dispatch
            </span>
            <button
              onClick={exportPromptManifest}
              className="mt-2 inline-flex items-center justify-center gap-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] uppercase tracking-wider font-semibold py-2.5 px-3 transition-all"
            >
              <Download size={13} />
              <span>Prompt Xpress CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-300 mb-6 gap-6 text-xs uppercase tracking-wider font-semibold">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === "orders" ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-black"
            }`}
          >
            All Pre-Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === "inventory" ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-black"
            }`}
          >
            Variant Stock Caps &amp; Buffer
          </button>
          <button
            onClick={() => setActiveTab("new_whatsapp")}
            className={`pb-3 border-b-2 transition-colors inline-flex items-center gap-1.5 ${
              activeTab === "new_whatsapp" ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-black"
            }`}
          >
            <Plus size={14} />
            <span>Record WhatsApp Order</span>
          </button>
        </div>

        {/* Orders Table View */}
        {activeTab === "orders" && (
          <div className="bg-white border border-neutral-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f2ee] border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-600">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items / Sizing</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment Rail</th>
                  <th className="py-3 px-4">Fulfillment State</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-black">{o.orderNumber}</td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-black">{o.customerName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{o.customerPhone}</div>
                      <div className="text-[11px] text-neutral-500">{o.city}</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      {o.items.map((i, idx) => (
                        <div key={idx}>
                          <span className="font-medium text-black">{i.productName}</span>
                          <span className="text-neutral-500 text-[11px] ml-1">
                            (Size {i.size}) &times; {i.quantity}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-black">
                      {formatPriceLKR(o.totalLkr)}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="text-[11px] px-2 py-0.5 border border-neutral-300 bg-neutral-50 rounded-xs">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs">
                        {o.fulfillmentStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inventory Stock Caps View */}
        {activeTab === "inventory" && (
          <div className="bg-white border border-neutral-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f2ee] border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-600">
                <tr>
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-4">Garment Cut</th>
                  <th className="py-3 px-4">Waist Size</th>
                  <th className="py-3 px-4">Batch Cap</th>
                  <th className="py-3 px-4">Reserved</th>
                  <th className="py-3 px-4">Sold</th>
                  <th className="py-3 px-4">Available For Pre-Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono">
                {inventory.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-black">{inv.sku}</td>
                    <td className="py-3 px-4 font-sans">{inv.productName}</td>
                    <td className="py-3 px-4 font-bold text-black">{inv.size}</td>
                    <td className="py-3 px-4">{inv.allocatedCap}</td>
                    <td className="py-3 px-4 text-amber-700">{inv.reserved}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{inv.sold}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 border text-xs font-semibold ${
                        inv.available > 5
                          ? "border-neutral-300 bg-neutral-100 text-black"
                          : inv.available > 0
                          ? "border-amber-300 bg-amber-50 text-amber-900"
                          : "border-red-300 bg-red-50 text-red-700"
                      }`}>
                        {inv.available} units remaining
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Record WhatsApp Order View */}
        {activeTab === "new_whatsapp" && (
          <div className="bg-white border border-neutral-200 p-8 max-w-xl mx-auto shadow-xs">
            <h3 className="font-editorial text-2xl uppercase tracking-wider text-black mb-2">
              Log WhatsApp Bank Transfer Order
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Use this form when a customer closes via direct DM and provides a bank deposit slip.
            </p>

            <form onSubmit={handleCreateWhatsAppOrder} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  placeholder="e.g. Dilhani Silva"
                  className="w-full p-3 border border-neutral-300 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newOrder.customerPhone}
                  onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                  placeholder="077XXXXXXX"
                  className="w-full p-3 border border-neutral-300 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Select Product &amp; Size Allocation *
                </label>
                <select
                  value={newOrder.selectedSku}
                  onChange={(e) => setNewOrder({ ...newOrder, selectedSku: e.target.value })}
                  className="w-full p-3 border border-neutral-300 focus:border-black focus:outline-none bg-white font-mono"
                >
                  {inventory.map((inv) => (
                    <option key={inv.sku} value={inv.sku} disabled={inv.available <= 0}>
                      {inv.sku} — {inv.productName} (Size {inv.size}) — [{inv.available} left]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={newOrder.address}
                  onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
                  placeholder="Street address for Prompt Xpress"
                  className="w-full p-3 border border-neutral-300 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={newOrder.city}
                  onChange={(e) => setNewOrder({ ...newOrder, city: e.target.value })}
                  className="w-full p-3 border border-neutral-300 focus:border-black focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 text-white uppercase tracking-[0.2em] font-semibold py-3.5 px-6 transition-all"
                >
                  Confirm Order &amp; Lock Inventory Batch
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
