"use client";

import { useRouter } from "next/navigation";
import type { FlashDeal } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { useCountdown } from "@/hooks/use-countdown";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function FlashFab({ deal, onClose }: { deal: FlashDeal; onClose: () => void }) {
  const router = useRouter();
  const cd = useCountdown(deal.endsAt);

  return (
    <button
      className="flash-fab fixed bottom-[22px] right-[22px] z-[70] flex max-w-[280px] cursor-pointer animate-fab-in items-center gap-3 rounded-2xl border-0 py-3 px-4 text-left text-white shadow-[0_14px_34px_-10px_rgba(216,53,46,.7)] hover:brightness-105 max-[560px]:right-3.5 max-[560px]:left-3.5 max-[560px]:bottom-3.5 max-[560px]:max-w-none"
      onClick={() => router.push("/ofertas-flash")}
    >
      <span
        className="absolute -top-2 -right-2 flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border-2 border-paper bg-ink text-xs text-white"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,0,0,.22)] text-[22px]">
        <Ico.bolt />
      </span>
      <span className="leading-[1.2]">
        <small className="block text-[10px] font-bold tracking-[0.12em] uppercase opacity-85">⚡ Oferta Flash</small>
        <b className="font-display text-sm font-bold">{deal.name}</b>
        <span className="block text-[11.5px] font-bold opacity-95 [font-variant-numeric:tabular-nums]">
          Termina en {cd.d}d {pad(cd.h)}:{pad(cd.m)}:{pad(cd.s)}
        </span>
      </span>
    </button>
  );
}
