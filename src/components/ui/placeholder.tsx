import Image from "next/image";
import type { CSSProperties } from "react";
import type { Media } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { mediaUrl } from "@/lib/images";

type Cat = string | undefined;
type World = "religioso" | "holistico" | "flash" | undefined;

const WORLD_TINT: Record<string, Record<string, string>> = {
  religioso: { jesus: "#e7dcc8", virgen: "#e3dbc9", santos: "#ecdfca", angeles: "#eae0cd", pesebres: "#e6dac3", _: "#e7dcc7" },
  holistico: { budas: "#ece0d3", elefantes: "#efd9dd", fuentes: "#dde6df", hornillos: "#efe2d2", mandalas: "#ecdde2", _: "#ecdfd6" },
};

const FALLBACK_IMAGE: Record<"religioso" | "holistico" | "flash", string> = {
  religioso: "/products/figura-religiosa.png",
  holistico: "/products/figura-holistica.png",
  flash: "/products/oferta-flash.jpg",
};

function fallbackImage(world: World) {
  if (world === "religioso" || world === "holistico") return FALLBACK_IMAGE[world];
  return FALLBACK_IMAGE.flash;
}

function tintFor(world: World, cat: Cat) {
  const w = WORLD_TINT[world ?? ""] || {};
  return w[cat ?? ""] || w._ || "#e8ddca";
}

interface PlaceholderProps {
  world?: World;
  cat?: Cat;
  label?: string;
  tag?: string;
  tint?: string;
  offset?: number;
  active?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  media?: Media | null;
  variant?: "thumbnail" | "large";
  sizes?: string;
  zoomable?: boolean;
}

export function Placeholder({
  world,
  cat,
  label = "",
  tag,
  tint,
  active,
  className,
  style,
  onClick,
  media,
  variant = "thumbnail",
  sizes = "(max-width: 640px) 50vw, 300px",
  zoomable,
}: PlaceholderProps) {
  const t = tint || tintFor(world, cat);
  const classes = ["ph", className, active ? "active" : undefined].filter(Boolean).join(" ");
  const src = mediaUrl(media, variant) ?? fallbackImage(world);
  const alt = media?.alt || label;
  return (
    <div
      className={classes}
      style={{ ["--ph-tint" as string]: t, ...style }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-cover opacity-[0.88]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.04)_0%,rgba(0,0,0,.3)_100%)]" />
      {tag && (
        <div className="absolute top-3 left-3 z-[2] rounded-full bg-surface px-[9px] py-[5px] text-[10px] font-bold tracking-[0.1em] text-ink uppercase shadow-[var(--shadow-brand)]">
          {tag}
        </div>
      )}
      {zoomable && (
        <div className="pointer-events-none absolute right-3 bottom-3 z-[2] flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          <Ico.expand style={{ fontSize: 15 }} />
        </div>
      )}
    </div>
  );
}
