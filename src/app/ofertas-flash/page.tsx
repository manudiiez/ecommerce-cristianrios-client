import { Countdown } from "@/components/ui/countdown";
import { Ico } from "@/components/ui/icon";
import { FlashCard } from "@/components/features/flash/flash-card";
import { pillBase, pillKindClass } from "@/components/ui/pill";
import { api } from "@/lib/api";
import { ars, cn } from "@/lib/utils";

export default async function FlashPage() {
  const deals = await api.flash.getAll();
  const feat = deals[0];

  return (
    <main className="flash-zone animate-fade-in" id="main">
      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="wrap relative pt-16 pb-2.5 text-center">
        <span className="inline-flex items-center gap-[9px] rounded-full bg-flash py-2 px-4 text-xs font-extrabold tracking-[0.12em] text-flash-ink uppercase">
          <Ico.bolt /> Ofertas Flash · por tiempo limitado
        </span>
        <h2 className="display mt-[18px] mb-2 text-[clamp(40px,7vw,82px)] leading-[0.95]">
          Hoy en la tienda,
          <br />
          <em className="italic" style={{ color: "var(--color-flash)" }}>
            mañana no.
          </em>
        </h2>
        <p className="mx-auto max-w-[50ch] text-base text-[rgba(255,255,255,.7)]">
          Productos invitados que pasan por Hanna por unos días. Ediciones especiales, ajenas al catálogo
          habitual. Cuando se agota el tiempo o el stock, desaparecen.
        </p>
      </div>

      <div className="wrap" style={{ position: "relative" }}>
        {feat && (
          <div className="flash-banner relative my-[30px] grid grid-cols-[1fr_auto] items-center gap-7 overflow-hidden rounded-lg py-10 px-11 max-[700px]:grid-cols-1">
            <div className="stripes"></div>
            <div style={{ position: "relative" }}>
              <span className={pillBase} style={{ background: "rgba(0,0,0,.28)", color: "#fff" }}>
                <Ico.bolt style={{ fontSize: 12 }} /> Destacado de la semana
              </span>
              <h3 className="font-display relative my-2 text-[clamp(26px,3.4vw,40px)] font-bold text-white">{feat.name}</h3>
              <p className="relative m-0 max-w-[44ch] text-[rgba(255,255,255,.88)]">{feat.blurb}</p>
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 26, fontFamily: "var(--font-display)" }}>
                  {ars(feat.price)}
                </span>
                <s style={{ color: "rgba(255,255,255,.7)" }}>{ars(feat.regular)}</s>
                <span className={cn(pillBase, pillKindClass.flash)} style={{ background: "rgba(0,0,0,.3)" }}>
                  −{Math.round((1 - feat.price / feat.regular) * 100)}%
                </span>
              </div>
            </div>
            <Countdown endsAt={feat.endsAt} />
          </div>
        )}

        <div className="relative grid grid-cols-3 gap-5 pb-[70px] max-[820px]:grid-cols-1">
          {deals.map((f) => (
            <FlashCard key={f.id} deal={f} />
          ))}
        </div>
      </div>
    </main>
  );
}
