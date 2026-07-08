"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { Category, FlashDeal, Store } from "@/lib/api";
import { Toast } from "@/components/ui/toast";
import { useCart } from "@/hooks/use-cart";
import { Drawer } from "./drawer";
import { FlashBar } from "./flash-bar";
import { FlashFab } from "./flash-fab";
import { Footer } from "./footer";
import { Header } from "./header";

interface SiteChromeProps {
  categories: Category[];
  store: Store;
  soonestFlash: FlashDeal | null;
  children: ReactNode;
}

export function SiteChrome({ categories, store, soonestFlash, children }: SiteChromeProps) {
  const pathname = usePathname();
  const cart = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [barOpen, setBarOpen] = useState(true);
  const [fabClosed, setFabClosed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // cierra el drawer al cambiar de ruta — ajuste de estado durante el render
  // (no un efecto) siguiendo el patrón recomendado por React para "resetear
  // estado cuando cambia una prop": https://react.dev/learn/you-might-not-need-an-effect
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onFlashPage = pathname === "/ofertas-flash";
  const showBar = barOpen && !onFlashPage && !!soonestFlash;
  const showFab = !fabClosed && !onFlashPage && !!soonestFlash && (!showBar || scrolled);

  return (
    <>
      {showBar && soonestFlash && <FlashBar deal={soonestFlash} onClose={() => setBarOpen(false)} />}
      <Header onMenu={() => setDrawerOpen(true)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} categories={categories} />
      {children}
      <Footer categories={categories} store={store} />
      <Toast msg={cart.toastMsg} />
      {showFab && soonestFlash && <FlashFab deal={soonestFlash} onClose={() => setFabClosed(true)} />}
    </>
  );
}
