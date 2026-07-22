"use client";

import type { Category } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ShopFilter } from "./use-shop-filter";

const afPillClass =
  "inline-flex cursor-pointer items-center gap-[7px] rounded-full border border-line bg-paper-2 py-1.5 px-3 text-[12.5px] font-semibold hover:border-ink";

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
    <div className="mb-[18px] flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <button key={i} className={afPillClass} onClick={c.clear}>
          {c.label} <span className="text-[13px] opacity-60">×</span>
        </button>
      ))}
      <button className={cn(afPillClass, "border-dashed")} onClick={clearAll}>
        Limpiar todo
      </button>
    </div>
  );
}
