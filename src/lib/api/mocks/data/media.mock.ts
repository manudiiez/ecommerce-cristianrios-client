import type { FinishId, GalleryImage, Media, ProductImage } from "../../types";

let nextId = 1;

export function mockMedia(seed: string, alt: string): Media {
  return {
    id: nextId++,
    alt,
    url: `https://picsum.photos/seed/${seed}/1200/1500`,
    sizes: {
      thumbnail: { url: `https://picsum.photos/seed/${seed}/500/600`, width: 500, height: 600 },
      large: { url: `https://picsum.photos/seed/${seed}/1200/1500`, width: 1200, height: 1500 },
    },
  };
}

/** ~1 de cada 7 ítems se deja sin imágenes para ejercitar el fallback a placeholder. */
function skipMock(index: number) {
  return index % 7 === 6;
}

export function mockGalleryImages(seed: string, alt: string, index: number): GalleryImage[] {
  if (skipMock(index)) return [];
  return [{ image: mockMedia(seed, alt), cover: true }];
}

export function mockProductImages(
  seed: string,
  alt: string,
  index: number,
  finishes: FinishId[],
  availableSizes: string[],
): ProductImage[] {
  if (skipMock(index)) return [];
  const images: ProductImage[] = [{ image: mockMedia(`${seed}-cover`, alt), cover: true }];
  if (finishes.includes("pintada")) {
    images.push({ image: mockMedia(`${seed}-pintada`, `${alt} (pintada)`), cover: false, finish: "pintada" });
  }
  if (availableSizes.length > 1) {
    const lastSize = availableSizes[availableSizes.length - 1];
    images.push({ image: mockMedia(`${seed}-${lastSize}`, `${alt} (${lastSize})`), cover: false, size: lastSize });
  }
  return images;
}
