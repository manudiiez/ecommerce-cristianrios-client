import type { Size, WorldId } from "../../types";

export const sizesReligiosoData: Record<string, Size> = {
  "r-15": { id: "r-15", label: "15 cm", price: 5200, paintedAdd: 1500 },
  "r-20": { id: "r-20", label: "20 cm", price: 8500, paintedAdd: 2500 },
  "r-30": { id: "r-30", label: "30 cm", price: 14000, paintedAdd: 4500 },
  "r-40": { id: "r-40", label: "40 cm", price: 22000, paintedAdd: 7000 },
  "r-50": { id: "r-50", label: "50 cm", price: 34000, paintedAdd: 11000 },
  "r-70": { id: "r-70", label: "70 cm", price: 58000, paintedAdd: 18000 },
};

export const sizesHolisticoData: Record<string, Size> = {
  "h-mini": { id: "h-mini", label: "Mini", price: 4000, paintedAdd: 1200 },
  "h-chica": { id: "h-chica", label: "Chica", price: 7200, paintedAdd: 2000 },
  "h-mediana": { id: "h-mediana", label: "Mediana", price: 12500, paintedAdd: 3500 },
  "h-grande": { id: "h-grande", label: "Grande", price: 21000, paintedAdd: 6000 },
  "h-gigante": { id: "h-gigante", label: "Gigante", price: 36000, paintedAdd: 10000 },
};

export const allSizesData: Record<string, Size> = {
  ...sizesReligiosoData,
  ...sizesHolisticoData,
};

export function sizesForWorld(world: WorldId): Record<string, Size> {
  return world === "religioso" ? sizesReligiosoData : sizesHolisticoData;
}
