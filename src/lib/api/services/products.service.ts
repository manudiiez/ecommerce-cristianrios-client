import type { PayloadProduct } from "../payload/adapters";
import { mapProduct } from "../payload/adapters";
import { payloadFindOneBySlug, payloadList } from "../payload/client";
import type { Product, ProductFilters } from "../types";

export interface ProductsService {
  getAll(filters?: ProductFilters): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getRelated(product: Product, limit?: number): Promise<Product[]>;
}

function filtersToParams(filters?: ProductFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters?.cat) params["where[category.slug][equals]"] = filters.cat;
  if (filters?.world) params["where[world.slug][equals]"] = filters.world;
  return params;
}

export const productsService: ProductsService = {
  async getAll(filters) {
    const docs = await payloadList<PayloadProduct>("products", { depth: "2", ...filtersToParams(filters) });
    return docs.map(mapProduct);
  },
  async getById(id) {
    const doc = await payloadFindOneBySlug<PayloadProduct>("products", id, { depth: "2" });
    return doc ? mapProduct(doc) : null;
  },
  async getRelated(product, limit = 4) {
    const sameCat = (await productsService.getAll({ cat: product.cat })).filter((p) => p.id !== product.id);
    if (sameCat.length >= limit) return sameCat.slice(0, limit);
    const sameWorld = (await productsService.getAll({ world: product.world })).filter(
      (p) => p.cat !== product.cat,
    );
    return [...sameCat, ...sameWorld].slice(0, limit);
  },
};
