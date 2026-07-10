"use client";

import { useState } from "react";
import type { Category, Product, Size, WorldId } from "@/lib/api";

const PAGE_SIZE = 24;

function catHasDiscount(product: Product, categories: Category[]) {
  if (product.discount) return true;
  const c = categories.find((x) => x.id === product.cat);
  return !!(c && c.discount);
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function useShopFilter(baseProducts: Product[], world: WorldId, worldSizes: Size[], categories: Category[]) {
  const [activeSizeId, setActiveSizeId] = useState<string>(worldSizes[0]?.id ?? "");
  const [cats, setCats] = useState<string[]>([]);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [page, setPage] = useState(1);

  const activeSizeIndex = worldSizes.findIndex((s) => s.id === activeSizeId);
  const activeSize = worldSizes[activeSizeIndex] ?? worldSizes[0];

  const selectSize = (id: string) => {
    setActiveSizeId(id);
    setPage(1);
  };
  const goToSize = (index: number) => {
    if (index < 0 || index >= worldSizes.length) return;
    selectSize(worldSizes[index].id);
  };
  const nextSize = () => goToSize(activeSizeIndex + 1);
  const prevSize = () => goToSize(activeSizeIndex - 1);

  const toggleCat = (v: string) => {
    setCats((prev) => toggle(prev, v));
    setPage(1);
  };
  const changeOnlyOffers = (v: boolean) => {
    setOnlyOffers(v);
    setPage(1);
  };

  const clearAll = () => {
    setCats([]);
    setOnlyOffers(false);
    setPage(1);
  };
  const activeCount = cats.length + (onlyOffers ? 1 : 0);

  const filteredProducts = baseProducts.filter((p) => {
    if (!activeSize || !p.availableSizes.includes(activeSize.id)) return false;
    if (cats.length && !cats.includes(p.cat)) return false;
    if (onlyOffers && !catHasDiscount(p, categories)) return false;
    return true;
  });

  const totalCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return {
    state: { activeSizeId, cats, onlyOffers, page: safePage },
    set: {
      selectSize,
      toggleCat,
      setOnlyOffers: changeOnlyOffers,
      setPage,
    },
    activeSize,
    hasPrevSize: activeSizeIndex > 0,
    hasNextSize: activeSizeIndex >= 0 && activeSizeIndex < worldSizes.length - 1,
    nextSize,
    prevSize,
    filteredProducts: pageProducts,
    totalCount,
    totalPages,
    clearAll,
    activeCount,
  };
}

export type ShopFilter = ReturnType<typeof useShopFilter>;
