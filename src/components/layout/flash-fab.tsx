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
    <button className="flash-fab" onClick={() => router.push("/ofertas-flash")}>
      <span
        className="fab-x"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </span>
      <span className="fab-ico">
        <Ico.bolt />
      </span>
      <span className="fab-body">
        <small>⚡ Oferta Flash</small>
        <b>{deal.name}</b>
        <span className="fab-cd">
          Termina en {cd.d}d {pad(cd.h)}:{pad(cd.m)}:{pad(cd.s)}
        </span>
      </span>
    </button>
  );
}
