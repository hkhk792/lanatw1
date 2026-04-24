import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "obsidian-vapor-zen-cart";

export type CartLine = {
  lineId: string;
  productId: string;
  title: string;
  variant: string;
  priceTwd: number;
  quantity: number;
  imageUrl?: string;
};

type AddToCartInput = {
  productId: string;
  title: string;
  variant: string;
  priceTwd: number;
  quantity: number;
  imageUrl?: string;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalTwd: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: AddToCartInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeFromCart: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        l !== null &&
        typeof l === "object" &&
        typeof (l as CartLine).lineId === "string" &&
        typeof (l as CartLine).productId === "string" &&
        typeof (l as CartLine).quantity === "number" &&
        (l as CartLine).quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadFromStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines]);

  const addToCart = useCallback((item: AddToCartInput) => {
    const lineId = `${item.productId}::${item.variant}`;
    setLines((prev) => {
      const i = prev.findIndex((l) => l.lineId === lineId);
      if (i === -1) {
        return [...prev, { lineId, ...item }];
      }
      const next = [...prev];
      next[i] = {
        ...next[i],
        quantity: next[i].quantity + item.quantity,
        imageUrl: item.imageUrl ?? next[i].imageUrl,
      };
      return next;
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) {
        return prev.filter((l) => l.lineId !== lineId);
      }
      return prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l));
    });
  }, []);

  const removeFromCart = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );
  const subtotalTwd = useMemo(
    () => lines.reduce((sum, l) => sum + l.priceTwd * l.quantity, 0),
    [lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      subtotalTwd,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      lines,
      itemCount,
      subtotalTwd,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
