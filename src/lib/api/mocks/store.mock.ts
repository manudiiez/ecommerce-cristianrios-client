import type { StoreService } from "../services/store.service";
import { storeData } from "./data/store.data";

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const storeMock: StoreService = {
  async get() {
    await delay();
    return storeData;
  },
};
