import Link from "next/link";
import type { Kit } from "@/lib/api";
import { Pill } from "@/components/ui/pill";
import { Placeholder } from "@/components/ui/placeholder";
import { worldAccent } from "@/lib/pricing";
import { ars } from "@/lib/utils";

export function KitCard({ kit }: { kit: Kit }) {
  const save = kit.regular - kit.price;
  const pct = Math.round((save / kit.regular) * 100);
  const pieces = kit.items.reduce((s, i) => s + i.qty, 0);

  return (
    <Link href={`/kits/${kit.id}`} className="card fade-in">
      <div style={{ position: "relative" }}>
        <Placeholder
          world={kit.world}
          cat={kit.world === "religioso" ? "jesus" : "budas"}
          label="Kit"
          style={{ aspectRatio: "4/5" }}
        />
        <div className="badges">
          <Pill kind="sale">−{pct}%</Pill>
          {kit.tag && <Pill kind={worldAccent(kit.world)}>{kit.tag}</Pill>}
        </div>
      </div>
      <div className="meta">
        <span className="cat-lbl">Kit · {pieces} piezas</span>
        <span className="nm">{kit.name}</span>
        <div className="price-row">
          <span className="price-old">{ars(kit.regular)}</span>
          <span className="price">{ars(kit.price)}</span>
        </div>
      </div>
    </Link>
  );
}
