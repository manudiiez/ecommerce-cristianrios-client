import type { FlashDeal } from "../../types";

const DAY = 86400000;

interface FlashDealSeed extends Omit<FlashDeal, "endsAt"> {
  endsInMs: number;
}

/** Ofertas relativas a "ahora" — igual que el export original, que calculaba
 * `endsAt` a partir de `Date.now()` al cargar `data.js`. */
const flashSeeds: FlashDealSeed[] = [
  {
    id: "flash-vino-mundial",
    name: "Vino Edición Mundial",
    kicker: "Llegó por tiempo limitado",
    blurb: "Malbec edición especial. Cuando se agota, se va de la tienda.",
    price: 9800,
    regular: 14000,
    stockLeft: 23,
    stockTotal: 60,
    endsInMs: 3 * DAY + 5 * 3600000,
    variants: [
      { id: "malbec", label: "Malbec" },
      { id: "cabernet", label: "Cabernet Franc" },
      { id: "blend", label: "Gran Corte" },
    ],
  },
  {
    id: "flash-mate-autografiado",
    name: "Set Mate Coleccionable",
    kicker: "Solo este fin de semana",
    blurb: "Mate + bombilla edición limitada. Stock muy acotado.",
    price: 12500,
    regular: 19900,
    stockLeft: 8,
    stockTotal: 30,
    endsInMs: 1 * DAY + 9 * 3600000,
    variants: [
      { id: "calabaza", label: "Calabaza forrada en cuero" },
      { id: "alpaca", label: "Alpaca cincelada" },
      { id: "torpedo", label: "Torpedo camionero" },
    ],
  },
  {
    id: "flash-chocolate",
    name: "Caja de Chocolates Artesanales",
    kicker: "Pop-up del mes",
    blurb: "Producción local, edición de temporada.",
    price: 6900,
    regular: 9500,
    stockLeft: 41,
    stockTotal: 80,
    endsInMs: 6 * DAY + 2 * 3600000,
    variants: [
      { id: "clasica", label: "Clásica surtida" },
      { id: "amargo", label: "70% cacao" },
      { id: "bombones", label: "Bombones rellenos" },
      { id: "sin-tacc", label: "Sin TACC" },
    ],
  },
];

export function buildFlashData(): FlashDeal[] {
  const now = Date.now();
  return flashSeeds.map(({ endsInMs, ...rest }) => ({ ...rest, endsAt: now + endsInMs }));
}
