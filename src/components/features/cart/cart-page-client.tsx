"use client";

import { useEffect, useState } from "react";
import type { Order, OrderForm, Store } from "@/lib/api";
import { api } from "@/lib/api";
import { Crumb } from "@/components/features/catalog/crumb";
import { Button, LinkButton } from "@/components/ui/button";
import { Ico } from "@/components/ui/icon";
import { useCart } from "@/hooks/use-cart";
import { ars, cn } from "@/lib/utils";
import { CartLineItem } from "./cart-line-item";
import { OrderConfirmed } from "./order-confirmed";

const FORM_KEY = "hanna_form";
const optClass =
  "relative cursor-pointer rounded border-[1.5px] border-line-strong bg-surface py-3 px-4 min-w-[86px] transition duration-150 hover:border-ink-soft";
const optActiveClass = "border-ink bg-paper-2";
const fieldClass = "mb-3.5 flex flex-col gap-1.5";
const fieldLabelClass = "text-[12.5px] font-semibold tracking-[0.03em]";
const fieldInputClass =
  "rounded border-[1.5px] border-line-strong bg-surface py-3 px-3.5 font-[inherit] text-[14.5px] text-ink outline-none focus:border-ink";

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
      <main className="animate-fade-in" id="main">
        <Crumb trail={[{ label: "Inicio", href: "/" }, { label: "Mi pedido" }]} />
        <div className="wrap">
          <div className="px-5 py-20 text-center">
            <div className="mx-auto mb-5 flex h-[88px] w-[88px] rotate-[-4deg] items-center justify-center rounded-full border-[1.5px] border-line-strong font-script text-[46px] text-ink-soft">
              ✶
            </div>
            <h2 className="display" style={{ fontSize: 30, margin: "0 0 8px" }}>
              Tu pedido está vacío
            </h2>
            <p className="text-ink-soft" style={{ maxWidth: "40ch", margin: "0 auto 22px" }}>
              Sumá figuras, kits u ofertas flash y después coordinamos todo por WhatsApp o email.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <LinkButton href="/religioso" variant="clay">
                Ver Religioso
              </LinkButton>
              <LinkButton href="/holistico" variant="rose">
                Ver Holístico
              </LinkButton>
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
    <main className="animate-fade-in" id="main">
      <Crumb trail={[{ label: "Inicio", href: "/" }, { label: "Mi pedido" }]} />
      <div className="wrap cat-banner" style={{ paddingBottom: 6 }}>
        <span className="kicker">Sin pago online</span>
        <h1 className="display">Tu pedido</h1>
        <p>
          Revisá las piezas y confirmá el pedido con tus datos. Lo recibe el equipo de Hanna y te contacta por
          WhatsApp o email para coordinar pago y envío.
        </p>
      </div>

      <div className="wrap grid grid-cols-[1.6fr_1fr] items-start gap-9 py-2.5 max-[900px]:grid-cols-1" style={{ paddingTop: 24 }}>
        <div>
          {cart.items.map((i) => (
            <CartLineItem key={i.key} item={i} />
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            <LinkButton href="/" variant="ghost" size="sm">
              ← Seguir mirando
            </LinkButton>
            <Button variant="ghost" size="sm" onClick={() => cart.clear()}>
              Vaciar pedido
            </Button>
          </div>
        </div>

        <aside className="sticky top-[90px] rounded-lg border border-line bg-surface p-[26px] shadow-[var(--shadow-brand)]">
          <h3 className="font-display mb-4 text-2xl font-medium">Resumen</h3>
          <div className="flex justify-between py-[7px] text-sm text-ink-soft">
            <span>Piezas</span>
            <span>{cart.count}</span>
          </div>
          <div className="flex justify-between py-[7px] text-sm text-ink-soft">
            <span>Subtotal estimado</span>
            <span>{ars(cart.total)}</span>
          </div>
          <div className="flex justify-between py-[7px] text-sm text-ink-soft">
            <span>Envío</span>
            <span>A coordinar</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3.5 text-base text-ink">
            <span>Total estimado</span>
            <b className="font-display text-[30px] font-semibold">{ars(cart.total)}</b>
          </div>

          <div className="my-4 flex gap-2.5 rounded bg-paper-2 py-3.5 px-4 text-[13px] text-ink-soft">
            <Ico.shield style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }} /> No se paga en la web. Registrás
            el pedido y el equipo de Hanna te contacta para confirmar stock, precio final (mayorista si aplica)
            y forma de pago.
          </div>

          <div className={fieldClass}>
            <label className={fieldLabelClass}>Tu nombre *</label>
            <input
              className={fieldInputClass}
              value={form.nombre || ""}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder="Nombre y apellido"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className={fieldClass}>
              <label className={fieldLabelClass}>WhatsApp</label>
              <input
                className={fieldInputClass}
                value={form.tel || ""}
                onChange={(e) => set("tel", e.target.value)}
                placeholder="261 123 4567"
              />
            </div>
            <div className={fieldClass}>
              <label className={fieldLabelClass}>Email</label>
              <input
                className={fieldInputClass}
                value={form.email || ""}
                onChange={(e) => set("email", e.target.value)}
                placeholder="vos@correo.com"
              />
            </div>
          </div>
          <div className={fieldClass}>
            <label className={fieldLabelClass}>¿Cómo preferís que te contactemos?</label>
            <div className="flex flex-wrap gap-2">
              {["WhatsApp", "Email", "Cualquiera"].map((t) => (
                <div
                  key={t}
                  className={cn(optClass, form.canal === t && optActiveClass)}
                  style={{ minWidth: 0, flex: 1, textAlign: "center", padding: "10px 8px" }}
                  onClick={() => set("canal", t)}
                >
                  <span className="block text-sm font-semibold" style={{ fontSize: 13 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={fieldClass}>
            <label className={fieldLabelClass}>¿Comprás como?</label>
            <div className="flex flex-wrap gap-2">
              {["Público", "Revendedor", "Mayorista"].map((t) => (
                <div
                  key={t}
                  className={cn(optClass, form.tipo === t && optActiveClass)}
                  style={{ minWidth: 0, flex: 1, textAlign: "center", padding: "10px 8px" }}
                  onClick={() => set("tipo", t)}
                >
                  <span className="block text-sm font-semibold" style={{ fontSize: 13 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={fieldClass}>
            <label className={fieldLabelClass}>Notas (opcional)</label>
            <textarea
              className={fieldInputClass}
              rows={2}
              value={form.notas || ""}
              onChange={(e) => set("notas", e.target.value)}
              placeholder="Zona de envío, terminaciones, etc."
            />
          </div>

          <Button
            variant="dark"
            size="lg"
            block
            disabled={!valid || submitting}
            style={{ opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed" }}
            onClick={() => valid && submitOrder()}
          >
            <Ico.check style={{ fontSize: 19 }} /> Confirmar pedido
          </Button>
          <p className="text-ink-soft" style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}>
            {valid
              ? "El equipo de Hanna recibe tu pedido y te contacta para coordinar."
              : "Completá tu nombre y un medio de contacto para confirmar."}
          </p>
        </aside>
      </div>
    </main>
  );
}
