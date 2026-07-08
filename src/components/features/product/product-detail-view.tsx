"use client";

import { useState } from "react";
import type { Category, Finish, FinishId, Product, Size } from "@/lib/api";
import { ProductCard } from "@/components/features/catalog/product-card";
import { Ico } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { Placeholder } from "@/components/ui/placeholder";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { useCart } from "@/hooks/use-cart";
import { priceFor, worldAccent } from "@/lib/pricing";
import { ars, waLink } from "@/lib/utils";

const GALLERY_VIEWS = ["Frente", "Perfil", "Detalle", "Escala"];

interface ProductDetailViewProps {
  product: Product;
  category: Category;
  productSizes: Size[];
  allSizes: Record<string, Size>;
  finishes: Record<FinishId, Finish>;
  initialSizeId: string;
  related: Product[];
  categories: Category[];
}

export function ProductDetailView({
  product,
  category,
  productSizes,
  allSizes,
  finishes,
  initialSizeId,
  related,
  categories,
}: ProductDetailViewProps) {
  const cart = useCart();
  const [sizeId, setSizeId] = useState(initialSizeId);
  const [finishId, setFinishId] = useState<FinishId>(product.finishes[0]);
  const [qty, setQty] = useState(1);
  const [mainIdx, setMainIdx] = useState(0);

  const pr = priceFor(product, allSizes[sizeId], finishes[finishId], finishId);
  const savePct = pr.was ? Math.round((1 - pr.price / pr.was) * 100) : 0;
  const currentSize = allSizes[sizeId];

  const addToCart = () => {
    cart.add({
      key: `${product.id}|${sizeId}|${finishId}`,
      id: product.id,
      name: product.name,
      world: product.world,
      cat: product.cat,
      sizeLabel: currentSize?.label ?? sizeId,
      finishLabel: finishes[finishId]?.label ?? finishId,
      price: pr.price,
      qty,
    });
  };

  return (
    <>
      <div className="wrap pdp">
        {/* Galería */}
        <div className="pdp-gallery">
          <Placeholder
            world={product.world}
            cat={product.cat}
            label={product.name}
            tag={finishId === "pintada" ? "Pintada a mano" : "Yeso natural"}
            offset={mainIdx}
            style={{ aspectRatio: "1", borderRadius: "var(--radius-lg)" }}
          />
          <div className="pdp-thumbs">
            {GALLERY_VIEWS.map((v, i) => (
              <Placeholder
                key={v}
                world={product.world}
                cat={product.cat}
                label={product.name}
                offset={i}
                active={i === mainIdx}
                style={{ aspectRatio: "1", cursor: "pointer", borderRadius: "var(--radius)" }}
                onClick={() => setMainIdx(i)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="pdp-info">
          <span className="kicker" style={{ color: product.world === "religioso" ? "var(--clay-deep)" : "var(--rose-deep)" }}>
            {category.name}
          </span>
          <h1 className="display">{product.name}</h1>
          <div style={{ display: "flex", gap: 8, margin: "4px 0 0", flexWrap: "wrap" }}>
            {product.tag && <Pill kind={worldAccent(product.world)}>{product.tag}</Pill>}
            {product.discount && <Pill kind="sale">{product.discount.label}</Pill>}
          </div>
          <p className="blurb" style={{ marginTop: 16 }}>
            {product.blurb}
          </p>

          <div className="pdp-price">
            <span className="now">{ars(pr.price)}</span>
            {pr.was && <span className="was">{ars(pr.was)}</span>}
            {pr.was && (
              <span className="save" style={{ color: "var(--flash)" }}>
                Ahorrás {ars(pr.was - pr.price)} ({savePct}%)
              </span>
            )}
          </div>

          {/* TAMAÑO */}
          <div className="opt-group">
            <div className="lbl">
              <b>
                <Ico.ruler style={{ verticalAlign: "-2px", marginRight: 6 }} />
                Tamaño
              </b>
              <span className="sel">
                {currentSize ? currentSize.label : ""} · {ars(pr.price)}
              </span>
            </div>
            <div className="opt-row">
              {productSizes.map((s) => {
                const pp = priceFor(product, s, finishes[finishId], finishId);
                return (
                  <div key={s.id} className={"opt " + (s.id === sizeId ? "active" : "")} onClick={() => setSizeId(s.id)}>
                    <span className="ot">{s.label}</span>
                    <span className="os">{ars(pp.price)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TERMINACIÓN */}
          <div className="opt-group">
            <div className="lbl">
              <b>
                <Ico.brush style={{ verticalAlign: "-2px", marginRight: 6 }} />
                Terminación
              </b>
              <span className="sel">{finishes[finishId].label}</span>
            </div>
            <div className="opt-row">
              {product.finishes.map((fid) => {
                const f = finishes[fid];
                const hasFinishDisc = product.discount && product.discount.scope === `finish:${fid}`;
                return (
                  <div key={fid} className={"opt swatch " + (fid === finishId ? "active" : "")} onClick={() => setFinishId(fid)}>
                    <span className="sw" style={{ background: f.swatch }}></span>
                    <span>
                      <span className="ot">{f.label}</span>
                      <span className="os">{f.add > 0 ? `+${ars(f.add)}` : f.sub}</span>
                    </span>
                    {hasFinishDisc && (
                      <span className="opt-badge">
                        <Pill kind="sale">{product.discount!.label}</Pill>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CANTIDAD + ACCIONES */}
          <div className="pdp-actions">
            <QtyStepper value={qty} onChange={setQty} />
            <button className="btn btn-dark btn-lg" onClick={addToCart}>
              <Ico.cart style={{ fontSize: 18 }} /> Agregar al pedido
            </button>
            <a
              className="btn btn-wa"
              href={waLink(
                `¡Hola! Me interesa: ${product.name}\nTamaño: ${currentSize ? currentSize.label : sizeId}\nTerminación: ${finishes[finishId].label}\nCantidad: ${qty}\nPrecio ref.: ${ars(pr.price)} c/u`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              <Ico.wa style={{ fontSize: 18 }} /> Consultar
            </a>
          </div>
          <p className="muted" style={{ fontSize: 13, marginTop: -6 }}>
            No se paga en la web. Sumás al pedido y coordinamos pago y envío por WhatsApp o email.
          </p>

          <div className="pdp-meta">
            <div className="mrow">
              <span className="mi">
                <Ico.truck />
              </span>
              <div>
                <b>Envíos a todo el país.</b> <span className="muted">Coordinamos por correo o transporte según la zona.</span>
              </div>
            </div>
            <div className="mrow">
              <span className="mi">
                <Ico.box />
              </span>
              <div>
                <b>Precio mayorista y minorista.</b> <span className="muted">Por cantidad mejoramos el precio — consultanos.</span>
              </div>
            </div>
            <div className="mrow">
              <span className="mi">
                <Ico.brush />
              </span>
              <div>
                <b>Pintada a mano.</b> <span className="muted">Cada pieza pintada es única; puede variar levemente.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap section">
        <div className="sec-head">
          <div>
            <span className="kicker">También te puede gustar</span>
            <h2 style={{ fontSize: 30 }}>Relacionados</h2>
          </div>
        </div>
        <div className="grid grid-4">
          {related.map((rp) => {
            const cat = categories.find((c) => c.id === rp.cat);
            return (
              <ProductCard
                key={rp.id}
                product={rp}
                categoryName={cat?.name ?? ""}
                categoryHasDiscount={!!cat?.discount}
                allSizes={allSizes}
                finishes={finishes}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
