import type { Finish, PriceQuote, PriceResult, Product, ProductDiscount, Size, WorldId } from "@/lib/api";

export function round100(n: number) {
  return Math.round(n / 100) * 100;
}

/**
 * Determina si un descuento de producto aplica a una combinación tamaño+terminación.
 * Ambos filtros (acabado y tamaño) son un AND: los dos deben pasar.
 */
export function discountApplies(discount: ProductDiscount | undefined, sizeId: string, finishId: string): boolean {
  if (!discount) return false;
  const finishOk = discount.scope === "all" || discount.scope === `finish:${finishId}`;
  const sizeOk = discount.sizeScope !== "specific" || (discount.sizes?.includes(sizeId) ?? false);
  return finishOk && sizeOk;
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
  if (discountApplies(d, size.id, finishId)) {
    was = price;
    price = round100(price * (1 - d!.pct / 100));
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

/**
 * Adapta la respuesta de /api/pricing/quote (calculada en el server) a la
 * forma PriceResult que ya consumen los componentes. No hace ningún cálculo.
 */
export function toPriceResult(quote: PriceQuote | undefined, discountLabel?: string): PriceResult {
  if (!quote) return { price: 0, was: null, hasDiscount: false };
  return {
    price: quote.price,
    was: quote.was ?? null,
    saveLabel: discountLabel,
    hasDiscount: quote.was !== undefined,
  };
}
