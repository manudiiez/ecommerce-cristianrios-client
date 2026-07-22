import Link from "next/link";
import type { Kit } from "@/lib/api";
import { Pill } from "@/components/ui/pill";
import { Placeholder } from "@/components/ui/placeholder";
import { coverImage } from "@/lib/images";
import { worldAccent } from "@/lib/pricing";
import { ars } from "@/lib/utils";

export function KitCard({ kit }: { kit: Kit }) {
  const save = kit.regular - kit.price;
  const pct = Math.round((save / kit.regular) * 100);
  const pieces = kit.items.reduce((s, i) => s + i.qty, 0);

  return (
    <Link href={`/kits/${kit.id}`} className="group flex cursor-pointer flex-col gap-3 animate-fade-in">
      <div style={{ position: "relative" }}>
        <Placeholder
          world={kit.world}
          cat={kit.world === "religioso" ? "jesus" : "budas"}
          label="Kit"
          media={coverImage(kit.images)}
          style={{ aspectRatio: "4/5" }}
          className="group-hover:shadow-[var(--shadow-brand)]"
        />
        <div className="absolute top-3 right-3 z-[2] flex flex-col items-end gap-1.5">
          <Pill kind="sale">−{pct}%</Pill>
          {kit.tag && <Pill kind={worldAccent(kit.world)}>{kit.tag}</Pill>}
        </div>
      </div>
      <div className="flex flex-col gap-[3px]">
        <span className="text-[11px] font-semibold tracking-[0.1em] text-ink-soft uppercase">Kit · {pieces} piezas</span>
        <span className="font-display text-lg leading-[1.15] font-medium">{kit.name}</span>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-[13px] text-ink-soft line-through">{ars(kit.regular)}</span>
          <span className="text-base font-bold">{ars(kit.price)}</span>
        </div>
      </div>
    </Link>
  );
}
