import Link from "next/link";
import type { Finish, FinishId, Product, Size } from "@/lib/api";
import { Pill } from "@/components/ui/pill";
import { Placeholder } from "@/components/ui/placeholder";
import { fromPrice, priceFor, worldAccent } from "@/lib/pricing";
import { ars } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  sizeId?: string;
  categoryName: string;
  categoryHasDiscount: boolean;
  allSizes: Record<string, Size>;
  finishes: Record<FinishId, Finish>;
}

export function ProductCard({
  product,
  sizeId,
  categoryName,
  categoryHasDiscount,
  allSizes,
  finishes,
}: ProductCardProps) {
  const fp = sizeId
    ? priceFor(product, allSizes[sizeId], finishes.crudo, "crudo")
    : fromPrice(product, allSizes, finishes);
  const sizeLabel = sizeId ? allSizes[sizeId]?.label : null;
  const href = sizeId ? `/producto/${product.id}?size=${sizeId}` : `/producto/${product.id}`;

  return (
    <Link href={href} className="card fade-in" style={{ cursor: "pointer" }}>
      <div style={{ position: "relative" }}>
        <Placeholder world={product.world} cat={product.cat} label={product.name} style={{ aspectRatio: "4/5" }} />
        <div className="badges">
          {product.tag && <Pill kind={worldAccent(product.world)}>{product.tag}</Pill>}
          {fp.hasDiscount && product.discount && <Pill kind="sale">{product.discount.label}</Pill>}
          {!fp.hasDiscount && categoryHasDiscount && <Pill kind="sale">Oferta</Pill>}
        </div>
        {sizeLabel && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              background: "rgba(0,0,0,.55)",
              color: "#fff",
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: ".04em",
              padding: "3px 8px",
              borderRadius: "var(--radius)",
            }}
          >
            {sizeLabel}
          </div>
        )}
      </div>
      <div className="meta">
        <span className="cat-lbl">{categoryName}</span>
        <span className="nm">{product.name}</span>
        <div className="price-row">
          {!sizeId && <span className="from">desde</span>}
          {fp.was && <span className="price-old">{ars(fp.was)}</span>}
          <span className="price">{ars(fp.price)}</span>
        </div>
      </div>
    </Link>
  );
}
