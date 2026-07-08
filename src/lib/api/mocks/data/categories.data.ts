import type { Category } from "../../types";

export const categoriesData: Category[] = [
  { id: "jesus", world: "religioso", name: "Jesús", count: 14, mode: "catalog" },
  { id: "virgen", world: "religioso", name: "Virgen María", count: 11, mode: "catalog" },
  { id: "santos", world: "religioso", name: "Santos", count: 18, mode: "catalog" },
  { id: "angeles", world: "religioso", name: "Ángeles", count: 9, mode: "catalog" },
  {
    id: "pesebres",
    world: "religioso",
    name: "Pesebres",
    count: 6,
    mode: "catalog",
    discount: { pct: 15, label: "−15% toda la categoría" },
  },

  { id: "budas", world: "holistico", name: "Budas", count: 16, mode: "catalog" },
  { id: "elefantes", world: "holistico", name: "Elefantes", count: 12, mode: "catalog" },
  { id: "fuentes", world: "holistico", name: "Fuentes elefante", count: 7, mode: "catalog" },
  { id: "hornillos", world: "holistico", name: "Hornillos", count: 10, mode: "catalog" },
  { id: "mandalas", world: "holistico", name: "Mandalas", count: 8, mode: "catalog" },

  {
    id: "sahumerios",
    world: "holistico",
    name: "Sahumerios",
    count: 40,
    mode: "whatsapp",
    note: "Más de 40 fragancias rotando. Consultá stock del día.",
  },
  {
    id: "velas",
    world: "holistico",
    name: "Velas",
    count: 25,
    mode: "whatsapp",
    note: "Velas de soja, decorativas y rituales. Aromas a pedido.",
  },
  {
    id: "inciensos",
    world: "holistico",
    name: "Inciensos",
    count: 30,
    mode: "whatsapp",
    note: "Importados y nacionales. Cajas y unidades sueltas.",
  },
];
