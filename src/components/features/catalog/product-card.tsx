import Link from "next/link";
import type { Finish, FinishId, Product, Size } from "@/lib/api";
import { Pill } from "@/components/ui/pill";
import { Placeholder } from "@/components/ui/placeholder";
import { coverImage, productImage } from "@/lib/images";
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
  const media = sizeId ? productImage(product.images, sizeId, "crudo") : coverImage(product.images);

  return (
    <Link href={href} className="group flex cursor-pointer flex-col gap-3 animate-fade-in">
      <div style={{ position: "relative" }}>
        <Placeholder
          world={product.world}
          cat={product.cat}
          label={product.name}
          media={media}
          variant="large"
          sizes="(max-width: 820px) 50vw, (max-width: 1080px) 33vw, 25vw"
          style={{ aspectRatio: "4/5" }}
          className="group-hover:shadow-[var(--shadow-brand)]"
        />
        <div className="absolute top-3 right-3 z-[2] flex flex-col items-end gap-1.5">
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
      <div className="flex flex-col gap-[3px]">
        <span className="text-[11px] font-semibold tracking-[0.1em] text-ink-soft uppercase">{categoryName}</span>
        <span className="font-display text-lg leading-[1.15] font-medium">{product.name}</span>
        <div className="mt-0.5 flex items-baseline gap-2">
          {!sizeId && <span className="text-[11px] text-ink-soft">desde</span>}
          {fp.was && <span className="text-[13px] text-ink-soft line-through">{ars(fp.was)}</span>}
          <span className="text-base font-bold">{ars(fp.price)}</span>
        </div>
      </div>
    </Link>
  );
}
