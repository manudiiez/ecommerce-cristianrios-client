import type { FlashService } from "../services/flash.service";
import { buildFlashData } from "./data/flash.data";

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const flashMock: FlashService = {
  async getAll() {
    await delay();
    return buildFlashData();
  },
  async getSoonest() {
    await delay();
    const live = buildFlashData().filter((f) => f.endsAt > Date.now());
    if (!live.length) return null;
    return live.sort((a, b) => a.endsAt - b.endsAt)[0];
  },
};
