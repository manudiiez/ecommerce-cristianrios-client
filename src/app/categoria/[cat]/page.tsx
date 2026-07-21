import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumb } from "@/components/features/catalog/crumb";
import { ShopCatalog } from "@/components/features/catalog/shop-catalog";
import { WhatsappCategory } from "@/components/features/catalog/whatsapp-category";
import { Pill } from "@/components/ui/pill";
import { Ico } from "@/components/ui/icon";
import { api } from "@/lib/api";
import { worldAccent } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const catChipClass =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface py-[9px] px-[15px] text-[13.5px] font-semibold transition duration-150 hover:border-ink";

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat: catId } = await params;
  const category = await api.catalog.getCategoryById(catId);
  if (!category) notFound();

  const worlds = await api.catalog.getWorlds();
  const w = worlds.find((x) => x.id === category.world)!;

  if (category.mode === "whatsapp") {
    const items = await api.catalog.getWhatsappItems(catId);
    return <WhatsappCategory category={category} world={w} items={items} />;
  }

  const [categories, products, allSizes, finishes, worldSizes] = await Promise.all([
    api.catalog.getCategories(),
    api.products.getAll({ cat: catId }),
    api.catalog.getAllSizes(),
    api.catalog.getFinishes(),
    api.catalog.getSizesForWorld(category.world),
  ]);
  const siblings = categories.filter((x) => x.world === category.world && x.mode === "catalog");
  const accent = worldAccent(category.world);

  return (
    <main className="animate-fade-in" id="main">
      <Crumb
        trail={[
          { label: "Inicio", href: "/" },
          { label: w.name, href: `/${category.world}` },
          { label: category.name },
        ]}
      />

      <div className={"world-band " + category.world}>
        <div className="mx-auto max-w-[1240px] px-7 max-[640px]:px-[18px] cat-banner">
          <span className="kicker" style={{ color: accent === "clay" ? "var(--clay-deep)" : "var(--rose-deep)" }}>
            {w.name}
          </span>
          <h1 className="display">{category.name}</h1>
          {category.discount ? (
            <p>
              <Pill kind="sale">{category.discount.label}</Pill>
              <span style={{ marginLeft: 8 }}>Descuento en toda la categoría.</span>
            </p>
          ) : (
            <p>Disponible en varios tamaños. Precio igual para todas las figuras del mismo tamaño.</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-7 max-[640px]:px-[18px]" style={{ padding: "22px 28px 0" }}>
        <div className="flex flex-wrap gap-[10px]">
          {siblings.map((s) => {
            const active = s.id === catId;
            return (
              <Link
                key={s.id}
                href={`/categoria/${s.id}`}
                className={cn(catChipClass, active && "border-ink bg-ink text-paper")}
              >
                {s.name}{" "}
                <span className={active ? "text-[color-mix(in_oklab,var(--color-paper)_70%,transparent)] font-medium" : "font-medium text-ink-soft"}>
                  {s.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-7 max-[640px]:px-[18px] section" style={{ paddingTop: 26 }}>
        <div className="sec-head" style={{ marginBottom: 16, alignItems: "center" }}>
          <p className="text-ink-soft" style={{ fontSize: 13, margin: 0, display: "inline-flex", gap: 7, alignItems: "center" }}>
            <Ico.ruler style={{ fontSize: 15 }} /> Organizado por tamaño
          </p>
        </div>

        {products.length > 0 ? (
          <ShopCatalog
            products={products}
            world={category.world}
            worldSizes={worldSizes}
            allSizes={allSizes}
            finishes={finishes}
            categories={categories}
          />
        ) : (
          <div className="px-5 py-20 text-center">
            <div className="mx-auto mb-5 flex h-[88px] w-[88px] rotate-[-4deg] items-center justify-center rounded-full border-[1.5px] border-line-strong font-script text-[46px] text-ink-soft">
              ∅
            </div>
            <p className="text-ink-soft">Pronto cargamos productos en esta categoría.</p>
          </div>
        )}
      </div>
    </main>
  );
}
