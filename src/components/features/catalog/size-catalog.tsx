import type { Category, Finish, FinishId, Product, Size } from "@/lib/api";
import { ars } from "@/lib/utils";
import { ProductCard } from "./product-card";

interface SizeCatalogProps {
  products: Product[];
  totalCount: number;
  activeSize: Size;
  categories: Category[];
  allSizes: Record<string, Size>;
  finishes: Record<FinishId, Finish>;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasPrevSize: boolean;
  hasNextSize: boolean;
  onPrevSize: () => void;
  onNextSize: () => void;
}

export function SizeCatalog({
  products,
  totalCount,
  activeSize,
  categories,
  allSizes,
  finishes,
  page,
  totalPages,
  onPageChange,
  hasPrevSize,
  hasNextSize,
  onPrevSize,
  onNextSize,
}: SizeCatalogProps) {
  const sizeNav = (
    <div className="size-nav-row">
      <button className="btn btn-ghost btn-sm" disabled={!hasPrevSize} onClick={onPrevSize}>
        ← Tamaño anterior
      </button>
      <button className="btn btn-ghost btn-sm" disabled={!hasNextSize} onClick={onNextSize}>
        Tamaño siguiente →
      </button>
    </div>
  );

  if (totalCount === 0) {
    return (
      <div>
        <div className="empty-state">
          <div className="ring">∅</div>
          <p className="muted">Ninguna figura coincide con los filtros.</p>
        </div>
        <div className="catalog-pager">{sizeNav}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="size-section">
        <div className="size-section-hd">
          <div className="size-section-left">
            <h3 className="size-section-title">{activeSize.label}</h3>
            <span className="size-section-price">
              {ars(activeSize.price)} sin pintar &nbsp;·&nbsp; {ars(activeSize.price + activeSize.paintedAdd)} pintada
            </span>
          </div>
          <span className="size-section-count">
            {totalCount} {totalCount === 1 ? "figura" : "figuras"}
          </span>
        </div>
        <div className="grid grid-4">
          {products.map((p) => {
            const cat = categories.find((c) => c.id === p.cat);
            return (
              <ProductCard
                key={p.id}
                product={p}
                sizeId={activeSize.id}
                categoryName={cat?.name ?? ""}
                categoryHasDiscount={!!cat?.discount}
                allSizes={allSizes}
                finishes={finishes}
              />
            );
          })}
        </div>
      </div>

      <div className="catalog-pager">
        {totalPages > 1 && (
          <div className="pager-row">
            <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
              ‹ Anterior
            </button>
            <span className="pager-info">
              Página {page} de {totalPages}
            </span>
            <button
              className="btn btn-ghost btn-sm"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Siguiente ›
            </button>
          </div>
        )}
        {sizeNav}
      </div>
    </div>
  );
}
