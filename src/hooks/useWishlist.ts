import { useState, useEffect, useCallback } from "react";
import type { Product } from "../data/products";

function readStoredWishlist(): Product[] {
  try {
    const stored = localStorage.getItem("luna-wishlist");
    return stored ? (JSON.parse(stored) as Product[]) : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  // Read the saved wishlist up front so the page never flashes an empty state.
  const [items, setItems] = useState<Product[]>(readStoredWishlist);

  useEffect(() => {
    try { localStorage.setItem("luna-wishlist", JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const toggle = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback((id: string) => items.some((p) => p.id === id), [items]);
  const clear = useCallback(() => setItems([]), []);

  return { items, toggle, isInWishlist, clear };
}
