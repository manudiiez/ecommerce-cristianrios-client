import type {
  Category,
  Finish,
  FinishId,
  FlashDeal,
  GalleryImage,
  Kit,
  KitItem,
  Media,
  Order,
  OrderForm,
  Product,
  ProductDiscount,
  ProductImage,
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

export interface PayloadMediaSize {
  url: string;
  width: number;
  height: number;
}

export interface PayloadMedia {
  id: number;
  alt: string;
  url: string;
  sizes: {
    thumbnail: PayloadMediaSize;
    large: PayloadMediaSize;
  };
}

export interface PayloadGalleryImage {
  image: PayloadMedia;
  cover: boolean;
}

export interface PayloadProductImage extends PayloadGalleryImage {
  size?: { slug: string } | null;
  finish?: { slug: string } | null;
}

interface PayloadDiscount {
  pct: number | null;
  label: string | null;
  scope: "all" | "finish";
  finish?: { slug: string } | null;
  sizeScope?: "all" | "specific";
  sizes?: { slug: string }[] | null;
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
  featured?: boolean | null;
  featuredOrder?: number | null;
  images?: PayloadProductImage[] | null;
}

export interface PayloadWhatsAppItem {
  id: string | number;
  name: string;
  category: { slug: string };
  blurb: string;
  waMessage: string;
  image?: PayloadMedia | null;
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

export function mapMedia(raw: PayloadMedia): Media {
  return {
    id: raw.id,
    alt: raw.alt,
    url: raw.url,
    sizes: {
      thumbnail: { url: raw.sizes.thumbnail.url, width: raw.sizes.thumbnail.width, height: raw.sizes.thumbnail.height },
      large: { url: raw.sizes.large.url, width: raw.sizes.large.width, height: raw.sizes.large.height },
    },
  };
}

export function mapGalleryImage(raw: PayloadGalleryImage): GalleryImage {
  return { image: mapMedia(raw.image), cover: raw.cover };
}

export function mapProductImage(raw: PayloadProductImage): ProductImage {
  return {
    image: mapMedia(raw.image),
    cover: raw.cover,
    size: raw.size?.slug,
    finish: raw.finish?.slug as FinishId | undefined,
  };
}

function mapDiscount(raw?: PayloadDiscount | null): ProductDiscount | undefined {
  if (!raw || raw.pct == null) return undefined;
  return {
    pct: raw.pct,
    label: raw.label ?? "",
    scope: raw.scope === "finish" && raw.finish ? (`finish:${raw.finish.slug as FinishId}` as const) : "all",
    sizeScope: raw.sizeScope === "specific" ? "specific" : "all",
    sizes: raw.sizeScope === "specific" ? raw.sizes?.map((s) => s.slug) : undefined,
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
    featured: raw.featured ?? false,
    featuredOrder: raw.featuredOrder ?? undefined,
    images: raw.images?.map(mapProductImage) ?? [],
  };
}

export function mapWhatsAppItem(raw: PayloadWhatsAppItem): WhatsAppItem {
  return {
    id: String(raw.id),
    cat: raw.category.slug,
    name: raw.name,
    blurb: raw.blurb,
    waMessage: raw.waMessage,
    image: raw.image ? mapMedia(raw.image) : null,
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
  images?: PayloadGalleryImage[] | null;
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
    images: raw.images?.map(mapGalleryImage) ?? [],
  };
}

export interface PayloadOrderItem {
  type: "product" | "kit" | "flash";
  refId: string;
  name: string;
  sizeSlug?: string | null;
  finishSlug?: string | null;
  sizeLabel?: string | null;
  finishLabel?: string | null;
  unitPrice: number;
  qty: number;
}

export interface PayloadOrder {
  code: string;
  form: OrderForm;
  items: PayloadOrderItem[];
  count: number;
  total: number;
}

export function mapOrder(raw: PayloadOrder): Order {
  return {
    code: raw.code,
    nombre: (raw.form.nombre ?? "").trim(),
    count: raw.count,
    lines: raw.items.length,
    total: raw.total,
    canal: raw.form.canal || "cualquiera",
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
  images?: PayloadGalleryImage[] | null;
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
    images: raw.images?.map(mapGalleryImage) ?? [],
  };
}
