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
    <div className="countdown">
      {cells.map(([lbl, v]) => (
        <div className="cd-cell" key={lbl}>
          <b>{pad(v)}</b>
          <span>{lbl}</span>
        </div>
      ))}
    </div>
  );
}

export function MiniCountdown({ endsAt }: { endsAt: number }) {
  const { d, h, m } = useCountdown(endsAt);
  return (
    <span className="mini-cd">
      ⏱ {d}d {pad(h)}:{pad(m)} restantes
    </span>
  );
}
