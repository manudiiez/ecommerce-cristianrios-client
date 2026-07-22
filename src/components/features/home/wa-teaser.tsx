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
        <p className="text-ink-soft" style={{ maxWidth: "60ch", marginTop: -12, marginBottom: 24 }}>
          Estas categorías rotan mucho de stock, así que las atendemos personalmente. Consultá
          disponibilidad y fragancias del día por WhatsApp.
        </p>
        <div className="flex flex-wrap gap-[10px]">
          {wa.map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.id}`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-line-strong bg-surface py-[9px] px-[15px] text-[13.5px] font-semibold transition duration-150 hover:border-ink"
            >
              <Ico.wa style={{ fontSize: 16, color: "#25D366" }} /> {c.name}{" "}
              <span className="font-medium text-ink-soft">· consultar</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
