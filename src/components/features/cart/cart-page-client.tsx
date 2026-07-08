"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order, OrderForm, Store } from "@/lib/api";
import { api } from "@/lib/api";
import { Crumb } from "@/components/features/catalog/crumb";
import { Ico } from "@/components/ui/icon";
import { useCart } from "@/hooks/use-cart";
import { ars } from "@/lib/utils";
import { CartLineItem } from "./cart-line-item";
import { OrderConfirmed } from "./order-confirmed";

const FORM_KEY = "hanna_form";

function readSavedForm(): OrderForm {
  try {
    return JSON.parse(localStorage.getItem(FORM_KEY) || "{}");
  } catch {
    return {};
  }
}

export function CartPageClient({ store }: { store: Store }) {
  const cart = useCart();
  const [form, setForm] = useState<OrderForm>({});
  const [confirmed, setConfirmed] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // diferido (no sincrónico) para no chocar con el render de hidratación del servidor
    const kickoff = setTimeout(() => setForm(readSavedForm()), 0);
    return () => clearTimeout(kickoff);
  }, []);

  const set = (k: keyof OrderForm, v: string) => {
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      localStorage.setItem(FORM_KEY, JSON.stringify(next));
      return next;
    });
  };

  if (confirmed) return <OrderConfirmed order={confirmed} store={store} />;

  if (cart.items.length === 0) {
    return (
      <main className="fade-in" id="main">
        <Crumb trail={[{ label: "Inicio", href: "/" }, { label: "Mi pedido" }]} />
        <div className="wrap">
          <div className="empty-state">
            <div className="ring">✶</div>
            <h2 className="display" style={{ fontSize: 30, margin: "0 0 8px" }}>
              Tu pedido está vacío
            </h2>
            <p className="muted" style={{ maxWidth: "40ch", margin: "0 auto 22px" }}>
              Sumá figuras, kits u ofertas flash y después coordinamos todo por WhatsApp o email.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/religioso" className="btn btn-clay">
                Ver Religioso
              </Link>
              <Link href="/holistico" className="btn btn-rose">
                Ver Holístico
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const valid = (form.nombre || "").trim().length > 1 && (form.tel || form.email || "").trim().length > 4;

  const submitOrder = async () => {
    setSubmitting(true);
    const order = await api.orders.create({
      items: cart.items,
      form,
      count: cart.count,
      total: cart.total,
    });
    cart.clear();
    localStorage.removeItem(FORM_KEY);
    setConfirmed(order);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <main className="fade-in" id="main">
      <Crumb trail={[{ label: "Inicio", href: "/" }, { label: "Mi pedido" }]} />
      <div className="wrap cat-banner" style={{ paddingBottom: 6 }}>
        <span className="kicker">Sin pago online</span>
        <h1 className="display">Tu pedido</h1>
        <p>
          Revisá las piezas y confirmá el pedido con tus datos. Lo recibe el equipo de Hanna y te contacta por
          WhatsApp o email para coordinar pago y envío.
        </p>
      </div>

      <div className="wrap cart" style={{ paddingTop: 24 }}>
        <div>
          {cart.items.map((i) => (
            <CartLineItem key={i.key} item={i} />
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            <Link href="/" className="btn btn-ghost btn-sm">
              ← Seguir mirando
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={() => cart.clear()}>
              Vaciar pedido
            </button>
          </div>
        </div>

        <aside className="cart-summary">
          <h3>Resumen</h3>
          <div className="sl">
            <span>Piezas</span>
            <span>{cart.count}</span>
          </div>
          <div className="sl">
            <span>Subtotal estimado</span>
            <span>{ars(cart.total)}</span>
          </div>
          <div className="sl">
            <span>Envío</span>
            <span>A coordinar</span>
          </div>
          <div className="sl total">
            <span>Total estimado</span>
            <b>{ars(cart.total)}</b>
          </div>

          <div className="cart-note">
            <Ico.shield style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }} /> No se paga en la web. Registrás
            el pedido y el equipo de Hanna te contacta para confirmar stock, precio final (mayorista si aplica)
            y forma de pago.
          </div>

          <div className="field">
            <label>Tu nombre *</label>
            <input value={form.nombre || ""} onChange={(e) => set("nombre", e.target.value)} placeholder="Nombre y apellido" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>WhatsApp</label>
              <input value={form.tel || ""} onChange={(e) => set("tel", e.target.value)} placeholder="261 123 4567" />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="vos@correo.com" />
            </div>
          </div>
          <div className="field">
            <label>¿Cómo preferís que te contactemos?</label>
            <div className="opt-row" style={{ gap: 8 }}>
              {["WhatsApp", "Email", "Cualquiera"].map((t) => (
                <div
                  key={t}
                  className={"opt " + (form.canal === t ? "active" : "")}
                  style={{ minWidth: 0, flex: 1, textAlign: "center", padding: "10px 8px" }}
                  onClick={() => set("canal", t)}
                >
                  <span className="ot" style={{ fontSize: 13 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="field">
            <label>¿Comprás como?</label>
            <div className="opt-row" style={{ gap: 8 }}>
              {["Público", "Revendedor", "Mayorista"].map((t) => (
                <div
                  key={t}
                  className={"opt " + (form.tipo === t ? "active" : "")}
                  style={{ minWidth: 0, flex: 1, textAlign: "center", padding: "10px 8px" }}
                  onClick={() => set("tipo", t)}
                >
                  <span className="ot" style={{ fontSize: 13 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Notas (opcional)</label>
            <textarea
              rows={2}
              value={form.notas || ""}
              onChange={(e) => set("notas", e.target.value)}
              placeholder="Zona de envío, terminaciones, etc."
            />
          </div>

          <button
            className="btn btn-dark btn-block btn-lg"
            disabled={!valid || submitting}
            style={{ opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed" }}
            onClick={() => valid && submitOrder()}
          >
            <Ico.check style={{ fontSize: 19 }} /> Confirmar pedido
          </button>
          <p className="muted" style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}>
            {valid
              ? "El equipo de Hanna recibe tu pedido y te contacta para coordinar."
              : "Completá tu nombre y un medio de contacto para confirmar."}
          </p>
        </aside>
      </div>
    </main>
  );
}
