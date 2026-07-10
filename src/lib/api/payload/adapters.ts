import type {
  Category,
  Finish,
  FinishId,
  FlashDeal,
  Kit,
  KitItem,
  Product,
  ProductDiscount,
  Size,
  Store,
  WhatsAppItem,
  World,
  WorldId,
} from "../types";

export interface PayloadWorld {
  slug: string;
  name: string;
  kicker: string;
  blurb: string;
  accent: "clay" | "rose";
}

export interface PayloadCategory {
  slug: string;
  name: string;
  world: { slug: string };
  mode: "catalog" | "whatsapp";
  count: number;
  discount?: { pct: number | null; label: string | null } | null;
  note?: string | null;
}

export interface PayloadSize {
  slug: string;
  label: string;
  price: number;
  paintedAdd: number;
}

export interface PayloadFinish {
  slug: string;
  label: string;
  sub: string;
  swatch: string;
}

interface PayloadDiscount {
  pct: number | null;
  label: string | null;
  scope: "all" | "finish";
  finish?: { slug: string } | null;
}

export interface PayloadProduct {
  slug: string;
  name: string;
  category: { slug: string };
  world: { slug: string };
  availableSizes: { slug: string }[];
  finishes: { slug: string }[];
  blurb: string;
  tag?: string | null;
  discount?: PayloadDiscount | null;
}

export interface PayloadWhatsAppItem {
  id: string | number;
  name: string;
  category: { slug: string };
  blurb: string;
  waMessage: string;
}

export function mapWorld(raw: PayloadWorld): World {
  return { id: raw.slug as WorldId, name: raw.name, kicker: raw.kicker, blurb: raw.blurb, accent: raw.accent };
}

export function mapCategory(raw: PayloadCategory): Category {
  return {
    id: raw.slug,
    world: raw.world.slug as WorldId,
    name: raw.name,
    count: raw.count,
    mode: raw.mode,
    discount: raw.discount?.pct != null ? { pct: raw.discount.pct, label: raw.discount.label ?? "" } : undefined,
    note: raw.note ?? undefined,
  };
}

export function mapSize(raw: PayloadSize): Size {
  return { id: raw.slug, label: raw.label, price: raw.price, paintedAdd: raw.paintedAdd };
}

export function mapFinish(raw: PayloadFinish): Finish {
  return { id: raw.slug as FinishId, label: raw.label, sub: raw.sub, add: 0, swatch: raw.swatch };
}

function mapDiscount(raw?: PayloadDiscount | null): ProductDiscount | undefined {
  if (!raw || raw.pct == null) return undefined;
  return {
    pct: raw.pct,
    label: raw.label ?? "",
    scope: raw.scope === "finish" && raw.finish ? (`finish:${raw.finish.slug as FinishId}` as const) : "all",
  };
}

export function mapProduct(raw: PayloadProduct): Product {
  return {
    id: raw.slug,
    cat: raw.category.slug,
    world: raw.world.slug as WorldId,
    name: raw.name,
    availableSizes: raw.availableSizes.map((s) => s.slug),
    finishes: raw.finishes.map((f) => f.slug as FinishId),
    blurb: raw.blurb,
    tag: raw.tag ?? undefined,
    discount: mapDiscount(raw.discount),
  };
}

export function mapWhatsAppItem(raw: PayloadWhatsAppItem): WhatsAppItem {
  return {
    id: String(raw.id),
    cat: raw.category.slug,
    name: raw.name,
    blurb: raw.blurb,
    waMessage: raw.waMessage,
  };
}

export interface PayloadStore {
  name: string;
  tagline: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  instagram: string;
}

export function mapStore(raw: PayloadStore): Store {
  return {
    name: raw.name,
    tagline: raw.tagline,
    whatsapp: raw.whatsapp,
    whatsappDisplay: raw.whatsappDisplay,
    email: raw.email,
    instagram: raw.instagram,
  };
}

interface PayloadKitItem {
  name: string;
  qty: number;
  product?: { slug: string } | null;
  size?: { slug: string } | null;
  finish?: { slug: string } | null;
}

export interface PayloadKit {
  slug: string;
  name: string;
  blurb: string;
  world: { slug: string };
  items: PayloadKitItem[];
  price: number;
  regular: number;
  note?: string | null;
  tag?: string | null;
}

function mapKitItem(raw: PayloadKitItem): KitItem {
  return {
    name: raw.name,
    qty: raw.qty,
    productId: raw.product?.slug,
    sizeId: raw.size?.slug,
    finishId: raw.finish?.slug as FinishId | undefined,
  };
}

export function mapKit(raw: PayloadKit): Kit {
  return {
    id: raw.slug,
    world: raw.world.slug as WorldId,
    name: raw.name,
    blurb: raw.blurb,
    items: raw.items.map(mapKitItem),
    price: raw.price,
    regular: raw.regular,
    note: raw.note ?? undefined,
    tag: raw.tag ?? undefined,
  };
}

interface PayloadFlashVariantValue {
  slug: string;
  label: string;
}

interface PayloadFlashVariantGroup {
  slug: string;
  name: string;
  values: PayloadFlashVariantValue[];
}

export interface PayloadFlashDeal {
  slug: string;
  name: string;
  kicker: string;
  blurb: string;
  price: number;
  regular: number;
  stockLeft: number;
  stockTotal: number;
  endsAt: number;
  variantGroups: PayloadFlashVariantGroup[];
}

export function mapFlashDeal(raw: PayloadFlashDeal): FlashDeal {
  return {
    id: raw.slug,
    name: raw.name,
    kicker: raw.kicker,
    blurb: raw.blurb,
    price: raw.price,
    regular: raw.regular,
    stockLeft: raw.stockLeft,
    stockTotal: raw.stockTotal,
    endsAt: raw.endsAt,
    variantGroups: raw.variantGroups.map((g) => ({
      id: g.slug,
      name: g.name,
      values: g.values.map((v) => ({ id: v.slug, label: v.label })),
    })),
  };
}
