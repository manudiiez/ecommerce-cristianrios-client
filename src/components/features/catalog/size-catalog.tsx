import type { Category, Finish, FinishId, Product, Size } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="ghost" size="sm" disabled={!hasPrevSize} onClick={onPrevSize}>
        ← Tamaño anterior
      </Button>
      <Button variant="ghost" size="sm" disabled={!hasNextSize} onClick={onNextSize}>
        Tamaño siguiente →
      </Button>
    </div>
  );

  if (totalCount === 0) {
    return (
      <div>
        <div className="px-5 py-20 text-center">
          <div className="mx-auto mb-5 flex h-[88px] w-[88px] rotate-[-4deg] items-center justify-center rounded-full border-[1.5px] border-line-strong font-script text-[46px] text-ink-soft">
            ∅
          </div>
          <p className="text-ink-soft">Ninguna figura coincide con los filtros.</p>
        </div>
        <div className="mt-8 flex flex-col items-center gap-[14px]">{sizeNav}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12">
        <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-3.5">
          <div className="flex flex-wrap items-baseline gap-[14px]">
            <h3 className="font-display m-0 text-[26px] font-medium">{activeSize.label}</h3>
            <span className="text-[13px] text-ink-soft">
              {ars(activeSize.price)} sin pintar &nbsp;·&nbsp; {ars(activeSize.price + activeSize.paintedAdd)} pintada
            </span>
          </div>
          <span className="text-[12.5px] font-semibold whitespace-nowrap text-ink-soft">
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

      <div className="mt-8 flex flex-col items-center gap-[14px]">
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
              ‹ Anterior
            </Button>
            <span className="text-[13px] text-ink-soft">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Siguiente ›
            </Button>
          </div>
        )}
        {sizeNav}
      </div>
    </div>
  );
}
