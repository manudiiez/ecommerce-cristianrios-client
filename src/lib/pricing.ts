import type { Finish, PriceResult, Product, Size, WorldId } from "@/lib/api";

export function round100(n: number) {
  return Math.round(n / 100) * 100;
}

/**
 * Precio para una combinación tamaño+terminación, aplicando descuentos.
 * El precio base es el precio plano del tamaño (no depende del producto).
 */
export function priceFor(
  product: Pick<Product, "discount">,
  size: Size | undefined,
  finish: Finish | undefined,
  finishId: string,
): PriceResult {
  if (!size || !finish) return { price: 0, was: null, hasDiscount: false };
  const finishAdd = finishId === "pintada" ? size.paintedAdd || 0 : 0;
  let price = size.price + finishAdd;
  let was: number | null = null;
  const d = product.discount;
  if (d) {
    const applies = d.scope === "all" || (d.scope.startsWith("finish:") && d.scope.split(":")[1] === finishId);
    if (applies) {
      was = price;
      price = round100(price * (1 - d.pct / 100));
    }
  }
  return { price, was, saveLabel: d?.label, hasDiscount: was !== null };
}

/** Precio "desde" para tarjetas: primer tamaño disponible, sin pintar. */
export function fromPrice(
  product: Product,
  allSizes: Record<string, Size>,
  finishes: Record<string, Finish>,
): PriceResult {
  const sizeId = product.availableSizes[0];
  const finishId = product.finishes[0];
  return priceFor(product, allSizes[sizeId], finishes[finishId], finishId);
}

export function worldAccent(world: WorldId | "flash"): "clay" | "rose" {
  return world === "religioso" ? "clay" : "rose";
}
