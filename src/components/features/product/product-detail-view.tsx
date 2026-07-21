"use client";

import { useState } from "react";
import type { Category, Finish, FinishId, PriceQuote, Product, Size } from "@/lib/api";
import { ProductCard } from "@/components/features/catalog/product-card";
import { Button, LinkButton } from "@/components/ui/button";
import { Ico } from "@/components/ui/icon";
import { Lightbox } from "@/components/ui/lightbox";
import { Pill } from "@/components/ui/pill";
import { Placeholder } from "@/components/ui/placeholder";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { useCart } from "@/hooks/use-cart";
import { mediaUrl, productImage, productImageIndex } from "@/lib/images";
import { discountApplies, toPriceResult, worldAccent } from "@/lib/pricing";
import { ars, cn, waLink } from "@/lib/utils";

const GALLERY_VIEWS = ["Frente", "Perfil", "Detalle", "Escala"];

const optClass =
  "relative cursor-pointer rounded border-[1.5px] border-line-strong bg-surface py-3 px-4 min-w-[86px] transition duration-150 hover:border-ink-soft";
const optActiveClass = "border-ink bg-paper-2";

interface ProductDetailViewProps {
  product: Product;
  category: Category;
  productSizes: Size[];
  allSizes: Record<string, Size>;
  finishes: Record<FinishId, Finish>;
  initialSizeId: string;
  related: Product[];
  categories: Category[];
  priceMap: Record<string, PriceQuote>;
}

