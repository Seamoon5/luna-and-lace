import { useState, useEffect, useCallback } from "react";
import type { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

function readStoredCart(): CartItem[] {
  try {
    const stored = localStorage.getItem("luna-cart");
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  // Read the saved cart up front so the page never flashes an empty bag.
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    try { localStorage.setItem("luna-cart", JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const addItem = useCallback((product: Product, qty = 1, color?: string, size?: string) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedColor === color && i.selectedSize === size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { product, quantity: qty, selectedColor: color, selectedSize: size }];
    });
  }, []);

  const removeItem = useCallback((productId: string, color?: string, size?: string) => {
    setItems((prev) => prev.filter(
      (i) => !(i.product.id === productId && i.selectedColor === color && i.selectedSize === size)
    ));
  }, []);

  const updateQty = useCallback((productId: string, qty: number, color?: string, size?: string) => {
    setItems((prev) => prev.map((i) =>
      i.product.id === productId && i.selectedColor === color && i.selectedSize === size
        ? { ...i, quantity: Math.max(1, qty) }
        : i
    ));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, addItem, removeItem, updateQty, clearCart, total, count };
}
