"use client";

import type { Category, Size, WorldId } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ShopFilter } from "./use-shop-filter";

const fchipClass =
  "cursor-pointer rounded-full border-[1.5px] border-line-strong bg-surface py-[7px] px-[13px] text-[13px] font-semibold text-ink transition duration-150 hover:border-ink-soft";
const foptClass = "flex cursor-pointer items-center gap-2.5 text-sm text-ink";

interface FiltersSidebarProps {
  f: ShopFilter;
  worldCats?: Category[];
  worldSizes: Size[];
  world: WorldId;
  collapsed: boolean;
}

export function FiltersSidebar({ f, worldCats, worldSizes, collapsed }: FiltersSidebarProps) {
  const { state, set, clearAll, activeCount } = f;

  return (
    <aside
      className={cn(
        "flex flex-col gap-[22px] rounded-lg border border-line bg-surface p-[22px] sticky top-[90px] max-[880px]:static",
        collapsed && "max-[880px]:hidden",
      )}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 className="m-0 text-xs tracking-[0.14em] text-ink-soft uppercase">Filtros</h4>
        {activeCount > 0 && (
          <a className="text-ink-soft" style={{ fontSize: 12.5, cursor: "pointer" }} onClick={clearAll}>
            Limpiar ({activeCount})
          </a>
        )}
      </div>

      {worldCats && worldCats.length > 0 && (
        <div className="flex flex-col gap-[9px]">
          <span className="text-[13px] font-bold tracking-[0.02em]">Categoría</span>
          {worldCats.map((c) => (
            <label className={foptClass} key={c.id}>
              <input
                type="checkbox"
                checked={state.cats.includes(c.id)}
                onChange={() => set.toggleCat(c.id)}
                className="h-[17px] w-[17px] cursor-pointer accent-ink"
              />
              {c.name} <span className="ml-auto text-xs text-ink-soft">{c.count}</span>
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-[9px]">
        <span className="text-[13px] font-bold tracking-[0.02em]">Tamaño</span>
        <div className="flex flex-wrap gap-[7px]">
          {worldSizes.map((s) => (
            <button
              key={s.id}
              className={cn(fchipClass, state.activeSizeId === s.id && "border-ink bg-ink text-paper")}
              onClick={() => set.selectSize(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[9px]">
        <span className="text-[13px] font-bold tracking-[0.02em]">Ofertas</span>
        <label className={foptClass}>
          <input
            type="checkbox"
            checked={state.onlyOffers}
            onChange={(e) => set.setOnlyOffers(e.target.checked)}
            className="h-[17px] w-[17px] cursor-pointer accent-ink"
          />
          Solo con descuento
        </label>
      </div>
    </aside>
  );
}
