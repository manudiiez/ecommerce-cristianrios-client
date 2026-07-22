"use client";

import Link from "next/link";
import type { Store } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { Logo } from "@/components/layout/header";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  store: Store;
}

const navLinkClass = "rounded py-[11px] px-3 font-medium cursor-pointer hover:bg-paper-2";

export function Drawer({ open, onClose, store }: DrawerProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-[rgba(20,16,10,.4)] backdrop-blur-[2px]" onClick={onClose}></div>
      <div className="fixed top-0 right-0 bottom-0 z-[81] flex w-[min(86vw,340px)] flex-col gap-1 overflow-y-auto border-l border-line bg-surface p-[22px]">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <Logo store={store} onClick={onClose} />
          <button
            className="inline-flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded border border-line-strong bg-surface"
            onClick={onClose}
          >
            <Ico.x style={{ fontSize: 20 }} />
          </button>
        </div>

        <Link href="/religioso" className="flex items-center gap-2 text-[15px] font-bold" onClick={onClose}>
          <span className="inline-block h-2 w-2 rounded-full bg-clay"></span>
          Religioso
        </Link>
        <Link href="/holistico" className="flex items-center gap-2 text-[15px] font-bold" onClick={onClose}>
          <span className="inline-block h-2 w-2 rounded-full bg-rose"></span>
          Regalería Holística
        </Link>

        <hr className="my-[14px] h-px border-0 bg-line" />
        <Link href="/kits" className={navLinkClass} onClick={onClose}>
          Kits y combos
        </Link>
        <Link href="/ofertas-flash" className={`${navLinkClass} text-flash font-bold`} onClick={onClose}>
          ⚡ Ofertas Flash
        </Link>
        <Link href="/contacto" className={navLinkClass} onClick={onClose}>
          Contacto
        </Link>
        <Link href="/pedido" className={navLinkClass} onClick={onClose}>
          Mi pedido
        </Link>
      </div>
    </>
  );
}
