import type {
  PayloadCategory,
  PayloadFinish,
  PayloadSize,
  PayloadWhatsAppItem,
  PayloadWorld,
} from "../payload/adapters";
import { mapCategory, mapFinish, mapSize, mapWhatsAppItem, mapWorld } from "../payload/adapters";
import { payloadFindOneBySlug, payloadList } from "../payload/client";
import type { Category, Finish, FinishId, Size, WhatsAppItem, World, WorldId } from "../types";

export interface CatalogService {
  getWorlds(): Promise<World[]>;
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  getSizesForWorld(world: WorldId): Promise<Size[]>;
  getAllSizes(): Promise<Record<string, Size>>;
  getFinishes(): Promise<Record<FinishId, Finish>>;
  getWhatsappItems(catId?: string): Promise<WhatsAppItem[]>;
}

export const catalogService: CatalogService = {
  async getWorlds() {
    const docs = await payloadList<PayloadWorld>("worlds");
    return docs.map(mapWorld);
  },
  async getCategories() {
    const docs = await payloadList<PayloadCategory>("categories", { depth: "1" });
    return docs.map(mapCategory);
  },
  async getCategoryById(id) {
    const doc = await payloadFindOneBySlug<PayloadCategory>("categories", id, { depth: "1" });
    return doc ? mapCategory(doc) : null;
  },
  async getSizesForWorld(world) {
    const docs = await payloadList<PayloadSize>("sizes", { "where[world.slug][equals]": world, sort: "order" });
    return docs.map(mapSize);
  },
  async getAllSizes() {
    const docs = await payloadList<PayloadSize>("sizes", { sort: "order" });
    const sizes = docs.map(mapSize);
    return Object.fromEntries(sizes.map((s) => [s.id, s]));
  },
  async getFinishes() {
    const docs = await payloadList<PayloadFinish>("finishes");
    const finishes = docs.map(mapFinish);
    return Object.fromEntries(finishes.map((f) => [f.id, f])) as Record<FinishId, Finish>;
  },
  async getWhatsappItems(catId) {
    const docs = await payloadList<PayloadWhatsAppItem>("whatsapp-items", {
      depth: "1",
      ...(catId ? { "where[category.slug][equals]": catId } : {}),
    });
    return docs.map(mapWhatsAppItem);
  },
};
