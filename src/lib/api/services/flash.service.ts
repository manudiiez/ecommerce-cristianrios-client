import type { FlashDeal } from "../types";

export interface FlashService {
  getAll(): Promise<FlashDeal[]>;
  getSoonest(): Promise<FlashDeal | null>;
}

export const flashService: FlashService = {
  getAll() {
    throw new Error("API not implemented");
  },
  getSoonest() {
    throw new Error("API not implemented");
  },
};
