import type { Kit } from "../types";

export interface KitsService {
  getAll(): Promise<Kit[]>;
  getById(id: string): Promise<Kit | null>;
}

export const kitsService: KitsService = {
  getAll() {
    throw new Error("API not implemented");
  },
  getById() {
    throw new Error("API not implemented");
  },
};
