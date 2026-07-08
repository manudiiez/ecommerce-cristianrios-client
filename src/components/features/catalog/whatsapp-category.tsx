import type { Category, World } from "@/lib/api";
import { Crumb } from "@/components/features/catalog/crumb";
import { Ico } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { waLink } from "@/lib/utils";

const SAMPLES: Record<string, string[]> = {
  sahumerios: ["Sándalo", "Palo Santo", "Lavanda", "Vainilla", "Mirra", "Coco", "Canela", "Ruda"],
  velas: ["Soja natural", "Aromática", "Ritual 7 días", "Decorativa", "Citronela", "Cumpleaños"],
  inciensos: ["Nag Champa", "Sándalo", "Rosa", "Incienso en cono", "Importado", "Sahumo herbal"],
};

export function WhatsappCategory({ category, world }: { category: Category; world: World }) {
  const samples = SAMPLES[category.id] ?? ["Opción 1", "Opción 2", "Opción 3", "Opción 4"];
  const consultaMsg = `¡Hola Hanna! Quería consultar por ${category.name} 🙏\n¿Qué opciones/stock tenés disponible hoy?`;

  return (
    <main className="fade-in" id="main">
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
          <span className="pill pill-wa" style={{ position: "relative" }}>
            <Ico.wa style={{ fontSize: 15 }} /> Solo por WhatsApp
          </span>
          <h1 className="display">{category.name}</h1>
          <p>
            {category.note ||
              "Esta categoría rota mucho de stock. Te atendemos en el momento por WhatsApp para confirmar disponibilidad, fragancias y precios."}
          </p>
          <LinkButton variant="wa" size="lg" href={waLink(consultaMsg)} target="_blank" rel="noreferrer" style={{ position: "relative" }}>
            <Ico.wa style={{ fontSize: 20 }} /> Consultar {category.name} por WhatsApp
          </LinkButton>
        </div>
        <div className="wa-note">
          <Ico.chat style={{ fontSize: 20, color: "#128C4B", flexShrink: 0, marginTop: 2 }} />
          <div>
            <b>¿Por qué no está en el catálogo?</b>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 13.5 }}>
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
          {samples.map((s, i) => (
            <a
              key={i}
              className="wa-tile"
              href={waLink(`¡Hola! Me interesa: ${s} (${category.name}). ¿Tenés stock?`)}
              target="_blank"
              rel="noreferrer"
            >
              <Placeholder world={category.world} cat={category.id} label={s} offset={i} />
              <span className="nm">{s}</span>
              <span className="muted" style={{ fontSize: 12.5, display: "inline-flex", gap: 6, alignItems: "center" }}>
                <Ico.wa style={{ fontSize: 13, color: "#25D366" }} /> Consultar
              </span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
