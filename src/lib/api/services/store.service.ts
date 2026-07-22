import { STORE_REVALIDATE_SECONDS } from "../config";
import type { PayloadStore } from "../payload/adapters";
import { mapStore } from "../payload/adapters";
import { payloadGlobal } from "../payload/client";
import type { Store } from "../types";

export interface StoreService {
  get(): Promise<Store>;
}

export const storeService: StoreService = {
  async get() {
    const raw = await payloadGlobal<PayloadStore>("store", {}, { revalidate: STORE_REVALIDATE_SECONDS });
    return mapStore(raw);
  },
};
