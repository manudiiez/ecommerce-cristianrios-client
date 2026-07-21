import { Crumb } from "@/components/features/catalog/crumb";
import { Ico, type IconName } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/button";
import { pillBase, pillKindClass } from "@/components/ui/pill";
import { api } from "@/lib/api";
import { cn, mailLink, waLink } from "@/lib/utils";

const STEPS: { ic: IconName; t: string; d: string }[] = [
  {
    ic: "heart",
    t: "Elegí y sumá",
    d: "Recorré el catálogo, elegí tamaño y terminación, y agregá al pedido. Sin pagar nada todavía.",
  },
  {
    ic: "check",
    t: "Confirmá el pedido",
    d: "Dejá tus datos y confirmá. El pedido le llega al instante al equipo de Hanna con todo el detalle.",
  },
  {
    ic: "chat",
    t: "Te contactamos",
    d: "Nos comunicamos por WhatsApp o email para confirmar stock y el precio final (mayorista si aplica).",
  },
  { ic: "truck", t: "Pago y envío", d: "Coordinamos la forma de pago y el envío a tu zona o el retiro. ¡Listo!" },
];

export default async function ContactoPage() {
  const store = await api.store.get();

  return (
    <main className="animate-fade-in" id="main">
      <Crumb trail={[{ label: "Inicio", href: "/" }, { label: "Cómo comprar" }]} />
      <div className="wrap cat-banner">
        <span className="kicker">Sin pago online</span>
        <h1 className="display">Cómo comprar</h1>
        <p>
          En Hanna no se paga por la web: confirmás el pedido y el equipo te contacta de forma personal por
          WhatsApp o email para coordinar todo.
        </p>
      </div>
      <div className="wrap section" style={{ paddingTop: 30 }}>
        <div className="grid grid-4">
          {STEPS.map((s, i) => {
            const I = Ico[s.ic];
            return (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-lg)",
                  padding: 24,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      background: "var(--paper-2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    <I />
                  </span>
                  <span style={{ fontFamily: "var(--font-script)", fontSize: 30, color: "var(--ink-soft)" }}>{i + 1}</span>
                </div>
                <h3 className="display" style={{ fontSize: 21, margin: "0 0 6px" }}>
                  {s.t}
                </h3>
                <p className="text-ink-soft" style={{ fontSize: 14, margin: 0 }}>
                  {s.d}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 40 }} className="contact-cards">
          <div className="wa-hero" style={{ margin: 0 }}>
            <div className="tex"></div>
            <span className={cn(pillBase, pillKindClass.wa)} style={{ position: "relative" }}>
              <Ico.wa style={{ fontSize: 15 }} /> Lo más rápido
            </span>
            <h2 className="display" style={{ fontSize: 30, margin: "10px 0", color: "#fff" }}>
              Escribinos por WhatsApp
            </h2>
            <p style={{ position: "relative" }}>{store.whatsappDisplay} · respondemos en el día.</p>
            <LinkButton
              variant="wa"
              size="lg"
              style={{ position: "relative" }}
              href={waLink("¡Hola Hanna! Quería hacer una consulta 🙂")}
              target="_blank"
              rel="noreferrer"
            >
              <Ico.wa style={{ fontSize: 20 }} /> Abrir WhatsApp
            </LinkButton>
          </div>
          <div
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              borderRadius: "var(--radius-lg)",
              padding: 46,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span className="kicker" style={{ color: "var(--rose)" }}>
              También
            </span>
            <h2 className="display" style={{ fontSize: 30, margin: "10px 0", color: "var(--paper)" }}>
              Por email o Instagram
            </h2>
            <p style={{ opacity: 0.85, margin: "0 0 8px" }}>{store.email}</p>
            <p style={{ opacity: 0.85, margin: "0 0 20px" }}>{store.instagram}</p>
            <LinkButton
              variant="ghost"
              style={{ borderColor: "rgba(255,255,255,.3)", color: "var(--paper)", alignSelf: "flex-start" }}
              href={mailLink("Consulta", "Hola Hanna,")}
            >
              <Ico.mail style={{ fontSize: 18 }} /> Escribir email
            </LinkButton>
          </div>
        </div>
      </div>
    </main>
  );
}
