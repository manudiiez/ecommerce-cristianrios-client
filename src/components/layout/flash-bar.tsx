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

  const miniCellClass =
    "min-w-[30px] rounded-[5px] bg-[rgba(0,0,0,.28)] py-1 px-[7px] text-center text-sm max-[720px]:min-w-[26px] max-[720px]:px-1.5 max-[720px]:text-[12.5px]";

  return (
    <div className="flashbar relative z-[60] overflow-hidden text-white" onClick={() => router.push("/ofertas-flash")}>
      <div className="stripes pointer-events-none opacity-[0.16]"></div>
      <div className="wrap relative flex min-h-[50px] flex-wrap items-center gap-4 py-2 max-[720px]:flex-nowrap">
        <span className="inline-flex animate-pulse-glow items-center gap-[7px] rounded-full bg-[rgba(0,0,0,.22)] py-1.5 px-[11px] text-[11.5px] font-extrabold tracking-[0.12em] whitespace-nowrap uppercase max-[720px]:hidden">
          <Ico.bolt style={{ fontSize: 13 }} /> Oferta Flash
        </span>
        <span className="text-sm font-semibold max-[720px]:hidden">
          <b className="font-display font-bold">{deal.name}</b> · −{pct}% · {ars(deal.price)}{" "}
          <s className="ml-1 font-normal opacity-70">{ars(deal.regular)}</s> — {deal.kicker.toLowerCase()}
        </span>
        <span className="hidden max-[720px]:block max-[720px]:min-w-0 max-[720px]:flex-1 max-[720px]:overflow-hidden max-[720px]:text-[13px] max-[720px]:text-ellipsis max-[720px]:whitespace-nowrap">
          <b className="font-display font-bold">{deal.name}</b>
        </span>
        <div
          className="ml-auto flex items-center gap-2 font-bold [font-variant-numeric:tabular-nums] max-[720px]:ml-0 max-[720px]:gap-1.5"
          aria-label="termina en"
        >
          <span
            className="max-[720px]:hidden"
            style={{ fontSize: 11, opacity: 0.85, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}
          >
            Termina en
          </span>
          <span className={miniCellClass}>{pad(cd.d)}d</span>
          <span className={miniCellClass}>{pad(cd.h)}</span>
          <span className={miniCellClass}>{pad(cd.m)}</span>
          <span className={miniCellClass}>{pad(cd.s)}</span>
        </div>
        <button
          className="cursor-pointer rounded-full border-0 bg-white py-2 px-4 text-[13px] font-extrabold whitespace-nowrap text-[#b8210f] max-[720px]:hidden"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/ofertas-flash");
          }}
        >
          Ver oferta
        </button>
        <button
          className="cursor-pointer border-0 bg-transparent py-1 px-2 text-lg leading-none text-[rgba(255,255,255,.8)] hover:text-white"
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
