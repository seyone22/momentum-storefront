"use client";

import { useMemo, useState } from "react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import ProductCard from "@/components/storefront/ProductCard";
import Footer from "@/components/storefront/Footer";
import { Product } from "@/lib/products";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface ProductsCatalogClientProps {
  products: Product[];
  initialCategory?: string;
}

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const SIZES = ["26", "27", "28", "29", "30", "32"] as const;

export default function ProductsCatalogClient({
  products,
  initialCategory,
}: ProductsCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "All");
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }

      if (selectedSize !== "All") {
        const hasSize = product.variants.some(
          (v) => v.size === selectedSize && v.inStock && v.stock > 0
        );
        if (!hasSize) return false;
      }

      if (onlyInStock) {
        const hasAnyStock = product.variants.some((v) => v.inStock && v.stock > 0);
        if (!hasAnyStock) return false;
      }

      if (q) {
        const haystack = [
          product.name,
          product.category,
          product.description,
          product.fabric,
          ...product.details,
          ...product.variants.map((v) => v.sku || ""),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.priceLkr - b.priceLkr);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.priceLkr - a.priceLkr);
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
    }

    return sorted;
  }, [products, searchQuery, selectedCategory, selectedSize, onlyInStock, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedSize !== "All" ||
    onlyInStock ||
    sortBy !== "featured";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedSize("All");
    setOnlyInStock(false);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14">
        {/* Page Header */}
        <div className="border-b border-[#e5e5e0] pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
              Momentum Archive &amp; Active Drop
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl uppercase tracking-wider text-black mt-2">
              All Pieces
            </h1>
          </div>
          <p className="text-xs font-mono text-neutral-500">
            Showing {filteredProducts.length} of {products.length} pieces
          </p>
        </div>

        {/* Search, Filter & Sort Toolbar */}
        <div className="space-y-5 mb-12 border border-[#e5e5e0] bg-white p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by cut, fabric, SKU, or description..."
                className="w-full border border-neutral-300 bg-[#fbfbf9] pl-10 pr-9 py-2.5 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* In-Stock Toggle */}
            <div className="md:col-span-3 flex items-center">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-xs uppercase tracking-wider text-neutral-700">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="h-4 w-4 accent-black border-neutral-300"
                />
                <span>Available Pre-Order Only</span>
              </label>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <SlidersHorizontal size={14} className="text-neutral-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort products"
                className="w-full border border-neutral-300 bg-[#fbfbf9] px-3 py-2.5 text-xs uppercase tracking-wider text-black focus:outline-none focus:border-black"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Sort: Newest</option>
              </select>
            </div>
          </div>

          {/* Category & Size Filters */}
          <div className="pt-4 border-t border-[#e5e5e0] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mr-1">
                Category:
              </span>
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-colors ${
                      active
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sizes */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mr-1">
                Size:
              </span>
              <button
                onClick={() => setSelectedSize("All")}
                className={`px-2.5 py-1 text-[11px] font-mono border transition-colors ${
                  selectedSize === "All"
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                }`}
              >
                ALL
              </button>
              {SIZES.map((sz) => {
                const active = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 text-[11px] font-mono border transition-colors ${
                      active
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Bar */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-[#e5e5e0] flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                Active filters applied
              </span>
              <button
                onClick={clearFilters}
                className="text-[11px] uppercase tracking-wider underline text-black hover:opacity-70"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="border border-[#e5e5e0] bg-white py-20 px-6 text-center space-y-4">
            <p className="font-editorial text-2xl uppercase tracking-wider text-black">
              No matching pieces found
            </p>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Try clearing your size, category, or search filters to view the full collection.
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 inline-block bg-black text-white text-[11px] uppercase tracking-[0.2em] px-6 py-3 hover:bg-neutral-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
