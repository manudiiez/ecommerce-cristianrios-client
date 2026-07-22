"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Category, Store, World } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface SplitEntryProps {
  worlds: World[];
  categories: Category[];
  store: Store;
}

export function SplitEntry({ worlds, categories, store }: SplitEntryProps) {
  const [hover, setHover] = useState<string | null>(null);

  const half = (world: World) => {
    const cats = categories.filter((c) => c.world === world.id && c.mode === "catalog").slice(0, 4);
    const dim = hover && hover !== world.id;
    const grow = hover === world.id;
    return (
      <div
        key={world.id}
        className={cn("group split-half", world.id, dim && "dim", grow && "grow")}
        onMouseEnter={() => setHover(world.id)}
        onMouseLeave={() => setHover(null)}
      >
        <Link href={`/${world.id}`} style={{ position: "absolute", inset: 0, zIndex: 2 }} aria-label={`Entrar a ${world.name}`} />
        <div className="tex"></div>
        <div className="split-inner relative ml-auto max-w-[460px]">
          <span className="inline-block rounded-full border border-[rgba(255,255,255,.35)] py-1.5 px-3 text-[11px] font-bold tracking-[0.24em] uppercase opacity-90">
            {world.kicker}
          </span>
          <h2 className="display mt-[18px] mb-3 text-[clamp(40px,5.2vw,74px)] leading-none">{world.name}</h2>
          <p className="mb-[22px] max-w-[40ch] text-[15.5px] leading-[1.55] opacity-[0.94]">{world.blurb}</p>
          <div className="split-cats mb-[26px] flex flex-wrap gap-[9px]">
            {cats.map((c) => (
              <Link
                key={c.id}
                href={`/categoria/${c.id}`}
                className="rounded-full border border-[rgba(255,255,255,.28)] bg-[rgba(255,255,255,.16)] py-2 px-[14px] text-[13px] font-semibold text-white backdrop-blur-[4px] transition duration-150 hover:bg-[rgba(255,255,255,.32)]"
                style={{ position: "relative", zIndex: 3 }}
              >
                {c.name}
              </Link>
            ))}
          </div>
          <span className="inline-flex items-center gap-[10px] rounded-full bg-white py-[14px] px-[26px] text-base font-bold text-ink transition-[gap] duration-200 group-hover:gap-4">
            Entrar a {world.name} <Ico.arrow />
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="split-entry">
      {half(worlds[0])}
      <div className="absolute top-0 bottom-0 left-1/2 z-3 flex -translate-x-1/2 items-center pointer-events-none max-[820px]:top-auto max-[820px]:left-0 max-[820px]:right-0 max-[820px]:translate-x-0 max-[820px]:translate-y-1/2 max-[820px]:justify-center">
        <div className="pointer-events-auto flex w-[132px] flex-col items-center gap-1 rounded-full border border-line bg-paper py-[22px] px-4 text-center shadow-[0_20px_50px_-18px_rgba(0,0,0,.5)] max-[820px]:w-auto max-[820px]:flex-row max-[820px]:gap-[10px] max-[820px]:py-3 max-[820px]:px-5">
          <Image src="/logo-hanna.png" alt={store.name} width={56} height={56} className="h-14 w-14 object-contain max-[820px]:h-9 max-[820px]:w-9" />
          <b className="display text-[22px] leading-none text-ink max-[820px]:text-[18px]">{store.name}</b>
          <span className="text-[9.5px] tracking-[0.14em] text-ink-soft uppercase max-[820px]:hidden">Elegí tu mundo</span>
        </div>
      </div>
      {half(worlds[1])}
    </section>
  );
}
