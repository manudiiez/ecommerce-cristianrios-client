import Link from "next/link";
import { notFound } from "next/navigation";
import type { WorldId } from "@/lib/api";
import { Crumb } from "@/components/features/catalog/crumb";
import { ShopCatalog } from "@/components/features/catalog/shop-catalog";
import { Ico } from "@/components/ui/icon";
import { api } from "@/lib/api";
import { worldAccent } from "@/lib/pricing";

const WORLD_IDS: WorldId[] = ["religioso", "holistico"];

export function generateStaticParams() {
  return WORLD_IDS.map((world) => ({ world }));
}

export default async function WorldPage({ params }: { params: Promise<{ world: string }> }) {
  const { world: worldParam } = await params;
  if (!WORLD_IDS.includes(worldParam as WorldId)) notFound();
  const world = worldParam as WorldId;

  const [worlds, categories, products, allSizes, finishes] = await Promise.all([
    api.catalog.getWorlds(),
    api.catalog.getCategories(),
    api.products.getAll({ world }),
    api.catalog.getAllSizes(),
    api.catalog.getFinishes(),
  ]);

  const w = worlds.find((x) => x.id === world)!;
  const cats = categories.filter((c) => c.world === world);
  const catalogCats = cats.filter((c) => c.mode === "catalog");
  const waCats = cats.filter((c) => c.mode === "whatsapp");
  const sizes = await api.catalog.getSizesForWorld(world);
  const accent = worldAccent(world);

  return (
    <main className="fade-in" id="main">
      <Crumb trail={[{ label: "Inicio", href: "/" }, { label: w.name }]} />

      <div className={"world-band " + world}>
        <div className="wrap cat-banner">
          <span className="kicker" style={{ color: accent === "clay" ? "var(--clay-deep)" : "var(--rose-deep)" }}>
            {w.kicker}
          </span>
          <h1 className="display">{w.name}</h1>
          <p>{w.blurb}</p>
        </div>
      </div>

      <div className="wrap section" style={{ paddingTop: 28 }}>
        <ShopCatalog
          products={products}
          world={world}
          worldSizes={sizes}
          allSizes={allSizes}
          finishes={finishes}
          categories={categories}
          worldCats={catalogCats}
        />

        {waCats.length > 0 && (
          <div style={{ marginTop: 56, paddingTop: 36, borderTop: "1px solid var(--line)" }}>
            <div className="sec-head" style={{ marginBottom: 18 }}>
              <div>
                <span className="kicker">Solo por WhatsApp</span>
                <h2 style={{ fontSize: 26, margin: "4px 0 0" }}>Aromáticos y más</h2>
              </div>
            </div>
            <div className="cat-chips">
              {waCats.map((c) => (
                <Link key={c.id} href={`/categoria/${c.id}`} className="cat-chip wa">
                  <Ico.wa style={{ fontSize: 16, color: "#25D366" }} /> {c.name}{" "}
                  <span className="n">· {c.count}+ opciones</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