export function ProductDetailView({
  product,
  category,
  productSizes,
  allSizes,
  finishes,
  initialSizeId,
  related,
  categories,
  priceMap,
}: ProductDetailViewProps) {
  const cart = useCart();
  const [sizeId, setSizeId] = useState(initialSizeId);
  const [finishId, setFinishId] = useState<FinishId>(product.finishes[0]);
  const [qty, setQty] = useState(1);
  const [legacyIdx, setLegacyIdx] = useState(0);
  const [manualSelection, setManualSelection] = useState<{ key: string; idx: number } | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const selectionKey = `${sizeId}|${finishId}`;

  const hasImages = product.images.length > 0;
  const mainIdx =
    manualSelection?.key === selectionKey ? manualSelection.idx : productImageIndex(product.images, sizeId, finishId);

  const pr = toPriceResult(priceMap[`${sizeId}|${finishId}`], product.discount?.label);
  const savePct = pr.was ? Math.round((1 - pr.price / pr.was) * 100) : 0;
  const currentSize = allSizes[sizeId];

  const addToCart = () => {
    const media = productImage(product.images, sizeId, finishId);
    cart.add({
      key: `${product.id}|${sizeId}|${finishId}`,
      id: product.id,
      name: product.name,
      world: product.world,
      cat: product.cat,
      sizeLabel: currentSize?.label ?? sizeId,
      finishLabel: finishes[finishId]?.label ?? finishId,
      price: pr.price,
      qty,
      imageUrl: mediaUrl(media, "thumbnail"),
      imageAlt: media?.alt,
    });
  };

  return (
    <>
      {hasImages && lightboxIndex !== null && (
        <Lightbox
          images={product.images.map((i) => i.image)}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      <div className="wrap grid grid-cols-2 items-start gap-[50px] pt-[26px] pb-2.5 max-[880px]:grid-cols-1 max-[880px]:gap-7">
        {/* Galería */}
        <div className="sticky top-[90px] flex flex-col gap-3 max-[880px]:static">
          {hasImages ? (
            <>
              <Placeholder
                world={product.world}
                cat={product.cat}
                label={product.name}
                tag={finishId === "pintada" ? "Pintada a mano" : "Yeso natural"}
                media={product.images[mainIdx]?.image}
                variant="large"
                zoomable
                style={{ aspectRatio: "1", borderRadius: "var(--radius-lg)", cursor: "pointer" }}
                onClick={() => setLightboxIndex(mainIdx)}
              />
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <Placeholder
                    key={img.image.id}
                    world={product.world}
                    cat={product.cat}
                    label={product.name}
                    media={img.image}
                    active={i === mainIdx}
                    className={cn(
                      "opacity-70 transition-opacity duration-150 hover:opacity-100",
                      i === mainIdx && "opacity-100",
                    )}
                    style={{ aspectRatio: "1", cursor: "pointer", borderRadius: "var(--radius)" }}
                    onClick={() => setManualSelection({ key: selectionKey, idx: i })}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <Placeholder
                world={product.world}
                cat={product.cat}
                label={product.name}
                tag={finishId === "pintada" ? "Pintada a mano" : "Yeso natural"}
                offset={legacyIdx}
                style={{ aspectRatio: "1", borderRadius: "var(--radius-lg)" }}
              />
              <div className="grid grid-cols-4 gap-3">
                {GALLERY_VIEWS.map((v, i) => (
                  <Placeholder
                    key={v}
                    world={product.world}
                    cat={product.cat}
                    label={product.name}
                    offset={i}
                    active={i === legacyIdx}
                    className={cn(
                      "opacity-70 transition-opacity duration-150 hover:opacity-100",
                      i === legacyIdx && "opacity-100",
                    )}
                    style={{ aspectRatio: "1", cursor: "pointer", borderRadius: "var(--radius)" }}
                    onClick={() => setLegacyIdx(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="kicker" style={{ color: product.world === "religioso" ? "var(--color-clay-deep)" : "var(--color-rose-deep)" }}>
            {category.name}
          </span>
          <h1 className="display">{product.name}</h1>
          <div style={{ display: "flex", gap: 8, margin: "4px 0 0", flexWrap: "wrap" }}>
            {product.tag && <Pill kind={worldAccent(product.world)}>{product.tag}</Pill>}
            {product.discount && <Pill kind="sale">{product.discount.label}</Pill>}
          </div>
          <p className="max-w-[46ch] text-base text-ink-soft" style={{ marginTop: 16 }}>
            {product.blurb}
          </p>

          <div className="my-5 flex items-baseline gap-3">
            <span className="font-display text-[38px] font-semibold">{ars(pr.price)}</span>
            {pr.was && <span className="text-[19px] text-ink-soft line-through">{ars(pr.was)}</span>}
            {pr.was && (
              <span className="text-[13px] font-bold" style={{ color: "var(--color-flash)" }}>
                Ahorrás {ars(pr.was - pr.price)} ({savePct}%)
              </span>
            )}
          </div>

          {/* TERMINACIÓN */}
          <div className="my-[22px]">
            <div className="mb-[11px] flex items-baseline justify-between">
              <b className="text-[13px] tracking-[0.04em] uppercase">
                <Ico.brush style={{ verticalAlign: "-2px", marginRight: 6 }} />
                Terminación
              </b>
              <span className="text-[13px] text-ink-soft">{finishes[finishId].label}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.finishes.map((fid) => {
                const f = finishes[fid];
                const hasFinishDisc = discountApplies(product.discount, sizeId, fid);
                const active = fid === finishId;
                return (
                  <div
                    key={fid}
                    className={cn(optClass, "flex items-center gap-2.5", active && optActiveClass)}
                    onClick={() => setFinishId(fid)}
                  >
                    <span className="h-[22px] w-[22px] shrink-0 rounded-full border border-[rgba(0,0,0,.15)]" style={{ background: f.swatch }}></span>
                    <span>
                      <span className="block text-sm font-semibold">{f.label}</span>
                      <span className="text-[11.5px] text-ink-soft">{f.add > 0 ? `+${ars(f.add)}` : f.sub}</span>
                    </span>
                    {hasFinishDisc && (
                      <span className="absolute -top-[9px] -right-2">
                        <Pill kind="sale">{product.discount!.label}</Pill>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TAMAÑO */}
          <div className="my-[22px]">
            <div className="mb-[11px] flex items-baseline justify-between">
              <b className="text-[13px] tracking-[0.04em] uppercase">
                <Ico.ruler style={{ verticalAlign: "-2px", marginRight: 6 }} />
                Tamaño
              </b>
              <span className="text-[13px] text-ink-soft">
                {currentSize ? currentSize.label : ""} · {ars(pr.price)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {productSizes.map((s) => {
                const pp = toPriceResult(priceMap[`${s.id}|${finishId}`], product.discount?.label);
                const hasSizeDisc = discountApplies(product.discount, s.id, finishId);
                const active = s.id === sizeId;
                return (
                  <div key={s.id} className={cn(optClass, active && optActiveClass)} onClick={() => setSizeId(s.id)}>
                    <span className="block text-sm font-semibold">{s.label}</span>
                    <span className="text-[11.5px] text-ink-soft">{ars(pp.price)}</span>
                    {hasSizeDisc && (
                      <span className="absolute -top-[9px] -right-2">
                        <Pill kind="sale">{product.discount!.label}</Pill>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CANTIDAD + ACCIONES */}
          <div className="my-[26px] mb-5 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} />
            <Button variant="dark" size="lg" onClick={addToCart}>
              <Ico.cart style={{ fontSize: 18 }} /> Agregar al pedido
            </Button>
            <LinkButton
              variant="wa"
              href={waLink(
                `¡Hola! Me interesa: ${product.name}\nTamaño: ${currentSize ? currentSize.label : sizeId}\nTerminación: ${finishes[finishId].label}\nCantidad: ${qty}\nPrecio ref.: ${ars(pr.price)} c/u`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              <Ico.wa style={{ fontSize: 18 }} /> Consultar
            </LinkButton>
          </div>
          <p className="text-ink-soft" style={{ fontSize: 13, marginTop: -6 }}>
            No se paga en la web. Sumás al pedido y coordinamos pago y envío por WhatsApp o email.
          </p>

          <div className="mt-[22px] flex flex-col gap-3 border-t border-line pt-5">
            <div className="flex items-start gap-3 text-sm">
              <span className="w-5 shrink-0 text-ink-soft">
                <Ico.truck />
              </span>
              <div>
                <b>Envíos a todo el país.</b> <span className="text-ink-soft">Coordinamos por correo o transporte según la zona.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="w-5 shrink-0 text-ink-soft">
                <Ico.box />
              </span>
              <div>
                <b>Precio mayorista y minorista.</b> <span className="text-ink-soft">Por cantidad mejoramos el precio — consultanos.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="w-5 shrink-0 text-ink-soft">
                <Ico.brush />
              </span>
              <div>
                <b>Pintada a mano.</b> <span className="text-ink-soft">Cada pieza pintada es única; puede variar levemente.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap section">
        <div className="sec-head">
          <div>
            <span className="kicker">También te puede gustar</span>
            <h2 style={{ fontSize: 30 }}>Relacionados</h2>
          </div>
        </div>
        <div className="grid grid-4">
          {related.map((rp) => {
            const cat = categories.find((c) => c.id === rp.cat);
            return (
              <ProductCard
                key={rp.id}
                product={rp}
                categoryName={cat?.name ?? ""}
                categoryHasDiscount={!!cat?.discount}
                allSizes={allSizes}
                finishes={finishes}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
