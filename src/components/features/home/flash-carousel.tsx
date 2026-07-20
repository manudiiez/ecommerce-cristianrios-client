"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FlashDeal } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { Placeholder } from "@/components/ui/placeholder";
import { useCountdown } from "@/hooks/use-countdown";
import { coverImage } from "@/lib/images";
import { ars } from "@/lib/utils";

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
    <section className="flash-zone flash-carousel">
      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="wrap">
        <div className="fx-slide">
          <div className="stripes"></div>
          <div className="fx-gallery">
            <Placeholder tint="#3a2a22" label={deal.name} offset={active} media={coverImage(deal.images)} variant="large" style={{ height: "100%" }} />
            <div className="fx-badge">
              <span className="pill pill-flash">−{pct}%</span>
            </div>
          </div>
          <div className="fx-info">
            <span className="pill pill-flash">
              <Ico.bolt style={{ fontSize: 13 }} /> Oferta Flash
            </span>
            <h3>{deal.name}</h3>
            <p>{deal.blurb}</p>
            <div className="fx-price">
              {ars(deal.price)} <s>{ars(deal.regular)}</s>
            </div>
            <div>
              <span className="fx-ends-lbl">Termina en:</span>{" "}
              <span className="fx-ends-val">
                {d}d {pad(h)}:{pad(m)} restantes
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 4, flexWrap: "wrap" }}>
              <Link href={`/ofertas-flash/${deal.id}`} className="btn" style={{ background: "var(--flash)", color: "#fff" }}>
                Ver oferta <Ico.arrow />
              </Link>
              {deals.length > 1 && (
                <div className="fx-dots">
                  {deals.map((d2, i) => (
                    <button
                      key={d2.id}
                      type="button"
                      className={"fx-dot " + (i === active ? "active" : "")}
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
