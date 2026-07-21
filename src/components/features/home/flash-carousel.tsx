"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FlashDeal } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { Placeholder } from "@/components/ui/placeholder";
import { btnBase } from "@/components/ui/button";
import { pillBase, pillKindClass } from "@/components/ui/pill";
import { useCountdown } from "@/hooks/use-countdown";
import { coverImage } from "@/lib/images";
import { ars, cn } from "@/lib/utils";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Todo el bloque cambia junto (imagen, precio, countdown) al cambiar de oferta,
// así que se maneja como un único cliente en vez de aislar solo los puntos.
export function FlashCarousel({ deals }: { deals: FlashDeal[] }) {
  const [active, setActive] = useState(0);
  const deal = deals[active];
  const pct = Math.round((1 - deal.price / deal.regular) * 100);
  const { d, h, m } = useCountdown(deal.endsAt);

  useEffect(() => {
    if (deals.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % deals.length), 5000);
    return () => clearInterval(id);
  }, [deals.length]);

  return (
    <section className="flash-zone">
      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="wrap pt-10 pb-15">
        <div className="fx-slide relative grid min-h-[380px] grid-cols-[1.05fr_1fr] overflow-hidden rounded-lg max-[760px]:grid-cols-1">
          <div className="stripes z-[1]"></div>
          <div className="fx-gallery relative max-[760px]:min-h-[220px]">
            <Placeholder tint="#3a2a22" label={deal.name} offset={active} media={coverImage(deal.images)} variant="large" style={{ height: "100%" }} />
            <div className="absolute top-[18px] left-[18px] z-[2]">
              <span className={cn(pillBase, pillKindClass.flash)}>−{pct}%</span>
            </div>
          </div>
          <div className="relative z-[2] flex flex-col gap-3 py-10 px-11 text-white max-[760px]:py-7 max-[760px]:px-6">
            <span className={cn(pillBase, pillKindClass.flash)}>
              <Ico.bolt style={{ fontSize: 13 }} /> Oferta Flash
            </span>
            <h3 className="font-display mt-1 text-[clamp(24px,3vw,34px)] font-bold">{deal.name}</h3>
            <p className="m-0 max-w-[40ch] text-[rgba(255,255,255,.85)]">{deal.blurb}</p>
            <div className="font-display flex items-baseline gap-2.5 text-2xl font-extrabold">
              {ars(deal.price)} <s className="text-[15px] font-normal opacity-65">{ars(deal.regular)}</s>
            </div>
            <div>
              <span className="text-[13px] opacity-60">Termina en:</span>{" "}
              <span className="text-[13px] text-[rgba(255,255,255,.6)] [font-variant-numeric:tabular-nums]">
                {d}d {pad(h)}:{pad(m)} restantes
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 4, flexWrap: "wrap" }}>
              <Link href={`/ofertas-flash/${deal.id}`} className={btnBase} style={{ background: "var(--color-flash)", color: "#fff" }}>
                Ver oferta <Ico.arrow />
              </Link>
              {deals.length > 1 && (
                <div className="flex gap-2">
                  {deals.map((d2, i) => (
                    <button
                      key={d2.id}
                      type="button"
                      className={cn(
                        "h-[9px] w-[9px] cursor-pointer rounded-full border-0 p-0",
                        i === active ? "bg-flash" : "bg-[rgba(255,255,255,.25)]",
                      )}
                      onClick={() => setActive(i)}
                      aria-label={`Ver oferta ${d2.name}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
