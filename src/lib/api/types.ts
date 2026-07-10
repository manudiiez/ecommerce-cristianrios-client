export interface Store {
  name: string;
  tagline: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  instagram: string;
}

export type WorldId = "religioso" | "holistico";

export interface World {
  id: WorldId;
  name: string;
  kicker: string;
  blurb: string;
  accent: "clay" | "rose";
}

export type CategoryMode = "catalog" | "whatsapp";

export interface CategoryDiscount {
  pct: number;
  label: string;
}

export interface Category {
  id: string;
  world: WorldId;
  name: string;
  count: number;
  mode: CategoryMode;
  discount?: CategoryDiscount;
  note?: string;
}

export interface Size {
  id: string;
  label: string;
  price: number;
  paintedAdd: number;
}

export type FinishId = "crudo" | "pintada";

export interface Finish {
  id: FinishId;
  label: string;
  sub: string;
  add: number;
  swatch: string;
}

export interface ProductDiscount {
  pct: number;
  label: string;
  scope: "all" | `finish:${FinishId}`;
}

export interface Product {
  id: string;
  cat: string;
  world: WorldId;
  name: string;
  availableSizes: string[];
  finishes: FinishId[];
  blurb: string;
  tag?: string;
  discount?: ProductDiscount;
}

export interface KitItem {
  name: string;
  qty: number;
  productId?: string;
  sizeId?: string;
  finishId?: FinishId;
}

export interface Kit {
  id: string;
  world: WorldId;
  name: string;
  blurb: string;
  items: KitItem[];
  price: number;
  regular: number;
  note?: string;
  tag?: string;
}

export interface FlashVariantValue {
  id: string;
  label: string;
}

export interface FlashVariantGroup {
  id: string;
  name: string;
  values: FlashVariantValue[];
}

export interface FlashDeal {
  id: string;
  name: string;
  kicker: string;
  blurb: string;
  price: number;
  regular: number;
  stockLeft: number;
  stockTotal: number;
  endsAt: number;
  variantGroups: FlashVariantGroup[];
}

export interface PriceResult {
  price: number;
  was: number | null;
  saveLabel?: string;
  hasDiscount: boolean;
}

export interface OrderForm {
  nombre?: string;
  tel?: string;
  email?: string;
  canal?: string;
  tipo?: string;
  notas?: string;
}

export interface CartLine {
  key: string;
  id: string;
  name: string;
  world: WorldId | "flash";
  cat: string;
  sizeLabel: string;
  finishLabel: string;
  price: number;
  qty: number;
  isKit?: boolean;
  isFlash?: boolean;
}

export interface Order {
  code: string;
  nombre: string;
  count: number;
  lines: number;
  total: number;
  canal: string;
}

export interface ProductFilters {
  cat?: string;
  world?: WorldId;
}

export interface WhatsAppItem {
  id: string;
  cat: string;
  name: string;
  blurb: string;
  waMessage: string;
}
