import type { Category, Store, WhatsAppItem, World } from "@/lib/api";
import { Crumb } from "@/components/features/catalog/crumb";
import { Ico } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { pillBase, pillKindClass } from "@/components/ui/pill";
import { cn, waLink } from "@/lib/utils";

export function WhatsappCategory({
  category,
  world,
  items,
  store,
}: {
  category: Category;
  world: World;
  items: WhatsAppItem[];
  store: Store;
}) {
  const consultaMsg = `¡Hola ${store.name}! Quería consultar por ${category.name} 🙏\n¿Qué opciones/stock tenés disponible hoy?`;

  return (
    <main className="animate-fade-in" id="main">
      <Crumb
        trail={[
          { label: "Inicio", href: "/" },
          { label: world.name, href: `/${world.id}` },
          { label: category.name },
        ]}
      />
      <div className="wrap">
        <div className="wa-hero">
          <div className="tex"></div>
          <span className={cn(pillBase, pillKindClass.wa)} style={{ position: "relative" }}>
            <Ico.wa style={{ fontSize: 15 }} /> Solo por WhatsApp
          </span>
          <h1 className="display">{category.name}</h1>
          <p>
            {category.note ||
              "Esta categoría rota mucho de stock. Te atendemos en el momento por WhatsApp para confirmar disponibilidad, fragancias y precios."}
          </p>
          <LinkButton
            variant="wa"
            size="lg"
            href={waLink(store.whatsapp, consultaMsg)}
            target="_blank"
            rel="noreferrer"
            style={{ position: "relative" }}
          >
            <Ico.wa style={{ fontSize: 20 }} /> Consultar {category.name} por WhatsApp
          </LinkButton>
        </div>
        <div className="wa-note">
          <Ico.chat style={{ fontSize: 20, color: "#128C4B", flexShrink: 0, marginTop: 2 }} />
          <div>
            <b>¿Por qué no está en el catálogo?</b>
            <p className="text-ink-soft" style={{ margin: "4px 0 0", fontSize: 13.5 }}>
              Los aromáticos cambian seguido y muchos van por encargo. Para no mostrarte algo sin stock,
              preferimos confirmarte todo al instante por chat.
            </p>
          </div>
        </div>
        <div className="sec-head" style={{ marginTop: 10 }}>
          <div>
            <span className="kicker">Algunas opciones</span>
            <h2 style={{ fontSize: 30 }}>Lo que solemos tener</h2>
          </div>
        </div>
        <div className="wa-gallery" style={{ marginBottom: 40 }}>
          {items.map((item, i) => (
            <a
              key={item.id}
              className="wa-tile"
              href={waLink(store.whatsapp, item.waMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <Placeholder world={category.world} cat={category.id} label={item.name} offset={i} media={item.image} />
              <span className="nm">{item.name}</span>
              <span className="text-ink-soft" style={{ fontSize: 12, display: "block" }}>
                {item.blurb}
              </span>
              <span className="text-ink-soft" style={{ fontSize: 12.5, display: "inline-flex", gap: 6, alignItems: "center" }}>
                <Ico.wa style={{ fontSize: 13, color: "#25D366" }} /> Consultar
              </span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
