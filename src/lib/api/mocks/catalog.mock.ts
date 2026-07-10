import type { CatalogService } from "../services/catalog.service";
import { categoriesData } from "./data/categories.data";
import { finishesData } from "./data/finishes.data";
import { allSizesData, sizesForWorld } from "./data/sizes.data";
import { whatsappItemsData } from "./data/whatsapp-items.data";
import { worldsData } from "./data/worlds.data";

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const catalogMock: CatalogService = {
  async getWorlds() {
    await delay();
    return worldsData;
  },
  async getCategories() {
    await delay();
    return categoriesData;
  },
  async getCategoryById(id) {
    await delay();
    return categoriesData.find((c) => c.id === id) ?? null;
  },
  async getSizesForWorld(world) {
    await delay();
    return Object.values(sizesForWorld(world));
  },
  async getAllSizes() {
    await delay();
    return allSizesData;
  },
  async getFinishes() {
    await delay();
    return finishesData;
  },
  async getWhatsappItems(catId) {
    await delay();
    return catId ? whatsappItemsData.filter((i) => i.cat === catId) : whatsappItemsData;
  },
};
