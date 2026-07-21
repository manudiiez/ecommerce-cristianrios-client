"use client";

import { useState } from "react";
import type { GalleryImage, WorldId } from "@/lib/api";
import { Lightbox } from "@/components/ui/lightbox";
import { Placeholder } from "@/components/ui/placeholder";
import { coverImage } from "@/lib/images";

export function KitGallery({
  world,
  collageCats,
  images,
}: {
  world: WorldId;
  collageCats: string[];
  images: GalleryImage[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasImages = images.length > 0;

  return (
    <>
      <div className="grid aspect-square grid-cols-2 grid-rows-2 gap-3">
        {collageCats.map((cat, i) => {
          const imgIdx = hasImages ? i % images.length : undefined;
          return (
            <Placeholder
              key={cat}
              world={world}
              cat={cat}
              label={i === 0 ? "Kit" : ""}
              offset={i}
              media={hasImages ? (images[imgIdx!]?.image ?? coverImage(images)) : undefined}
              variant="large"
              sizes="(max-width: 880px) 50vw, 25vw"
              className={i === 0 ? "row-span-2" : undefined}
              zoomable={hasImages}
              style={hasImages ? { cursor: "pointer" } : undefined}
              onClick={hasImages ? () => setLightboxIndex(imgIdx!) : undefined}
            />
          );
        })}
      </div>
      {hasImages && lightboxIndex !== null && (
        <Lightbox
          images={images.map((i) => i.image)}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
