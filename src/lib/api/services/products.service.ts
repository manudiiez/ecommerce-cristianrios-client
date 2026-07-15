import type { PayloadProduct } from "../payload/adapters";
import { mapProduct } from "../payload/adapters";
import { payloadFetch, payloadFind, payloadFindOneBySlug, payloadList } from "../payload/client";
import type { Product, ProductFilters, WorldId } from "../types";

export interface ProductsService {
  getAll(filters?: ProductFilters): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getRelated(product: Product, limit?: number): Promise<Product[]>;
  getFeatured(world: WorldId, limit?: number): Promise<Product[]>;
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
    const data = await payloadFetch<{ docs: PayloadProduct[] }>(`/products/${product.id}/related`, {
      limit: String(limit),
    });
    return data.docs.map(mapProduct);
  },
  async getFeatured(world, limit = 4) {
    const docs = await payloadFind<PayloadProduct>("products", {
      depth: "2",
      "where[world.slug][equals]": world,
      "where[featured][equals]": "true",
      sort: "featuredOrder",
      limit: String(limit),
    });
    return docs.map(mapProduct);
  },
};
