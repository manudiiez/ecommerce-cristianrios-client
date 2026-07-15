import Link from "next/link";
import type { Category, Finish, FinishId, Product, Size, World, WorldId } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { ProductCard } from "@/components/features/catalog/product-card";
import { worldAccent } from "@/lib/pricing";

interface FeaturedRowProps {
  world: WorldId;
  title: string;
  kicker: string;
  products: Product[];
  worlds: World[];
  categories: Category[];
  allSizes: Record<string, Size>;
  finishes: Record<FinishId, Finish>;
}

export function FeaturedRow({
  world,
  title,
  kicker,
  products,
  worlds,
  categories,
  allSizes,
  finishes,
}: FeaturedRowProps) {
  const w = worlds.find((x) => x.id === world)!;

  return (
    <section className={"section world-band " + world}>
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="band-tag">
              <span className={"dot dot-" + worldAccent(world)}></span>
              {w.name}
            </span>
            <span className="kicker" style={{ display: "block", marginTop: 10 }}>
              {kicker}
            </span>
            <h2>{title}</h2>
          </div>
          <Link href={`/${world}`} className="link">
            Ver todo {w.name} <Ico.arrow />
          </Link>
        </div>
        <div className="grid grid-4">
          {products.map((p) => {
            const cat = categories.find((c) => c.id === p.cat);
            return (
              <ProductCard
                key={p.id}
                product={p}
                categoryName={cat?.name ?? ""}
                categoryHasDiscount={!!cat?.discount}
                allSizes={allSizes}
                finishes={finishes}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
