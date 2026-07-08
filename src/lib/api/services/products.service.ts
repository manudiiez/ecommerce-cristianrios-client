import type { Product, ProductFilters } from "../types";

export interface ProductsService {
  getAll(filters?: ProductFilters): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getRelated(product: Product, limit?: number): Promise<Product[]>;
}

export const productsService: ProductsService = {
  getAll() {
    throw new Error("API not implemented");
  },
  getById() {
    throw new Error("API not implemented");
  },
  getRelated() {
    throw new Error("API not implemented");
  },
};
