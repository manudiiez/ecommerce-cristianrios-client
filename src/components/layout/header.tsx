"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ico } from "@/components/ui/icon";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="flex shrink-0 cursor-pointer items-center gap-3" onClick={onClick}>
      <Image src="/logo-hanna.png" alt="Hanna · Yesos y Aromas" width={46} height={46} className="h-[46px] w-[46px] object-contain" />
      <div className="leading-none">
        <b className="font-display block text-[21px] font-medium tracking-display">Hanna</b>
        <span className="text-[10px] tracking-[0.26em] text-ink-soft uppercase">Yesos y Aromas</span>
      </div>
    </Link>
  );
}

const navLinkClass =
  "rounded py-2 px-[13px] text-[13.5px] font-medium text-ink-soft cursor-pointer transition duration-150 whitespace-nowrap hover:text-ink hover:bg-paper-2";

export function Header({ onMenu }: { onMenu: () => void }) {
  const cart = useCart();
  const pathname = usePathname();
  const isWorld = (world: string) => pathname === `/${world}`;
  const active = (test: boolean) => cn(navLinkClass, test && "text-ink");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[color-mix(in_oklab,var(--color-paper)_88%,transparent)] backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <div className="mx-auto flex h-[70px] max-w-[1240px] items-center gap-[18px] px-7 max-[640px]:px-[18px]">
        <Logo />
        <nav className="ml-auto flex items-center gap-1 max-[860px]:hidden">
          <Link href="/religioso" className={active(isWorld("religioso"))}>
            Religioso
          </Link>
          <Link href="/holistico" className={active(isWorld("holistico"))}>
            Regalería Holística
          </Link>
          <Link href="/kits" className={active(pathname?.startsWith("/kits") ?? false)}>
            Kits
          </Link>
          <Link href="/ofertas-flash" className={cn(navLinkClass, "inline-flex items-center gap-1 text-flash font-semibold")}>
            <Ico.bolt />
            Ofertas Flash
          </Link>
          <Link href="/contacto" className={active(pathname === "/contacto")}>
            Contacto
          </Link>
        </nav>
        <div className="flex items-center gap-2 max-[860px]:ml-auto">
          <Link
            href="/pedido"
            className="relative inline-flex items-center gap-2 rounded-full border-0 bg-ink py-[9px] px-4 text-[13.5px] font-semibold text-paper transition duration-150 hover:-translate-y-px max-[860px]:px-3"
          >
            <Ico.cart style={{ fontSize: 18 }} />
            <span className="max-[860px]:hidden">Pedido</span>
            {cart.count > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-deep px-[5px] text-[11.5px] font-bold text-white">
                {cart.count}
              </span>
            )}
          </Link>
          <button
            className="hidden max-[860px]:inline-flex max-[860px]:h-[42px] max-[860px]:w-[42px] max-[860px]:cursor-pointer max-[860px]:items-center max-[860px]:justify-center max-[860px]:rounded max-[860px]:border max-[860px]:border-line-strong max-[860px]:bg-surface"
            onClick={onMenu}
            aria-label="Menú"
          >
            <Ico.menu style={{ fontSize: 22 }} />
          </button>
        </div>
      </div>
      <div className="border-t border-line max-[860px]:hidden">
        <div className="mx-auto flex h-11 max-w-[1240px] items-center gap-[26px] px-7 text-[13px] max-[640px]:px-[18px]">
          <Link href="/religioso" className="flex items-center gap-2 font-medium text-ink-soft hover:text-ink">
            <span className="h-2 w-2 rounded-full bg-clay"></span> Religioso
          </Link>
          <div className="h-[18px] w-px bg-line-strong"></div>
          <Link href="/holistico" className="flex items-center gap-2 font-medium text-ink-soft hover:text-ink">
            <span className="h-2 w-2 rounded-full bg-rose"></span> Regalería Holística
          </Link>
          <div style={{ marginLeft: "auto", display: "flex", gap: 18, color: "var(--color-ink-soft)", fontSize: 12.5 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Ico.truck style={{ fontSize: 15 }} /> Envíos a todo el país
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Ico.box style={{ fontSize: 15 }} /> Precios mayoristas y minoristas
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export { Logo };
