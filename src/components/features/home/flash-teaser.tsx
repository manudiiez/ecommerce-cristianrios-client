import Link from "next/link";
import type { FlashDeal } from "@/lib/api";
import { Countdown } from "@/components/ui/countdown";
import { Ico } from "@/components/ui/icon";
import { ars } from "@/lib/utils";

export function FlashTeaser({ deal }: { deal: FlashDeal }) {
  return (
    <section className="flash-zone">
      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="wrap" style={{ position: "relative", padding: "60px 28px" }}>
        <div className="flash-banner">
          <div className="stripes"></div>
          <div style={{ position: "relative" }}>
            <span className="pill" style={{ background: "rgba(0,0,0,.25)", color: "#fff" }}>
              <Ico.bolt style={{ fontSize: 13 }} /> {deal.kicker}
            </span>
            <h3>{deal.name}</h3>
            <p>{deal.blurb}</p>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 18, flexWrap: "wrap" }}>
              <Link href="/ofertas-flash" className="btn" style={{ background: "#fff", color: "#b8210f" }}>
                Ver Ofertas Flash <Ico.arrow />
              </Link>
              <span style={{ color: "#fff", fontWeight: 700 }}>
                Solo {ars(deal.price)} <s style={{ opacity: 0.7, fontWeight: 400 }}>{ars(deal.regular)}</s>
              </span>
            </div>
          </div>
          <Countdown endsAt={deal.endsAt} />
        </div>
        <p style={{ color: "rgba(255,255,255,.6)", textAlign: "center", marginTop: 6, fontSize: 13.5 }}>
          Productos invitados por tiempo limitado. Cuando se va la fecha, se va de la tienda.
        </p>
      </div>
    </section>
  );
}
