import type { PayloadKit } from "../payload/adapters";
import { mapKit } from "../payload/adapters";
import { payloadFindOneBySlug, payloadList } from "../payload/client";
import type { Kit } from "../types";

export interface KitsService {
  getAll(): Promise<Kit[]>;
  getById(id: string): Promise<Kit | null>;
}

export const kitsService: KitsService = {
  async getAll() {
    const docs = await payloadList<PayloadKit>("kits", { depth: "2" });
    return docs.map(mapKit);
  },
  async getById(id) {
    const doc = await payloadFindOneBySlug<PayloadKit>("kits", id, { depth: "2" });
    return doc ? mapKit(doc) : null;
  },
};
