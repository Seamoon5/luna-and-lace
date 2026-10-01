import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../data/products";

const STORAGE_KEY = "luna-wishlist";

function readStoredWishlist(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Product[]) : [];
  } catch {
    return [];
  }
}

interface WishlistValue {
  items: Product[];
  toggle: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  clear: () => void;
}

// One shared wishlist for the whole app, for the same reason as the cart.
const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(readStoredWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable - wishlist still works for this session */
    }
  }, [items]);

  const toggle = useCallback((product: Product) => {
    setItems((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const value = useMemo<WishlistValue>(
    () => ({
      items,
      toggle,
      isInWishlist: (id: string) => items.some((p) => p.id === id),
      clear: () => setItems([]),
    }),
    [items, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
