import type { Store } from "../types";

export interface StoreService {
  get(): Promise<Store>;
}

export const storeService: StoreService = {
  get() {
    throw new Error("API not implemented");
  },
};
