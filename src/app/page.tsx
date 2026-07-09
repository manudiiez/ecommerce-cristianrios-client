import { FeaturedRow } from "@/components/features/home/featured-row";
import { FlashCarousel } from "@/components/features/home/flash-carousel";
import { FlashTeaser } from "@/components/features/home/flash-teaser";
import { KitsTeaser } from "@/components/features/home/kits-teaser";
import { SplitEntry } from "@/components/features/home/split-entry";
import { Strip } from "@/components/features/home/strip";
import { WaTeaser } from "@/components/features/home/wa-teaser";
import { api } from "@/lib/api";

export default async function HomePage() {
  const [worlds, categories, products, kits, flash, allSizes, finishes] = await Promise.all([
    api.catalog.getWorlds(),
    api.catalog.getCategories(),
    api.products.getAll(),
    api.kits.getAll(),
    api.flash.getAll(),
    api.catalog.getAllSizes(),
    api.catalog.getFinishes(),
  ]);
  const featuredFlash = flash[0];
  const liveFlash = flash.filter((d) => d.endsAt > Date.now());

  return (
    <main id="main">
      <SplitEntry worlds={worlds} categories={categories} />
      <Strip />
      {liveFlash.length > 0 && <FlashCarousel deals={liveFlash} />}
      <FeaturedRow
        world="religioso"
        kicker="Lo más pedido"
        title="Destacados · Religioso"
        products={products}
        worlds={worlds}
        categories={categories}
        allSizes={allSizes}
        finishes={finishes}
      />
      <FeaturedRow
        world="holistico"
        kicker="Para tu ritual"
        title="Destacados · Holístico"
        products={products}
        worlds={worlds}
        categories={categories}
        allSizes={allSizes}
        finishes={finishes}
      />
      {featuredFlash && <FlashTeaser deal={featuredFlash} />}
      <KitsTeaser kits={kits} />
      <hr className="divider" />
      <WaTeaser categories={categories} />
    </main>
  );
}
