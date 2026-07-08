import type { Category, Finish, FinishId, Product, Size } from "@/lib/api";
import { ars } from "@/lib/utils";
import { ProductCard } from "./product-card";

interface SizeGroupedCatalogProps {
  filteredProducts: Product[];
  activeSizes: Size[];
  categories: Category[];
  allSizes: Record<string, Size>;
  finishes: Record<FinishId, Finish>;
}

export function SizeGroupedCatalog({
  filteredProducts,
  activeSizes,
  categories,
  allSizes,
  finishes,
}: SizeGroupedCatalogProps) {
  const sections = activeSizes
    .map((size) => ({
      size,
      items: filteredProducts.filter((p) => p.availableSizes.includes(size.id)),
    }))
    .filter((s) => s.items.length > 0);

  if (sections.length === 0) {
    return (
      <div className="empty-state">
        <div className="ring">∅</div>
        <p className="muted">Ninguna figura coincide con los filtros.</p>
      </div>
    );
  }

  return (
    <div>
      {sections.map(({ size, items }) => (
        <div key={size.id} className="size-section">
          <div className="size-section-hd">
            <div className="size-section-left">
              <h3 className="size-section-title">{size.label}</h3>
              <span className="size-section-price">
                {ars(size.price)} sin pintar &nbsp;·&nbsp; {ars(size.price + size.paintedAdd)} pintada
              </span>
            </div>
            <span className="size-section-count">
              {items.length} {items.length === 1 ? "figura" : "figuras"}
            </span>
          </div>
          <div className="grid grid-4">
            {items.map((p) => {
              const cat = categories.find((c) => c.id === p.cat);
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  sizeId={size.id}
                  categoryName={cat?.name ?? ""}
                  categoryHasDiscount={!!cat?.discount}
                  allSizes={allSizes}
                  finishes={finishes}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
