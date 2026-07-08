import type { Category, Finish, FinishId, Size, World, WorldId } from "../types";

export interface CatalogService {
  getWorlds(): Promise<World[]>;
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  getSizesForWorld(world: WorldId): Promise<Size[]>;
  getAllSizes(): Promise<Record<string, Size>>;
  getFinishes(): Promise<Record<FinishId, Finish>>;
}

export const catalogService: CatalogService = {
  getWorlds() {
    throw new Error("API not implemented");
  },
  getCategories() {
    throw new Error("API not implemented");
  },
  getCategoryById() {
    throw new Error("API not implemented");
  },
  getSizesForWorld() {
    throw new Error("API not implemented");
  },
  getAllSizes() {
    throw new Error("API not implemented");
  },
  getFinishes() {
    throw new Error("API not implemented");
  },
};
