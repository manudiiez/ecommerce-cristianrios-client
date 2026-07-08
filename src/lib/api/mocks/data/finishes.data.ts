import type { Finish, FinishId } from "../../types";

export const finishesData: Record<FinishId, Finish> = {
  crudo: { id: "crudo", label: "Sin pintar", sub: "Yeso natural", add: 0, swatch: "#ece4d6" },
  pintada: { id: "pintada", label: "Pintada", sub: "Pintada a mano", add: 0, swatch: "#c98a9b" },
};
