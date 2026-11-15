"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import CartDrawer, { CartItem } from "@/components/storefront/CartDrawer";
import { trackFunnelEvent } from "@/lib/meta-pixel";

const STORAGE_KEY = "momentum_cart_v1";

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  removeItem: (id: string, size: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore invalid localStorage state
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items, isHydrated]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback(
    (incoming: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qtyToAdd = incoming.quantity ?? 1;
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.id === incoming.id && i.size === incoming.size
        );
        if (idx > -1) {
          return prev.map((item, i) =>
            i === idx ? { ...item, quantity: item.quantity + qtyToAdd } : item
          );
        }
        return [
          ...prev,
          {
            id: incoming.id,
            slug: incoming.slug,
            name: incoming.name,
            size: incoming.size,
            priceLkr: incoming.priceLkr,
            image: incoming.image,
            quantity: qtyToAdd,
          },
        ];
      });
      setIsCartOpen(true);
      trackFunnelEvent({
        eventName: "AddToCart",
        customData: {
          currency: "LKR",
          value: incoming.priceLkr * qtyToAdd,
          content_name: incoming.name,
          content_type: "product",
          contents: [
            {
              id: incoming.slug || incoming.id,
              quantity: qtyToAdd,
              item_price: incoming.priceLkr,
            },
          ],
        },
      });
    },
    []
  );

  const updateQuantity = useCallback((id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity } : i
      )
    );
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.priceLkr * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        isCartOpen,
        isHydrated,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
