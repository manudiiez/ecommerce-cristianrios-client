"use client";

import { useState } from "react";
import type { Category, Finish, FinishId, Product, Size, WorldId } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { ActiveFilterChips } from "./active-filter-chips";
import { FiltersSidebar } from "./filters-sidebar";
import { SizeGroupedCatalog } from "./size-grouped-catalog";
import { useShopFilter } from "./use-shop-filter";

interface ShopCatalogProps {
  products: Product[];
  world: WorldId;
  worldSizes: Size[];
  allSizes: Record<string, Size>;
  finishes: Record<FinishId, Finish>;
  categories: Category[];
  worldCats?: Category[];
}

export function ShopCatalog({
  products,
  world,
  worldSizes,
  allSizes,
  finishes,
  categories,
  worldCats,
}: ShopCatalogProps) {
  const f = useShopFilter(products, world, worldSizes, categories);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <div className="sec-head" style={{ marginBottom: 16, alignItems: "center" }}>
        <p className="muted" style={{ fontSize: 13, margin: 0, display: "inline-flex", gap: 7, alignItems: "center" }}>
          <Ico.ruler style={{ fontSize: 15 }} /> Catálogo organizado por tamaño · Precio igual para todas las
          figuras del mismo tamaño
        </p>
        <button className="filters-toggle" onClick={() => setShowFilters((s) => !s)}>
          <Ico.box style={{ fontSize: 16 }} /> Filtros {f.activeCount > 0 ? `(${f.activeCount})` : ""}
        </button>
      </div>

      <ActiveFilterChips f={f} categories={categories} allSizes={allSizes} />

      <div className="shop-layout">
        <FiltersSidebar f={f} worldCats={worldCats} worldSizes={worldSizes} world={world} collapsed={!showFilters} />
        <div>
          <SizeGroupedCatalog
            filteredProducts={f.filteredProducts}
            activeSizes={f.activeSizes}
            categories={categories}
            allSizes={allSizes}
            finishes={finishes}
          />
        </div>
      </div>
    </>
  );
}
