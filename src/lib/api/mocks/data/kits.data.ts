import type { Kit } from "../../types";

export const kitsData: Omit<Kit, "images">[] = [
  {
    id: "kit-altar",
    world: "religioso",
    name: "Kit Altar Devocional",
    blurb: "Para armar o renovar un altar completo.",
    items: [
      { name: "Jesús · Sagrado Corazón (20 cm)", qty: 3, productId: "jesus-sagrado-corazon", sizeId: "r-20", finishId: "crudo" },
      { name: "Virgen de Luján (20 cm)", qty: 2, productId: "virgen-lujan", sizeId: "r-20", finishId: "crudo" },
    ],
    price: 130000,
    regular: 158000,
    note: "Combiná las terminaciones al confirmar el pedido.",
    tag: "Combo distribuidora",
  },
  {
    id: "kit-revendedor-holistico",
    world: "holistico",
    name: "Kit Arranque Holístico",
    blurb: "El surtido ideal para empezar a revender.",
    items: [
      { name: "Buda en Meditación (Mini)", qty: 4, productId: "buda-meditacion", sizeId: "h-mini", finishId: "crudo" },
      { name: "Elefante Trompa Arriba (Mini)", qty: 4, productId: "elefante-trompa", sizeId: "h-mini", finishId: "crudo" },
      { name: "Hornillo Flor de Loto (Mini)", qty: 3, productId: "hornillo-flor", sizeId: "h-mini", finishId: "crudo" },
    ],
    price: 96000,
    regular: 121500,
    note: "Precio mayorista. Pedido mínimo de reventa.",
    tag: "Más elegido",
  },
  {
    id: "kit-aromas",
    world: "holistico",
    name: "Kit Aromas & Hornillo",
    blurb: "Hornillo + aromáticos surtidos para regalo.",
    items: [
      { name: "Hornillo Mandala (Mini)", qty: 1, productId: "hornillo-mandala", sizeId: "h-mini", finishId: "crudo" },
      { name: "Sahumerios surtidos x6 (vía WhatsApp)", qty: 1 },
      { name: "Vela de soja aromática", qty: 1 },
    ],
    price: 14500,
    regular: 18900,
    note: "Los aromáticos se confirman por WhatsApp según stock.",
  },
];
