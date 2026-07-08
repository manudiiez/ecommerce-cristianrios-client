import Link from "next/link";
import type { Category } from "@/lib/api";
import { Ico } from "@/components/ui/icon";

export function WaTeaser({ categories }: { categories: Category[] }) {
  const wa = categories.filter((c) => c.mode === "whatsapp");
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="kicker">Solo por WhatsApp</span>
            <h2>Sahumerios, velas e inciensos</h2>
          </div>
        </div>
        <p className="muted" style={{ maxWidth: "60ch", marginTop: -12, marginBottom: 24 }}>
          Estas categorías rotan mucho de stock, así que las atendemos personalmente. Consultá
          disponibilidad y fragancias del día por WhatsApp.
        </p>
        <div className="cat-chips">
          {wa.map((c) => (
            <Link key={c.id} href={`/categoria/${c.id}`} className="cat-chip wa">
              <Ico.wa style={{ fontSize: 16, color: "#25D366" }} /> {c.name} <span className="n">· consultar</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
