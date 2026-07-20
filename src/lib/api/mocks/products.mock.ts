import type { Product } from "../types";
import type { ProductsService } from "../services/products.service";
import { productsData } from "./data/products.data";
import { mockProductImages } from "./data/media.mock";

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

const allProducts: Product[] = productsData.map((p, i) => ({
  ...p,
  images: mockProductImages(`${p.world}-${p.cat}-${p.id}`, p.name, i, p.finishes, p.availableSizes),
}));

export const productsMock: ProductsService = {
  async getAll(filters) {
    await delay();
    let result = allProducts;
    if (filters?.cat) result = result.filter((p) => p.cat === filters.cat);
    if (filters?.world) result = result.filter((p) => p.world === filters.world);
    return result;
  },
  async getById(id) {
    await delay();
    return allProducts.find((p) => p.id === id) ?? null;
  },
  async getRelated(product, limit = 4) {
    await delay();
    const sameCat = allProducts.filter((p) => p.cat === product.cat && p.id !== product.id);
    if (sameCat.length >= limit) return sameCat.slice(0, limit);
    const sameWorld = allProducts.filter(
      (p) => p.world === product.world && p.cat !== product.cat,
    );
    return [...sameCat, ...sameWorld].slice(0, limit);
  },
  async getFeatured(world, limit = 4) {
    await delay();
    return allProducts
      .filter((p) => p.world === world && p.featured)
      .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
      .slice(0, limit);
  },
};
