"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Category, World } from "@/lib/api";
import { Ico } from "@/components/ui/icon";

interface SplitEntryProps {
  worlds: World[];
  categories: Category[];
}

export function SplitEntry({ worlds, categories }: SplitEntryProps) {
  const [hover, setHover] = useState<string | null>(null);

  const half = (world: World) => {
    const cats = categories.filter((c) => c.world === world.id && c.mode === "catalog").slice(0, 4);
    const dim = hover && hover !== world.id;
    const grow = hover === world.id;
    return (
      <div
        key={world.id}
        className={"split-half " + world.id + (dim ? " dim" : "") + (grow ? " grow" : "")}
        onMouseEnter={() => setHover(world.id)}
        onMouseLeave={() => setHover(null)}
      >
        <Link href={`/${world.id}`} style={{ position: "absolute", inset: 0, zIndex: 2 }} aria-label={`Entrar a ${world.name}`} />
        <div className="tex"></div>
        <div className="split-inner">
          <span className="split-kicker">{world.kicker}</span>
          <h2 className="split-title display">{world.name}</h2>
          <p className="split-blurb">{world.blurb}</p>
          <div className="split-cats">
            {cats.map((c) => (
              <Link key={c.id} href={`/categoria/${c.id}`} className="split-cat" style={{ position: "relative", zIndex: 3 }}>
                {c.name}
              </Link>
            ))}
          </div>
          <span className="split-go">
            Entrar a {world.name} <Ico.arrow />
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="split-entry">
      {half(worlds[0])}
      <div className="split-seam">
        <div className="seam-badge">
          <Image src="/logo-hanna.png" alt="Hanna" width={56} height={56} />
          <b className="display">Hanna</b>
          <span>Elegí tu mundo</span>
        </div>
      </div>
      {half(worlds[1])}
    </section>
  );
}
