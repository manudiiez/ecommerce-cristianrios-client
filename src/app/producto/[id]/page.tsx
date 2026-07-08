import { notFound } from "next/navigation";
import { Crumb } from "@/components/features/catalog/crumb";
import { ProductDetailView } from "@/components/features/product/product-detail-view";
import { api } from "@/lib/api";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ size?: string }>;
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const { size } = await searchParams;

  const product = await api.products.getById(id);
  if (!product) notFound();

  const [category, worlds, categories, allSizes, finishes, worldSizes, related] = await Promise.all([
    api.catalog.getCategoryById(product.cat),
    api.catalog.getWorlds(),
    api.catalog.getCategories(),
    api.catalog.getAllSizes(),
    api.catalog.getFinishes(),
    api.catalog.getSizesForWorld(product.world),
    api.products.getRelated(product),
  ]);
  const w = worlds.find((x) => x.id === product.world)!;
  const productSizes = worldSizes.filter((s) => product.availableSizes.includes(s.id));
  const initialSizeId = size && product.availableSizes.includes(size) ? size : product.availableSizes[0];

  return (
    <main className="fade-in" id="main">
      <Crumb
        trail={[
          { label: "Inicio", href: "/" },
          { label: w.name, href: `/${product.world}` },
          { label: category!.name, href: `/categoria/${category!.id}` },
          { label: product.name },
        ]}
      />
      <ProductDetailView
        product={product}
        category={category!}
        productSizes={productSizes}
        allSizes={allSizes}
        finishes={finishes}
        initialSizeId={initialSizeId}
        related={related}
        categories={categories}
      />
    </main>
  );
}
