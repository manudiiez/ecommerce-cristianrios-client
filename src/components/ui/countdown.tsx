"use client";

import { useCountdown } from "@/hooks/use-countdown";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown({ endsAt }: { endsAt: number }) {
  const { d, h, m, s } = useCountdown(endsAt);
  const cells: [string, number][] = [
    ["Días", d],
    ["Hs", h],
    ["Min", m],
    ["Seg", s],
  ];
  return (
    <div className="flex gap-2.5">
      {cells.map(([lbl, v]) => (
        <div
          className="min-w-16 rounded border border-[rgba(255,255,255,.18)] bg-[rgba(0,0,0,.28)] py-3 px-1.5 text-center"
          key={lbl}
        >
          <b className="font-display block text-[32px] leading-none font-bold [font-variant-numeric:tabular-nums]">{pad(v)}</b>
          <span className="text-[10px] tracking-[0.14em] uppercase opacity-75">{lbl}</span>
        </div>
      ))}
    </div>
  );
}

export function MiniCountdown({ endsAt }: { endsAt: number }) {
  const { d, h, m } = useCountdown(endsAt);
  return (
    <span className="text-[11.5px] font-bold [font-variant-numeric:tabular-nums]" style={{ color: "var(--color-flash)" }}>
      ⏱ {d}d {pad(h)}:{pad(m)} restantes
    </span>
  );
}
