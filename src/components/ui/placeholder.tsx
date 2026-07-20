import Image from "next/image";
import type { CSSProperties } from "react";
import type { Media } from "@/lib/api";
import { mediaUrl } from "@/lib/images";

type Cat = string | undefined;
type World = "religioso" | "holistico" | "flash" | undefined;

const WORLD_TINT: Record<string, Record<string, string>> = {
  religioso: { jesus: "#e7dcc8", virgen: "#e3dbc9", santos: "#ecdfca", angeles: "#eae0cd", pesebres: "#e6dac3", _: "#e7dcc7" },
  holistico: { budas: "#ece0d3", elefantes: "#efd9dd", fuentes: "#dde6df", hornillos: "#efe2d2", mandalas: "#ecdde2", _: "#ecdfd6" },
};

function strHash(s: string) {
  let h = 5381;
  for (let i = 0; i < (s || "").length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

function picsumSeed(world: World, cat: Cat, label: string, offset = 0) {
  const w = world === undefined || world === "flash" ? "flash" : world;
  return "hanna-" + w + "-" + (cat || "x") + "-" + (strHash(label) % 9973) + "-" + offset;
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
}

export function Placeholder({
  world,
  cat,
  label = "",
  tag,
  tint,
  offset = 0,
  active,
  className,
  style,
  onClick,
  media,
  variant = "thumbnail",
}: PlaceholderProps) {
  const t = tint || tintFor(world, cat);
  const classes = ["ph", className, active ? "active" : undefined].filter(Boolean).join(" ");
  const src = mediaUrl(media, variant) ?? `https://picsum.photos/seed/${picsumSeed(world, cat, label, offset)}/600/750`;
  const alt = media?.alt || label;
  return (
    <div
      className={classes}
      style={{ ["--ph-tint" as string]: t, ...style }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 640px) 50vw, 300px" className="ph-img" />
      <div className="ph-overlay" />
      {tag && <div className="corner-tag">{tag}</div>}
    </div>
  );
}
