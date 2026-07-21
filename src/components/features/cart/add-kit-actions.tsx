"use client";

import { useState } from "react";
import type { Kit } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Ico } from "@/components/ui/icon";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { useCart } from "@/hooks/use-cart";
import { coverImage, mediaUrl } from "@/lib/images";

export function AddKitActions({ kit, totalPieces }: { kit: Kit; totalPieces: number }) {
  const cart = useCart();
  const [qty, setQty] = useState(1);

  const addKit = () => {
    const media = coverImage(kit.images);
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
      imageUrl: mediaUrl(media, "thumbnail"),
      imageAlt: media?.alt,
    });
  };

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3" style={{ margin: "18px 0 0" }}>
      <QtyStepper value={qty} onChange={setQty} />
      <Button variant="dark" onClick={addKit}>
        <Ico.cart style={{ fontSize: 18 }} /> Agregar kit al pedido
      </Button>
    </div>
  );
}
