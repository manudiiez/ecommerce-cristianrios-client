import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumb } from "@/components/features/catalog/crumb";
import { AddKitActions } from "@/components/features/cart/add-kit-actions";
import { KitGallery } from "@/components/features/kits/kit-gallery";
import { Ico } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { api } from "@/lib/api";
import { coverImage } from "@/lib/images";
import { ars, cn, waLink } from "@/lib/utils";

export default async function KitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kit = await api.kits.getById(id);
  if (!kit) notFound();

  const [worlds, allSizes, finishes, itemProducts] = await Promise.all([
    api.catalog.getWorlds(),
    api.catalog.getAllSizes(),
    api.catalog.getFinishes(),
    Promise.all(kit.items.map((it) => (it.productId ? api.products.getById(it.productId) : null))),
  ]);
  const w = worlds.find((x) => x.id === kit.world)!;
  const save = kit.regular - kit.price;
  const pct = Math.round((save / kit.regular) * 100);
  const totalPieces = kit.items.reduce((s, i) => s + i.qty, 0);
  const collageCats = kit.world === "religioso" ? ["jesus", "virgen", "santos"] : ["budas", "elefantes", "hornillos"];

  return (
    <main className="animate-fade-in" id="main">
      <Crumb
        trail={[
          { label: "Inicio", href: "/" },
          { label: "Kits y combos", href: "/kits" },
          { label: kit.name },
        ]}
      />
      <div className="wrap grid grid-cols-[1.1fr_1fr] items-center gap-11 py-[26px] max-[880px]:grid-cols-1">
        <div>
          <KitGallery world={kit.world} collageCats={collageCats} images={kit.images} />
        </div>
        <div>
          <span className="kicker" style={{ color: kit.world === "religioso" ? "var(--color-clay-deep)" : "var(--color-rose-deep)" }}>
            Kit · {w.name}
          </span>
          <h1 className="display" style={{ margin: "8px 0" }}>
            {kit.name}
          </h1>
          <p className="text-ink-soft" style={{ fontSize: 16, maxWidth: "42ch" }}>
            {kit.blurb}
          </p>

          <div className="my-[22px] flex flex-col gap-3">
            {kit.items.map((it, i) => {
              const product = itemProducts[i];
              const size = it.sizeId ? allSizes[it.sizeId] : undefined;
              const finish = it.finishId ? finishes[it.finishId] : undefined;
              const itemClass = "flex items-center gap-4 rounded-lg border border-line bg-surface py-3 px-3.5";

              const content = (
                <>
                  <Placeholder
                    world={product?.world ?? kit.world}
                    cat={product?.cat ?? collageCats[0]}
                    label={it.name}
                    offset={i}
                    media={product ? coverImage(product.images) : undefined}
                    style={{ width: 64, height: 64, borderRadius: "var(--radius)", flexShrink: 0 }}
                  />
                  <div>
                    <b style={{ fontWeight: 600 }}>{it.name}</b>
                    {(size || finish) && (
                      <div className="mt-0.5 text-[13px] text-ink-soft">
                        {size?.label}
                        {size && finish ? " · " : ""}
                        {finish?.label}
                      </div>
                    )}
                  </div>
                  <span className="ml-auto rounded-full bg-paper-2 py-1.5 px-[13px] text-[15px] font-extrabold">×{it.qty}</span>
                </>
              );

              if (product) {
                const href = it.sizeId ? `/producto/${product.id}?size=${it.sizeId}` : `/producto/${product.id}`;
                return (
                  <Link className={cn(itemClass, "text-inherit no-underline hover:border-ink")} href={href} key={i}>
                    {content}
                  </Link>
                );
              }

              return (
                <div className={itemClass} key={i}>
                  {content}
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-line bg-surface p-[26px] shadow-[var(--shadow-brand)]">
            <div className="flex justify-between py-1.5 text-sm text-ink-soft">
              <span>Comprado por separado (aprox.)</span>
              <span style={{ textDecoration: "line-through" }}>{ars(kit.regular)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm text-ink-soft" style={{ color: "var(--color-flash)", fontWeight: 700 }}>
              <span>Ahorro del combo</span>
              <span>
                − {ars(save)} ({pct}%)
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3.5 text-[17px] text-ink">
              <span>Precio del kit</span>
              <b className="font-display text-[34px] font-semibold">{ars(kit.price)}</b>
            </div>
            {kit.note && (
              <div className="mt-4 flex gap-2.5 rounded bg-paper-2 py-3.5 px-4 text-[13px] text-ink-soft">
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
