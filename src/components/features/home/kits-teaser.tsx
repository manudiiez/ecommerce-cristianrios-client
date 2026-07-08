import Link from "next/link";
import type { Kit } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { KitCard } from "@/components/features/catalog/kit-card";

export function KitsTeaser({ kits }: { kits: Kit[] }) {
  return (
    <section className="section" style={{ paddingTop: 10 }}>
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="kicker">Combos a precio menor</span>
            <h2>Kits para regalar y revender</h2>
          </div>
          <Link href="/kits" className="link">
            Ver todos los kits <Ico.arrow />
          </Link>
        </div>
        <div className="grid grid-3">
          {kits.map((k) => (
            <KitCard key={k.id} kit={k} />
          ))}
        </div>
      </div>
    </section>
  );
}
