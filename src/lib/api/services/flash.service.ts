import type { PayloadFlashDeal } from "../payload/adapters";
import { mapFlashDeal } from "../payload/adapters";
import { payloadFetch, payloadFindOneBySlug, payloadList } from "../payload/client";
import type { FlashDeal } from "../types";

export interface FlashService {
  getAll(): Promise<FlashDeal[]>;
  getSoonest(): Promise<FlashDeal | null>;
  getById(id: string): Promise<FlashDeal | null>;
}

export const flashService: FlashService = {
  async getAll() {
    const docs = await payloadList<PayloadFlashDeal>("flash-deals", { depth: "1" });
    return docs.map(mapFlashDeal);
  },
  async getSoonest() {
    const doc = await payloadFetch<PayloadFlashDeal | null>("/flash-deals/soonest");
    return doc ? mapFlashDeal(doc) : null;
  },
  async getById(id) {
    const doc = await payloadFindOneBySlug<PayloadFlashDeal>("flash-deals", id, { depth: "1" });
    return doc ? mapFlashDeal(doc) : null;
  },
};
