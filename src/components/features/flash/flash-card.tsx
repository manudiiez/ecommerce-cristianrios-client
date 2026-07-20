"use client";

import Link from "next/link";
import type { FlashDeal } from "@/lib/api";
import { MiniCountdown } from "@/components/ui/countdown";
import { Ico } from "@/components/ui/icon";
import { Placeholder } from "@/components/ui/placeholder";
import { useCart } from "@/hooks/use-cart";
import { coverImage, mediaUrl } from "@/lib/images";
import { ars } from "@/lib/utils";

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
    <div className="flash-card fade-in">
      <Link href={`/ofertas-flash/${deal.id}`} style={{ position: "relative", display: "block" }}>
        <Placeholder tint="#3a2a22" label={deal.name} media={media} style={{ aspectRatio: "4/3", borderRadius: 0 }} />
        <div className="badges">
          <span className="pill pill-flash">−{pct}%</span>
        </div>
      </Link>
      <div className="fc-body">
        <span className="fc-kicker">{deal.kicker}</span>
        <Link href={`/ofertas-flash/${deal.id}`} className="fc-name">
          {deal.name}
        </Link>
        <span className="fc-blurb">{deal.blurb}</span>
        <div className="fc-stock">
          <div className="fc-bar">
            <i style={{ width: stockPct + "%" }}></i>
          </div>
          <small>
            Quedan {deal.stockLeft} de {deal.stockTotal} · <MiniCountdown endsAt={deal.endsAt} />
          </small>
        </div>
      </div>
      <div className="fc-foot">
        <div className="fc-price">
          <b>{ars(deal.price)}</b>
          <s>{ars(deal.regular)}</s>
        </div>
        <button className="btn" style={{ background: "var(--flash)", color: "#fff" }} onClick={add}>
          Sumar <Ico.arrow />
        </button>
      </div>
    </div>
  );
}
