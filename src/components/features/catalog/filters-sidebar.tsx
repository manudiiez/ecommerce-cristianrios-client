"use client";

import type { Category, Size, WorldId } from "@/lib/api";
import type { ShopFilter } from "./use-shop-filter";

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
    <aside className={"filters" + (collapsed ? " collapsed" : "")}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4>Filtros</h4>
        {activeCount > 0 && (
          <a className="muted" style={{ fontSize: 12.5, cursor: "pointer" }} onClick={clearAll}>
            Limpiar ({activeCount})
          </a>
        )}
      </div>

      {worldCats && worldCats.length > 0 && (
        <div className="filter-group">
          <span className="fg-title">Categoría</span>
          {worldCats.map((c) => (
            <label className="fopt" key={c.id}>
              <input type="checkbox" checked={state.cats.includes(c.id)} onChange={() => set.toggleCat(c.id)} />
              {c.name} <span className="fc">{c.count}</span>
            </label>
          ))}
        </div>
      )}

      <div className="filter-group">
        <span className="fg-title">Tamaño</span>
        <div className="fchip-row">
          {worldSizes.map((s) => (
            <button
              key={s.id}
              className={"fchip" + (state.sizes.includes(s.id) ? " active" : "")}
              onClick={() => set.toggleSize(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="fg-title">Ofertas</span>
        <label className="fopt">
          <input
            type="checkbox"
            checked={state.onlyOffers}
            onChange={(e) => set.setOnlyOffers(e.target.checked)}
          />
          Solo con descuento
        </label>
      </div>
    </aside>
  );
}
