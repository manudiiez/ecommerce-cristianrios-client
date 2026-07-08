"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ico } from "@/components/ui/icon";
import { useCart } from "@/hooks/use-cart";

function Logo() {
  return (
    <Link href="/" className="hdr-logo">
      <Image src="/logo-hanna.png" alt="Hanna · Yesos y Aromas" width={46} height={46} />
      <div className="lt">
        <b>Hanna</b>
        <span>Yesos y Aromas</span>
      </div>
    </Link>
  );
}

export function Header({ onMenu }: { onMenu: () => void }) {
  const cart = useCart();
  const pathname = usePathname();
  const isWorld = (world: string) => pathname === `/${world}`;
  const active = (test: boolean) => (test ? "active" : "");

  return (
    <header className="hdr">
      <div className="wrap hdr-top">
        <Logo />
        <nav className="hdr-nav">
          <Link href="/religioso" className={active(isWorld("religioso"))}>
            Religioso
          </Link>
          <Link href="/holistico" className={active(isWorld("holistico"))}>
            Regalería Holística
          </Link>
          <Link href="/kits" className={active(pathname?.startsWith("/kits") ?? false)}>
            Kits
          </Link>
          <Link href="/ofertas-flash" className="flash">
            <Ico.bolt style={{ verticalAlign: "-2px", marginRight: 4 }} />
            Ofertas Flash
          </Link>
          <Link href="/contacto" className={active(pathname === "/contacto")}>
            Contacto
          </Link>
        </nav>
        <Link href="/pedido" className="hdr-cart">
          <Ico.cart style={{ fontSize: 18 }} />
          Pedido
          {cart.count > 0 && <span className="badge">{cart.count}</span>}
        </Link>
        <button className="hdr-menu-btn" onClick={onMenu} aria-label="Menú">
          <Ico.menu style={{ fontSize: 22 }} />
        </button>
      </div>
      <div className="hdr-sub">
        <div className="wrap hdr-sub-row">
          <Link href="/religioso" className="hdr-sub-world">
            <span className="dot dot-clay"></span> Religioso
          </Link>
          <div className="hdr-sub-sep"></div>
          <Link href="/holistico" className="hdr-sub-world">
            <span className="dot dot-rose"></span> Regalería Holística
          </Link>
          <div style={{ marginLeft: "auto", display: "flex", gap: 18, color: "var(--ink-soft)", fontSize: 12.5 }}>
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
