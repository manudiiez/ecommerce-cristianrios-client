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
  sizeScope: "all" | "specific";
  sizes?: string[];
}

export interface MediaSize {
  url: string;
  width: number;
  height: number;
}

export interface Media {
  id: number;
  alt: string;
  url: string;
  sizes: {
    thumbnail: MediaSize;
    large: MediaSize;
  };
}

export interface GalleryImage {
  image: Media;
  cover: boolean;
}

export interface ProductImage extends GalleryImage {
  size?: string;
  finish?: FinishId;
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
  featured?: boolean;
  featuredOrder?: number;
  images: ProductImage[];
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
  images: GalleryImage[];
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
  images: GalleryImage[];
}

export interface PriceResult {
  price: number;
  was: number | null;
  saveLabel?: string;
  hasDiscount: boolean;
}

export interface PriceQuote {
  price: number;
  was?: number;
}

export type OrderCanal = "whatsapp" | "email" | "cualquiera";
export type OrderTipo = "publico" | "revendedor" | "mayorista";

/** nombre, tel y email son requeridos por el backend (se validan en el form antes de enviar). */
export interface OrderForm {
  nombre?: string;
  tel?: string;
  email?: string;
  canal?: OrderCanal;
  tipo?: OrderTipo;
  notas?: string;
}

export interface CartLine {
  key: string;
  id: string;
  name: string;
  world: WorldId | "flash";
  cat: string;
  /** Solo presentes para productos (type: "product"): slugs reales, no labels. */
  sizeId?: string;
  finishId?: FinishId;
  sizeLabel: string;
  finishLabel: string;
  price: number;
  qty: number;
  isKit?: boolean;
  isFlash?: boolean;
  imageUrl?: string;
  imageAlt?: string;
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
  image: Media | null;
}
