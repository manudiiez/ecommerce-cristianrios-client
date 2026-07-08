import type { ReactNode } from "react";

type PillKind = "clay" | "rose" | "sale" | "wa" | "flash" | "outline";

export function Pill({ kind, children }: { kind: PillKind; children: ReactNode }) {
  return <span className={`pill pill-${kind}`}>{children}</span>;
}
