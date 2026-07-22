"use client";

import Link from "next/link";
import type { FlashDeal } from "@/lib/api";
import { MiniCountdown } from "@/components/ui/countdown";
import { Ico } from "@/components/ui/icon";
import { Placeholder } from "@/components/ui/placeholder";
import { btnBase } from "@/components/ui/button";
import { pillBase, pillKindClass } from "@/components/ui/pill";
import { useCart } from "@/hooks/use-cart";
import { coverImage, mediaUrl } from "@/lib/images";
import { ars, cn } from "@/lib/utils";

export function FlashCard({ deal }: { deal: FlashDeal }) {
  const cart = useCart();
  const pct = Math.round((1 - deal.price / deal.regular) * 100);
  const stockPct = Math.round((deal.stockLeft / deal.stockTotal) * 100);
  const defaultValues = deal.variantGroups.map((g) => g.values[0]);
  const media = coverImage(deal.images);

  const add = () =>
    cart.add({
      key: "flash|" + deal.id + "|" + defaultValues.map((v) => v.id).join("-"),
      id: deal.id,
      name: deal.name,
      world: "flash",
      cat: "flash",
      isFlash: true,
      sizeLabel: defaultValues.map((v) => v.label).join(" · "),
      finishLabel: "Edición limitada",
      price: deal.price,
      qty: 1,
      imageUrl: mediaUrl(media, "thumbnail"),
      imageAlt: media?.alt,
    });

  return (
    <div className="flash-card flex animate-fade-in flex-col overflow-hidden rounded-lg border border-[rgba(255,255,255,.1)]">
      <Link href={`/ofertas-flash/${deal.id}`} style={{ position: "relative", display: "block" }}>
        <Placeholder tint="#3a2a22" label={deal.name} media={media} style={{ aspectRatio: "4/3", borderRadius: 0 }} />
        <div className="absolute top-3 right-3 z-[2] flex flex-col items-end gap-1.5">
          <span className={cn(pillBase, pillKindClass.flash)}>−{pct}%</span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase" style={{ color: "var(--color-flash)" }}>
          {deal.kicker}
        </span>
        <Link href={`/ofertas-flash/${deal.id}`} className="font-display text-[23px] leading-[1.12] font-semibold text-white">
          {deal.name}
        </Link>
        <span className="text-[13.5px] text-[rgba(255,255,255,.6)]">{deal.blurb}</span>
        <div className="mt-1.5">
          <div className="my-[7px] mb-1 h-[7px] overflow-hidden rounded-full bg-[rgba(255,255,255,.14)]">
            <i
              className="block h-full rounded-full"
              style={{ width: stockPct + "%", background: "linear-gradient(90deg,var(--color-flash),#ff8a3d)" }}
            ></i>
          </div>
          <small className="text-[11.5px] text-[rgba(255,255,255,.55)]">
            Quedan {deal.stockLeft} de {deal.stockTotal} · <MiniCountdown endsAt={deal.endsAt} />
          </small>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-5 pb-5">
        <div>
          <b className="font-display text-2xl font-bold text-white">{ars(deal.price)}</b>
          <s className="ml-2 text-sm text-[rgba(255,255,255,.45)]">{ars(deal.regular)}</s>
        </div>
        <button className={btnBase} style={{ background: "var(--color-flash)", color: "#fff" }} onClick={add}>
          Sumar <Ico.arrow />
        </button>
      </div>
    </div>
  );
}
