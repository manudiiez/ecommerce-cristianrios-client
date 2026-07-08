import { Crumb } from "@/components/features/catalog/crumb";
import { KitCard } from "@/components/features/catalog/kit-card";
import { api } from "@/lib/api";

export default async function KitsPage() {
  const kits = await api.kits.getAll();

  return (
    <main className="fade-in" id="main">
      <Crumb trail={[{ label: "Inicio", href: "/" }, { label: "Kits y combos" }]} />
      <div className="wrap cat-banner">
        <span className="kicker">Combos a precio menor</span>
        <h1 className="display">Kits y combos</h1>
        <p>Conjuntos armados de figuras a un precio especial. Ideales para revender o para regalar completo.</p>
      </div>
      <div className="wrap section" style={{ paddingTop: 30 }}>
        <div className="grid grid-3">
          {kits.map((k) => (
            <KitCard key={k.id} kit={k} />
          ))}
        </div>
      </div>
    </main>
  );
}
