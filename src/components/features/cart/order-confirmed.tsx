"use client";

import type { Order, Store } from "@/lib/api";
import { LinkButton } from "@/components/ui/button";
import { Ico } from "@/components/ui/icon";
import { ars, cn } from "@/lib/utils";

const cstepClass = "flex items-start gap-[14px] rounded bg-paper-2 py-3.5 px-4";
const ciClass = "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-soft";
const ciDoneClass = "border-[#1f8a5b] bg-[#1f8a5b] text-white";

export function OrderConfirmed({ order, store }: { order: Order; store: Store }) {
  return (
    <main className="animate-fade-in" id="main">
      <div className="wrap" style={{ maxWidth: 680, padding: "60px 28px 20px" }}>
        <div className="rounded-lg border border-line bg-surface py-[46px] px-10 text-center shadow-[var(--shadow-brand)]">
          <div className="mx-auto mb-[18px] flex h-[84px] w-[84px] items-center justify-center rounded-full bg-clay-soft text-clay-deep">
            <Ico.check style={{ fontSize: 38 }} />
          </div>
          <span className="kicker" style={{ color: "var(--color-clay-deep)" }}>
            Pedido recibido
          </span>
          <h1 className="display" style={{ fontSize: "clamp(30px,4vw,44px)", margin: "6px 0 8px" }}>
            ¡Gracias, {order.nombre || "tu pedido está en camino"}!
          </h1>
          <p className="text-ink-soft" style={{ fontSize: 16, maxWidth: "46ch", margin: "0 auto" }}>
            Registramos tu pedido <b style={{ color: "var(--color-ink)" }}>{order.code}</b>. Lo está viendo el
            equipo de Hanna.
          </p>

          <div className="my-7 mx-auto flex max-w-[440px] flex-col gap-3 text-left">
            <div className={cstepClass}>
              <span className={cn(ciClass, ciDoneClass)}>
                <Ico.check />
              </span>
              <div>
                <b className="block text-[14.5px]">Pedido registrado</b>
                <small className="text-[13px] text-ink-soft">Quedó guardado con todo el detalle.</small>
              </div>
            </div>
            <div className={cstepClass}>
              <span className={ciClass}>
                <Ico.chat />
              </span>
              <div>
                <b className="block text-[14.5px]">Te contactamos</b>
                <small className="text-[13px] text-ink-soft">
                  Por {order.canal === "email" ? "email" : order.canal === "whatsapp" ? "WhatsApp" : "WhatsApp o email"}{" "}
                  para confirmar stock y precio final.
                </small>
              </div>
            </div>
            <div className={cstepClass}>
              <span className={ciClass}>
                <Ico.truck />
              </span>
              <div>
                <b className="block text-[14.5px]">Coordinamos pago y envío</b>
                <small className="text-[13px] text-ink-soft">Acordamos la forma de pago y la entrega a tu zona.</small>
              </div>
            </div>
          </div>

          <div className="mx-auto flex max-w-[440px] flex-col gap-1 rounded bg-paper-2 py-4 px-[18px]">
            <div className="flex items-baseline justify-between text-sm">
              <span>
                {order.count} piezas · {order.lines} ítems
              </span>
              <b className="font-display text-2xl font-semibold">{ars(order.total)}</b>
            </div>
            <small className="text-ink-soft">Total estimado — el precio final puede mejorar por cantidad (mayorista).</small>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
            <LinkButton href="/" variant="dark">
              Volver al inicio
            </LinkButton>
            <LinkButton href="/religioso" variant="ghost">
              Seguir comprando
            </LinkButton>
          </div>
          <p className="text-ink-soft" style={{ fontSize: 12.5, marginTop: 22 }}>
            ¿Algo urgente? Escribinos a {store.whatsappDisplay} o {store.email} mencionando tu código {order.code}.
          </p>
        </div>
      </div>
    </main>
  );
}
