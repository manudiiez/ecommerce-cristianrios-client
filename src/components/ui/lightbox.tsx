"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Media } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { mediaUrl } from "@/lib/images";

interface LightboxProps {
  images: Media[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const navBtnClass =
  "absolute top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition duration-150 hover:bg-white/20 max-[640px]:h-9 max-[640px]:w-9";

export function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const count = images.length;
  const media = images[index];

  const goPrev = useCallback(() => onIndexChange((index - 1 + count) % count), [index, count, onIndexChange]);
  const goNext = useCallback(() => onIndexChange((index + 1) % count), [index, count, onIndexChange]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goPrev, goNext]);

  if (!media) return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-6 max-[640px]:p-3" onClick={onClose}>
      <button
        className="absolute top-5 right-5 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition duration-150 hover:bg-white/20"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <Ico.x style={{ fontSize: 20 }} />
      </button>
      {count > 1 && (
        <>
          <button
            className={`${navBtnClass} left-4`}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Anterior"
          >
            <Ico.arrow style={{ fontSize: 20, transform: "rotate(180deg)" }} />
          </button>
          <button
            className={`${navBtnClass} right-4`}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Siguiente"
          >
            <Ico.arrow style={{ fontSize: 20 }} />
          </button>
        </>
      )}
      <div
        className="relative h-full max-h-[86vh] w-full max-w-[900px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={mediaUrl(media, "original") ?? ""} alt={media.alt ?? ""} fill sizes="90vw" className="object-contain" />
      </div>
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[13px] text-white/70">
          {index + 1} / {count}
        </div>
      )}
    </div>,
    document.body,
  );
}
