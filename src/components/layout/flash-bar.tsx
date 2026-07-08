"use client";

import { useRouter } from "next/navigation";
import type { FlashDeal } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { useCountdown } from "@/hooks/use-countdown";
import { ars } from "@/lib/utils";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function FlashBar({ deal, onClose }: { deal: FlashDeal; onClose: () => void }) {
  const router = useRouter();
  const cd = useCountdown(deal.endsAt);
  const pct = Math.round((1 - deal.price / deal.regular) * 100);

  return (
    <div className="flashbar" onClick={() => router.push("/ofertas-flash")}>
      <div className="stripes"></div>
      <div className="wrap flashbar-row">
        <span className="fb-bolt">
          <Ico.bolt style={{ fontSize: 13 }} /> Oferta Flash
        </span>
        <span className="fb-text">
          <b>{deal.name}</b> · −{pct}% · {ars(deal.price)} <s>{ars(deal.regular)}</s> — {deal.kicker.toLowerCase()}
        </span>
        <div className="fb-cd" aria-label="termina en">
          <span style={{ fontSize: 11, opacity: 0.85, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>
            Termina en
          </span>
          <span className="mini-cell">{pad(cd.d)}d</span>
          <span className="mini-cell">{pad(cd.h)}</span>
          <span className="mini-cell">{pad(cd.m)}</span>
          <span className="mini-cell">{pad(cd.s)}</span>
        </div>
        <button
          className="fb-cta"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/ofertas-flash");
          }}
        >
          Ver oferta
        </button>
        <button
          className="fb-close"
          aria-label="cerrar"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
