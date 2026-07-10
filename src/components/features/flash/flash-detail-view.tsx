"use client";

import { useState } from "react";
import type { FlashDeal } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { Placeholder } from "@/components/ui/placeholder";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { Countdown } from "@/components/ui/countdown";
import { useCart } from "@/hooks/use-cart";
import { ars } from "@/lib/utils";

export function FlashDetailView({ deal }: { deal: FlashDeal }) {
  const cart = useCart();
  const [variantId, setVariantId] = useState(deal.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const [mainIdx, setMainIdx] = useState(0);

  const variant = deal.variants.find((v) => v.id === variantId) ?? deal.variants[0];

  const addToCart = () => {
    cart.add({
      key: "flash|" + deal.id + "|" + variant.id,
      id: deal.id,
      name: deal.name,
      world: "flash",
      cat: "flash",
      isFlash: true,
      sizeLabel: variant.label,
      finishLabel: "Edición limitada",
      price: deal.price,
      qty,
    });
  };

  return (
    <div className="wrap pdp">
      <div className="pdp-gallery">
        <Placeholder tint="#3a2a22" label={deal.name} offset={mainIdx} style={{ aspectRatio: "1", borderRadius: "var(--radius-lg)" }} />
        <div className="pdp-thumbs">
          {[0, 1, 2].map((i) => (
            <Placeholder
              key={i}
              tint="#3a2a22"
              label={deal.name}
              offset={i}
              active={i === mainIdx}
              style={{ aspectRatio: "1", cursor: "pointer", borderRadius: "var(--radius)" }}
              onClick={() => setMainIdx(i)}
            />
          ))}
        </div>
      </div>

      <div className="pdp-info">
        <span className="pill pill-flash">
          <Ico.bolt style={{ fontSize: 13 }} /> Oferta Flash
        </span>
        <h1 className="display" style={{ margin: "8px 0" }}>
          {deal.name}
        </h1>
        <p className="blurb">{deal.blurb}</p>

        <div className="pdp-price">
          <span className="now">{ars(deal.price)}</span>
          <span className="was">{ars(deal.regular)}</span>
        </div>

        <p className="muted" style={{ fontSize: 13.5 }}>
          Quedan {deal.stockLeft} de {deal.stockTotal} unidades.
        </p>

        <div style={{ display: "inline-block", color: "#fff" }}>
          <span className="fx-ends-lbl" style={{ color: "var(--ink-soft)" }}>
            Termina en
          </span>
          <Countdown endsAt={deal.endsAt} />
        </div>

        <div className="opt-group">
          <div className="lbl">
            <b>Variante</b>
            <span className="sel">{variant.label}</span>
          </div>
          <div className="opt-row">
            {deal.variants.map((v) => (
              <div key={v.id} className={"opt " + (v.id === variantId ? "active" : "")} onClick={() => setVariantId(v.id)}>
                <span className="ot">{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pdp-actions">
          <QtyStepper value={qty} onChange={setQty} />
          <button className="btn btn-dark btn-lg" onClick={addToCart}>
            <Ico.cart style={{ fontSize: 18 }} /> Agregar al pedido
          </button>
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: -6 }}>
          No se paga en la web. Sumás al pedido y coordinamos pago y envío por WhatsApp o email.
        </p>
      </div>
    </div>
  );
}
