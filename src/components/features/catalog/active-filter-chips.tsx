"use client";

import type { Category } from "@/lib/api";
import type { ShopFilter } from "./use-shop-filter";

export function ActiveFilterChips({ f, categories }: { f: ShopFilter; categories: Category[] }) {
  const { state, set, clearAll, activeCount } = f;
  if (activeCount === 0) return null;

  const chips: { label: string; clear: () => void }[] = [];
  state.cats.forEach((c) => {
    const cc = categories.find((x) => x.id === c);
    chips.push({ label: cc ? cc.name : c, clear: () => set.toggleCat(c) });
  });
  if (state.onlyOffers) chips.push({ label: "Con descuento", clear: () => set.setOnlyOffers(false) });

  return (
    <div className="active-filters">
      {chips.map((c, i) => (
        <button key={i} className="af-pill" onClick={c.clear}>
          {c.label} <span className="x">×</span>
        </button>
      ))}
      <button className="af-pill" style={{ borderStyle: "dashed" }} onClick={clearAll}>
        Limpiar todo
      </button>
    </div>
  );
}
