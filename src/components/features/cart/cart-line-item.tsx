"use client";

import type { CartLine } from "@/lib/api";
import { Placeholder } from "@/components/ui/placeholder";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { useCart } from "@/hooks/use-cart";
import { ars } from "@/lib/utils";

export function CartLineItem({ item }: { item: CartLine }) {
  const cart = useCart();
  const isSpecial = item.cat === "kit" || item.cat === "flash";

  return (
    <div className="cart-line">
      <Placeholder
        world={item.world === "flash" ? undefined : item.world}
        cat={isSpecial ? undefined : item.cat}
        tint={item.isFlash ? "#3a2a22" : undefined}
        label={item.name}
        style={{ width: 92, height: 92, borderRadius: "var(--radius)", flexShrink: 0 }}
      />
      <div>
        <div className="cl-name">{item.name}</div>
        <div className="cl-opts">
          {item.sizeLabel}
          {item.finishLabel ? ` · ${item.finishLabel}` : ""}
        </div>
        <span className="cl-remove" onClick={() => cart.remove(item.key)}>
          Quitar
        </span>
      </div>
      <div className="cl-right">
        <QtyStepper value={item.qty} onChange={(q) => cart.setQty(item.key, q)} />
        <div className="cl-price">{ars(item.price * item.qty)}</div>
      </div>
    </div>
  );
}
