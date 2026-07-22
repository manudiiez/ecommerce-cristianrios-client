import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PillKind = "clay" | "rose" | "sale" | "wa" | "flash" | "outline";

export const pillBase =
  "inline-flex items-center gap-1.5 rounded-full py-[5px] px-[11px] text-[11px] font-bold tracking-[0.04em] uppercase whitespace-nowrap";

export const pillKindClass: Record<PillKind, string> = {
  clay: "bg-clay-soft text-clay-deep",
  rose: "bg-rose-soft text-rose-deep",
  sale: "bg-ink text-paper",
  wa: "bg-whatsapp-soft text-whatsapp-soft-ink",
  flash: "bg-flash text-flash-ink",
  outline: "bg-transparent border border-line-strong text-ink-soft",
};

export function Pill({ kind, children }: { kind: PillKind; children: ReactNode }) {
  return <span className={cn(pillBase, pillKindClass[kind])}>{children}</span>;
}
