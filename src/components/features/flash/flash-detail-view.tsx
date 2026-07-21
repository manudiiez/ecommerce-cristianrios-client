"use client";

import { useState } from "react";
import type { FlashDeal } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Ico } from "@/components/ui/icon";
import { Lightbox } from "@/components/ui/lightbox";
import { Placeholder } from "@/components/ui/placeholder";
import { pillBase, pillKindClass } from "@/components/ui/pill";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { Countdown } from "@/components/ui/countdown";
import { useCart } from "@/hooks/use-cart";
import { mediaUrl } from "@/lib/images";
import { ars, cn } from "@/lib/utils";

const optClass =
  "relative cursor-pointer rounded border-[1.5px] border-line-strong bg-surface py-3 px-4 min-w-[86px] transition duration-150 hover:border-ink-soft";
const optActiveClass = "border-ink bg-paper-2";

export function FlashDetailView({ deal }: { deal: FlashDeal }) {
  const cart = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(deal.variantGroups.map((g) => [g.id, g.values[0]?.id])),
  );
  const [qty, setQty] = useState(1);
  const [mainIdx, setMainIdx] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasImages = deal.images.length > 0;

  const selectedValues = deal.variantGroups.map(
    (g) => g.values.find((v) => v.id === selected[g.id]) ?? g.values[0],
  );

  const addToCart = () => {
    const media = hasImages ? (deal.images[mainIdx]?.image ?? deal.images.find((i) => i.cover)?.image) : undefined;
    cart.add({
      key: "flash|" + deal.id + "|" + deal.variantGroups.map((g) => selected[g.id]).join("-"),
      id: deal.id,
      name: deal.name,
      world: "flash",
      cat: "flash",
      isFlash: true,
      sizeLabel: selectedValues.map((v) => v.label).join(" · "),
      finishLabel: "Edición limitada",
      price: deal.price,
      qty,
      imageUrl: mediaUrl(media, "thumbnail"),
      imageAlt: media?.alt,
    });
  };

  return (
    <div className="wrap grid grid-cols-2 items-start gap-[50px] pt-[26px] pb-2.5 max-[880px]:grid-cols-1 max-[880px]:gap-7">
      {hasImages && lightboxIndex !== null && (
        <Lightbox
          images={deal.images.map((i) => i.image)}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      <div className="sticky top-[90px] flex flex-col gap-3 max-[880px]:static">
        {hasImages ? (
          <>
            <Placeholder
              tint="#3a2a22"
              label={deal.name}
              media={deal.images[mainIdx]?.image}
              variant="large"
              zoomable
              style={{ aspectRatio: "1", borderRadius: "var(--radius-lg)", cursor: "pointer" }}
              onClick={() => setLightboxIndex(mainIdx)}
            />
            <div className="grid grid-cols-4 gap-3">
              {deal.images.map((img, i) => (
                <Placeholder
                  key={img.image.id}
                  tint="#3a2a22"
                  label={deal.name}
                  media={img.image}
                  active={i === mainIdx}
                  className={cn("opacity-70 transition-opacity duration-150 hover:opacity-100", i === mainIdx && "opacity-100")}
                  style={{ aspectRatio: "1", cursor: "pointer", borderRadius: "var(--radius)" }}
                  onClick={() => setMainIdx(i)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <Placeholder tint="#3a2a22" label={deal.name} offset={mainIdx} style={{ aspectRatio: "1", borderRadius: "var(--radius-lg)" }} />
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2].map((i) => (
                <Placeholder
                  key={i}
                  tint="#3a2a22"
                  label={deal.name}
                  offset={i}
                  active={i === mainIdx}
                  className={cn("opacity-70 transition-opacity duration-150 hover:opacity-100", i === mainIdx && "opacity-100")}
                  style={{ aspectRatio: "1", cursor: "pointer", borderRadius: "var(--radius)" }}
                  onClick={() => setMainIdx(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        <span className={cn(pillBase, pillKindClass.flash)}>
          <Ico.bolt style={{ fontSize: 13 }} /> Oferta Flash
        </span>
        <h1 className="display" style={{ margin: "8px 0" }}>
          {deal.name}
        </h1>
        <p className="max-w-[46ch] text-base text-ink-soft">{deal.blurb}</p>

        <div className="my-5 flex items-baseline gap-3">
          <span className="font-display text-[38px] font-semibold">{ars(deal.price)}</span>
          <span className="text-[19px] text-ink-soft line-through">{ars(deal.regular)}</span>
        </div>

        <p className="text-ink-soft" style={{ fontSize: 13.5 }}>
          Quedan {deal.stockLeft} de {deal.stockTotal} unidades.
        </p>

        <div style={{ display: "inline-block", color: "#fff" }}>
          <span className="text-[13px] opacity-60" style={{ color: "var(--color-ink-soft)" }}>
            Termina en
          </span>
          <Countdown endsAt={deal.endsAt} />
        </div>

        {deal.variantGroups.map((group) => (
          <div className="my-[22px]" key={group.id}>
            <div className="mb-[11px] flex items-baseline justify-between">
              <b className="text-[13px] tracking-[0.04em] uppercase">{group.name}</b>
              <span className="text-[13px] text-ink-soft">{group.values.find((v) => v.id === selected[group.id])?.label}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {group.values.map((v) => (
                <div
                  key={v.id}
                  className={cn(optClass, v.id === selected[group.id] && optActiveClass)}
                  onClick={() => setSelected((s) => ({ ...s, [group.id]: v.id }))}
                >
                  <span className="block text-sm font-semibold">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="my-[26px] mb-5 flex flex-wrap items-center gap-3">
          <QtyStepper value={qty} onChange={setQty} />
          <Button variant="dark" size="lg" onClick={addToCart}>
            <Ico.cart style={{ fontSize: 18 }} /> Agregar al pedido
          </Button>
        </div>
        <p className="text-ink-soft" style={{ fontSize: 13, marginTop: -6 }}>
          No se paga en la web. Sumás al pedido y coordinamos pago y envío por WhatsApp o email.
        </p>
      </div>
    </div>
  );
}
