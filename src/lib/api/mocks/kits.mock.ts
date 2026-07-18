import type { Kit } from "../types";
import type { KitsService } from "../services/kits.service";
import { kitsData } from "./data/kits.data";
import { mockGalleryImages } from "./data/media.mock";

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

const allKits: Kit[] = kitsData.map((k, i) => ({
  ...k,
  images: mockGalleryImages(`kit-${k.id}`, k.name, i),
}));

export const kitsMock: KitsService = {
  async getAll() {
    await delay();
    return allKits;
  },
  async getById(id) {
    await delay();
    return allKits.find((k) => k.id === id) ?? null;
  },
};
