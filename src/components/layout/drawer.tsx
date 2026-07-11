"use client";

import Image from "next/image";
import Link from "next/link";
import { Ico } from "@/components/ui/icon";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export function Drawer({ open, onClose }: DrawerProps) {
  if (!open) return null;

  return (
    <>
      <div className="drawer-scrim" onClick={onClose}></div>
      <div className="drawer">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <Link href="/" className="hdr-logo" onClick={onClose}>
            <Image src="/logo-hanna.png" alt="Hanna · Yesos y Aromas" width={46} height={46} />
            <div className="lt">
              <b>Hanna</b>
              <span>Yesos y Aromas</span>
            </div>
          </Link>
          <button className="hdr-menu-btn" style={{ display: "inline-flex" }} onClick={onClose}>
            <Ico.x style={{ fontSize: 20 }} />
          </button>
        </div>

        <Link href="/religioso" className="drawer-world" onClick={onClose}>
          <span className="dot dot-clay" style={{ display: "inline-block", width: 8, height: 8, borderRadius: 9 }}></span>
          Religioso
        </Link>
        <Link href="/holistico" className="drawer-world" onClick={onClose}>
          <span className="dot dot-rose" style={{ display: "inline-block", width: 8, height: 8, borderRadius: 9 }}></span>
          Regalería Holística
        </Link>

        <hr className="divider" style={{ margin: "14px 0" }} />
        <Link href="/kits" onClick={onClose}>
          Kits y combos
        </Link>
        <Link href="/ofertas-flash" style={{ color: "var(--flash)", fontWeight: 700 }} onClick={onClose}>
          ⚡ Ofertas Flash
        </Link>
        <Link href="/contacto" onClick={onClose}>
          Contacto
        </Link>
        <Link href="/pedido" onClick={onClose}>
          Mi pedido
        </Link>
      </div>
    </>
  );
}
