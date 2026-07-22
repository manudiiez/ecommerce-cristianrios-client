"use client";

import type { CartLine } from "@/lib/api";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const CART_KEY = "hanna_cart_v1";

interface CartContextValue {
  items: CartLine[];
  add: (line: CartLine) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  total: number;
  toastMsg: string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    // diferido (no sincrónico) para no chocar con el render de hidratación del servidor
    const kickoff = setTimeout(() => {
      try {
        const raw = localStorage.getItem(CART_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // localStorage no disponible / dato corrupto — arrancamos con carrito vacío
      }
      hydrated.current = true;
    }, 0);
    return () => clearTimeout(kickoff);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2200);
  }, []);

  const add = useCallback(
    (line: CartLine) => {
      setItems((prev) => {
        const i = prev.findIndex((p) => p.key === line.key);
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], qty: next[i].qty + line.qty };
          return next;
        }
        return [...prev, line];
      });
      toast(line.name + " · agregado al pedido");
    },
    [toast],
  );

  const setQty = useCallback((key: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((p) => p.key !== key));
      return;
    }
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty } : p)));
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total, toastMsg }}>
      {children}
    </CartContext.Provider>
  );
}
