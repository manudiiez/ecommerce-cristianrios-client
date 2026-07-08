"use client";

import { useState } from "react";
import type { Category, Product, Size, WorldId } from "@/lib/api";

function catHasDiscount(product: Product, categories: Category[]) {
  if (product.discount) return true;
  const c = categories.find((x) => x.id === product.cat);
  return !!(c && c.discount);
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function useShopFilter(baseProducts: Product[], world: WorldId, worldSizes: Size[], categories: Category[]) {
  const [sizes, setSizes] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [onlyOffers, setOnlyOffers] = useState(false);

  const clearAll = () => {
    setSizes([]);
    setCats([]);
    setOnlyOffers(false);
  };
  const activeCount = sizes.length + cats.length + (onlyOffers ? 1 : 0);

  const filteredProducts = baseProducts.filter((p) => {
    if (cats.length && !cats.includes(p.cat)) return false;
    if (onlyOffers && !catHasDiscount(p, categories)) return false;
    return true;
  });

  const activeSizes = sizes.length > 0 ? worldSizes.filter((s) => sizes.includes(s.id)) : worldSizes;

  return {
    state: { sizes, cats, onlyOffers },
    set: {
      toggleSize: (v: string) => setSizes((prev) => toggle(prev, v)),
      toggleCat: (v: string) => setCats((prev) => toggle(prev, v)),
      setOnlyOffers,
    },
    filteredProducts,
    activeSizes,
    clearAll,
    activeCount,
  };
}

export type ShopFilter = ReturnType<typeof useShopFilter>;
