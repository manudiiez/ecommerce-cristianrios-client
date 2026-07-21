"use client";

import { useState } from "react";
import type { Category, Finish, FinishId, Product, Size, WorldId } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { ActiveFilterChips } from "./active-filter-chips";
import { FiltersSidebar } from "./filters-sidebar";
import { SizeCatalog } from "./size-catalog";
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
        <p className="text-ink-soft" style={{ fontSize: 13, margin: 0, display: "inline-flex", gap: 7, alignItems: "center" }}>
          <Ico.ruler style={{ fontSize: 15 }} /> Catálogo organizado por tamaño · Precio igual para todas las
          figuras del mismo tamaño
        </p>
        <button
          className="hidden cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-line-strong bg-surface py-[10px] px-4 text-sm font-semibold max-[880px]:inline-flex"
          onClick={() => setShowFilters((s) => !s)}
        >
          <Ico.box style={{ fontSize: 16 }} /> Filtros {f.activeCount > 0 ? `(${f.activeCount})` : ""}
        </button>
      </div>

      <ActiveFilterChips f={f} categories={categories} />

      <div className="grid grid-cols-[248px_1fr] items-start gap-9 max-[880px]:grid-cols-1 max-[880px]:gap-[18px]">
        <FiltersSidebar f={f} worldCats={worldCats} worldSizes={worldSizes} world={world} collapsed={!showFilters} />
        <div>
          <SizeCatalog
            products={f.filteredProducts}
            totalCount={f.totalCount}
            activeSize={f.activeSize}
            categories={categories}
            allSizes={allSizes}
            finishes={finishes}
            page={f.state.page}
            totalPages={f.totalPages}
            onPageChange={f.set.setPage}
            hasPrevSize={f.hasPrevSize}
            hasNextSize={f.hasNextSize}
            onPrevSize={f.prevSize}
            onNextSize={f.nextSize}
          />
        </div>
      </div>
    </>
  );
}
