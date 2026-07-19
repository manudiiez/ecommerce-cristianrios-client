import type { FinishId, GalleryImage, Media, ProductImage } from "@/lib/api";

export function coverImage(images?: GalleryImage[] | null): Media | undefined {
  return images?.find((i) => i.cover)?.image;
}

export function productImage(
  images: ProductImage[] | undefined,
  sizeId?: string,
  finishId?: FinishId,
): Media | undefined {
  if (!images?.length) return undefined;

  const exact = images.find((i) => i.size === sizeId && i.finish === finishId);
  if (exact) return exact.image;

  const bySize = sizeId ? images.find((i) => i.size === sizeId && !i.finish) : undefined;
  if (bySize) return bySize.image;

  const byFinish = finishId ? images.find((i) => i.finish === finishId && !i.size) : undefined;
  if (byFinish) return byFinish.image;

  return coverImage(images);
}

export function productImageIndex(images: ProductImage[] | undefined, sizeId?: string, finishId?: FinishId): number {
  const media = productImage(images, sizeId, finishId);
  if (!media || !images) return 0;
  const idx = images.findIndex((i) => i.image.id === media.id);
  return idx >= 0 ? idx : 0;
}

export function mediaUrl(media: Media | undefined | null, variant: "thumbnail" | "large" | "original" = "thumbnail"): string | undefined {
  if (!media) return undefined;
  if (variant === "original") return media.url;
  return media.sizes[variant]?.url ?? media.url;
}
