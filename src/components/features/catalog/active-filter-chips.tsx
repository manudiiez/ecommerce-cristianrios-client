"use client";

import type { Category, Size } from "@/lib/api";
import type { ShopFilter } from "./use-shop-filter";

export function ActiveFilterChips({
  f,
  categories,
  allSizes,
}: {
  f: ShopFilter;
  categories: Category[];
  allSizes: Record<string, Size>;
}) {
  const { state, set, clearAll, activeCount } = f;
  if (activeCount === 0) return null;

  const chips: { label: string; clear: () => void }[] = [];
  state.cats.forEach((c) => {
    const cc = categories.find((x) => x.id === c);
    chips.push({ label: cc ? cc.name : c, clear: () => set.toggleCat(c) });
  });
  state.sizes.forEach((s) => {
    const so = allSizes[s];
    chips.push({ label: so ? so.label : s, clear: () => set.toggleSize(s) });
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
