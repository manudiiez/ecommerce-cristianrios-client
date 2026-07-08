"use client";

import { useState } from "react";
import type { Kit } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { useCart } from "@/hooks/use-cart";

export function AddKitActions({ kit, totalPieces }: { kit: Kit; totalPieces: number }) {
  const cart = useCart();
  const [qty, setQty] = useState(1);

  const addKit = () => {
    cart.add({
      key: "kit|" + kit.id,
      id: kit.id,
      name: kit.name,
      world: kit.world,
      cat: "kit",
      isKit: true,
      sizeLabel: `${totalPieces} piezas`,
      finishLabel: "Combo",
      price: kit.price,
      qty,
    });
  };

  return (
    <div className="pdp-actions" style={{ margin: "18px 0 0" }}>
      <QtyStepper value={qty} onChange={setQty} />
      <button className="btn btn-dark" onClick={addKit}>
        <Ico.cart style={{ fontSize: 18 }} /> Agregar kit al pedido
      </button>
    </div>
  );
}
