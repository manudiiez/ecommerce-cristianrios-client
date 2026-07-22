"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, Finish, FinishId, Product, Size, WorldId } from "@/lib/api";
import { ProductCard } from "@/components/features/catalog/product-card";
import { worldAccent } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;
const INTERVAL_MS = 7000;
const FADE_MS = 300;

interface FeaturedCarouselProps {
  world: WorldId;
  products: Product[];
  categories: Category[];
  allSizes: Record<string, Size>;
  finishes: Record<FinishId, Finish>;
}

// Ventana circular de 4 en vez de partición fija: así cada página siempre
// tiene 4 productos (sin celdas vacías que hagan saltar el layout en mobile)
// aunque products.length no sea múltiplo de 4.
function getPage(products: Product[], pageIndex: number): Product[] {
  const n = products.length;
  return Array.from({ length: PAGE_SIZE }, (_, i) => products[(pageIndex * PAGE_SIZE + i) % n]);
}

export function FeaturedCarousel({ world, products, categories, allSizes, finishes }: FeaturedCarouselProps) {
  const pageCount = Math.ceil(products.length / PAGE_SIZE);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function goTo(next: number) {
    if (next === active) return;
    setVisible(false);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setActive(next);
      setVisible(true);
    }, FADE_MS);
  }

  useEffect(() => {
    if (pageCount <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      fadeTimer.current = setTimeout(() => {
        setActive((a) => (a + 1) % pageCount);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [pageCount]);

  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  const page = getPage(products, active);

  return (
    <>
      <div className={cn("grid grid-4 transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}>
        {page.map((p) => {
          const cat = categories.find((c) => c.id === p.cat);
          return (
            <ProductCard
              key={p.id}
              product={p}
              categoryName={cat?.name ?? ""}
              categoryHasDiscount={!!cat?.discount}
              allSizes={allSizes}
              finishes={finishes}
            />
          );
        })}
      </div>
      {pageCount > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "h-[9px] w-[9px] cursor-pointer rounded-full border-0 p-0",
                i === active ? (worldAccent(world) === "clay" ? "bg-clay" : "bg-rose") : "bg-line-strong",
              )}
              onClick={() => goTo(i)}
              aria-label={`Ver página ${i + 1} de destacados`}
            />
          ))}
        </div>
      )}
    </>
  );
}
