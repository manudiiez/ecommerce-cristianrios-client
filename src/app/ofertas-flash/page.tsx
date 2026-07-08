import { Countdown } from "@/components/ui/countdown";
import { Ico } from "@/components/ui/icon";
import { FlashCard } from "@/components/features/flash/flash-card";
import { api } from "@/lib/api";
import { ars } from "@/lib/utils";

export default async function FlashPage() {
  const deals = await api.flash.getAll();
  const feat = deals[0];

  return (
    <main className="flash-zone fade-in" id="main">
      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="flash-head wrap">
        <span className="bolt">
          <Ico.bolt /> Ofertas Flash · por tiempo limitado
        </span>
        <h2 className="display">
          Hoy en la tienda,
          <br />
          <em>mañana no.</em>
        </h2>
        <p>
          Productos invitados que pasan por Hanna por unos días. Ediciones especiales, ajenas al catálogo
          habitual. Cuando se agota el tiempo o el stock, desaparecen.
        </p>
      </div>

      <div className="wrap" style={{ position: "relative" }}>
        {feat && (
          <div className="flash-banner">
            <div className="stripes"></div>
            <div style={{ position: "relative" }}>
              <span className="pill" style={{ background: "rgba(0,0,0,.28)", color: "#fff" }}>
                <Ico.bolt style={{ fontSize: 12 }} /> Destacado de la semana
              </span>
              <h3>{feat.name}</h3>
              <p>{feat.blurb}</p>
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 26, fontFamily: "var(--font-display)" }}>
                  {ars(feat.price)}
                </span>
                <s style={{ color: "rgba(255,255,255,.7)" }}>{ars(feat.regular)}</s>
                <span className="pill pill-flash" style={{ background: "rgba(0,0,0,.3)" }}>
                  −{Math.round((1 - feat.price / feat.regular) * 100)}%
                </span>
              </div>
            </div>
            <Countdown endsAt={feat.endsAt} />
          </div>
        )}

        <div className="flash-grid">
          {deals.map((f) => (
            <FlashCard key={f.id} deal={f} />
          ))}
        </div>
      </div>
    </main>
  );
}
