import { useEffect, useState } from "react";
import { productById } from "../data/products";
export const CART_KEY = "dickisserie.cart.v1";
export const MAX_QUANTITY = 20;
export type CartItem = { id: string; quantity: number };
function readCart(): CartItem[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(CART_KEY) || "null");
    if (
      !raw ||
      typeof raw !== "object" ||
      !("version" in raw) ||
      raw.version !== 1 ||
      !("items" in raw) ||
      !Array.isArray(raw.items)
    )
      return [];
    const merged = new Map<string, number>();
    for (const item of raw.items) {
      if (
        item &&
        typeof item === "object" &&
        "id" in item &&
        typeof item.id === "string" &&
        productById.has(item.id) &&
        "quantity" in item &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= MAX_QUANTITY
      ) {
        merged.set(
          item.id,
          Math.min(MAX_QUANTITY, (merged.get(item.id) || 0) + item.quantity),
        );
      }
    }
    return Array.from(merged, ([id, quantity]) => ({ id, quantity }));
  } catch {
    return [];
  }
}
export function useCart() {
  const [items, setItems] = useState<CartItem[]>(readCart);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ version: 1, items }));
    } catch {
      // A failed write to external browser storage needs one render to expose recovery.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageError(true);
    }
  }, [items]);
  const add = (id: string, quantity: number) => {
    if (!productById.has(id) || !Number.isInteger(quantity) || quantity < 1)
      return;
    setItems((prev) => {
      const found = prev.find((item) => item.id === id);
      return found
        ? prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.min(MAX_QUANTITY, item.quantity + quantity),
                }
              : item,
          )
        : [...prev, { id, quantity: Math.min(MAX_QUANTITY, quantity) }];
    });
  };
  const update = (id: string, quantity: number) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)),
                }
              : item,
          ),
    );
  const remove = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce(
    (sum, item) => sum + (productById.get(item.id)?.price || 0) * item.quantity,
    0,
  );
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, add, update, remove, clear, total, count, storageError };
}
export type Cart = ReturnType<typeof useCart>;
