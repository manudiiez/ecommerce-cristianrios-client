"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/api";
import { Ico } from "@/components/ui/icon";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
}

export function Drawer({ open, onClose, categories }: DrawerProps) {
  if (!open) return null;
  const relig = categories.filter((c) => c.world === "religioso");
  const holi = categories.filter((c) => c.world === "holistico" && c.mode === "catalog");
  const wa = categories.filter((c) => c.mode === "whatsapp");

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

        <h4>
          <span className="dot dot-clay" style={{ display: "inline-block", width: 8, height: 8, borderRadius: 9, marginRight: 7 }}></span>
          Religioso
        </h4>
        {relig.map((c) => (
          <Link key={c.id} href={`/categoria/${c.id}`} onClick={onClose}>
            {c.name}
          </Link>
        ))}

        <h4>
          <span className="dot dot-rose" style={{ display: "inline-block", width: 8, height: 8, borderRadius: 9, marginRight: 7 }}></span>
          Regalería Holística
        </h4>
        {holi.map((c) => (
          <Link key={c.id} href={`/categoria/${c.id}`} onClick={onClose}>
            {c.name}
          </Link>
        ))}

        <h4>Solo por WhatsApp</h4>
        {wa.map((c) => (
          <Link key={c.id} href={`/categoria/${c.id}`} className="dc" onClick={onClose}>
            <Ico.wa style={{ fontSize: 16, color: "#25D366" }} />
            {c.name}
          </Link>
        ))}

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
