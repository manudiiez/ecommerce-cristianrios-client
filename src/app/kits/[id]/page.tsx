import { notFound } from "next/navigation";
import { Crumb } from "@/components/features/catalog/crumb";
import { AddKitActions } from "@/components/features/cart/add-kit-actions";
import { Ico } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { api } from "@/lib/api";
import { ars, waLink } from "@/lib/utils";

export default async function KitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kit = await api.kits.getById(id);
  if (!kit) notFound();

  const worlds = await api.catalog.getWorlds();
  const w = worlds.find((x) => x.id === kit.world)!;
  const save = kit.regular - kit.price;
  const pct = Math.round((save / kit.regular) * 100);
  const totalPieces = kit.items.reduce((s, i) => s + i.qty, 0);
  const collageCats = kit.world === "religioso" ? ["jesus", "virgen", "santos"] : ["budas", "elefantes", "hornillos"];

  return (
    <main className="fade-in" id="main">
      <Crumb
        trail={[
          { label: "Inicio", href: "/" },
          { label: "Kits y combos", href: "/kits" },
          { label: kit.name },
        ]}
      />
      <div className="wrap kit-hero">
        <div>
          <div className="kit-collage">
            {collageCats.map((cat, i) => (
              <Placeholder key={cat} world={kit.world} cat={cat} label={i === 0 ? "Kit" : ""} offset={i} />
            ))}
          </div>
        </div>
        <div>
          <span className="kicker" style={{ color: kit.world === "religioso" ? "var(--clay-deep)" : "var(--rose-deep)" }}>
            Kit · {w.name}
          </span>
          <h1 className="display" style={{ margin: "8px 0" }}>
            {kit.name}
          </h1>
          <p className="muted" style={{ fontSize: 16, maxWidth: "42ch" }}>
            {kit.blurb}
          </p>

          <div className="kit-items">
            {kit.items.map((it, i) => (
              <div className="kit-item" key={i}>
                <Placeholder
                  world={kit.world}
                  cat={collageCats[0]}
                  label={it.name}
                  offset={i}
                  style={{ width: 64, height: 64, borderRadius: "var(--radius)", flexShrink: 0 }}
                />
                <div>
                  <b style={{ fontWeight: 600 }}>{it.name}</b>
                </div>
                <span className="qb">×{it.qty}</span>
              </div>
            ))}
          </div>

          <div className="kit-price-box">
            <div className="pl">
              <span>Comprado por separado (aprox.)</span>
              <span style={{ textDecoration: "line-through" }}>{ars(kit.regular)}</span>
            </div>
            <div className="pl" style={{ color: "var(--flash)", fontWeight: 700 }}>
              <span>Ahorro del combo</span>
              <span>
                − {ars(save)} ({pct}%)
              </span>
            </div>
            <div className="pl total">
              <span>Precio del kit</span>
              <b>{ars(kit.price)}</b>
            </div>
            {kit.note && (
              <div className="cart-note" style={{ marginBottom: 0 }}>
                <Ico.spark style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }} /> {kit.note}
              </div>
            )}
            <AddKitActions kit={kit} totalPieces={totalPieces} />
            <LinkButton
              variant="wa"
              block
              style={{ marginTop: 10 }}
              href={waLink(`¡Hola! Me interesa el ${kit.name} (${totalPieces} piezas) a ${ars(kit.price)}. ¿Coordinamos?`)}
              target="_blank"
              rel="noreferrer"
            >
              <Ico.wa style={{ fontSize: 18 }} /> Consultar este kit
            </LinkButton>
          </div>
        </div>
      </div>
    </main>
  );
}
