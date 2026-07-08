import type { KitsService } from "../services/kits.service";
import { kitsData } from "./data/kits.data";

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const kitsMock: KitsService = {
  async getAll() {
    await delay();
    return kitsData;
  },
  async getById(id) {
    await delay();
    return kitsData.find((k) => k.id === id) ?? null;
  },
};
