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

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

const STORAGE_KEY = "luna-cart";

function readStoredCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

interface CartValue {
  items: CartItem[];
  addItem: (product: Product, qty?: number, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQty: (productId: string, qty: number, color?: string, size?: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

// One shared cart for the whole app. Without this, every component kept its own
// private copy and the header count did not update when you added an item.
const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable - cart still works for this session */
    }
  }, [items]);

  const addItem = useCallback(
    (product: Product, qty = 1, color?: string, size?: string) => {
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
    },
    []
  );

  const removeItem = useCallback((productId: string, color?: string, size?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.product.id === productId && i.selectedColor === color && i.selectedSize === size
          )
      )
    );
  }, []);

  const updateQty = useCallback(
    (productId: string, qty: number, color?: string, size?: string) => {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId && i.selectedColor === color && i.selectedSize === size
            ? { ...i, quantity: Math.max(1, qty) }
            : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartValue>(() => {
    return {
      items,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      total: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      count: items.reduce((sum, i) => sum + i.quantity, 0),
    };
  }, [items, addItem, removeItem, updateQty, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
