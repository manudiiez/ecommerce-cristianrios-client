"use client";

import Link from "next/link";
import type { Order, Store } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { ars } from "@/lib/utils";

export function OrderConfirmed({ order, store }: { order: Order; store: Store }) {
  return (
    <main className="fade-in" id="main">
      <div className="wrap" style={{ maxWidth: 680, padding: "60px 28px 20px" }}>
        <div className="confirm-card">
          <div className="confirm-ring">
            <Ico.check style={{ fontSize: 38 }} />
          </div>
          <span className="kicker" style={{ color: "var(--clay-deep)" }}>
            Pedido recibido
          </span>
          <h1 className="display" style={{ fontSize: "clamp(30px,4vw,44px)", margin: "6px 0 8px" }}>
            ¡Gracias, {order.nombre || "tu pedido está en camino"}!
          </h1>
          <p className="muted" style={{ fontSize: 16, maxWidth: "46ch", margin: "0 auto" }}>
            Registramos tu pedido <b style={{ color: "var(--ink)" }}>{order.code}</b>. Lo está viendo el
            equipo de Hanna.
          </p>

          <div className="confirm-steps">
            <div className="cstep done">
              <span className="ci">
                <Ico.check />
              </span>
              <div>
                <b>Pedido registrado</b>
                <small>Quedó guardado con todo el detalle.</small>
              </div>
            </div>
            <div className="cstep">
              <span className="ci">
                <Ico.chat />
              </span>
              <div>
                <b>Te contactamos</b>
                <small>
                  Por {order.canal === "Email" ? "email" : order.canal === "WhatsApp" ? "WhatsApp" : "WhatsApp o email"}{" "}
                  para confirmar stock y precio final.
                </small>
              </div>
            </div>
            <div className="cstep">
              <span className="ci">
                <Ico.truck />
              </span>
              <div>
                <b>Coordinamos pago y envío</b>
                <small>Acordamos la forma de pago y la entrega a tu zona.</small>
              </div>
            </div>
          </div>

          <div className="confirm-resume">
            <div className="cr-row">
              <span>
                {order.count} piezas · {order.lines} ítems
              </span>
              <b>{ars(order.total)}</b>
            </div>
            <small className="muted">Total estimado — el precio final puede mejorar por cantidad (mayorista).</small>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
            <Link href="/" className="btn btn-dark">
              Volver al inicio
            </Link>
            <Link href="/religioso" className="btn btn-ghost">
              Seguir comprando
            </Link>
          </div>
          <p className="muted" style={{ fontSize: 12.5, marginTop: 22 }}>
            ¿Algo urgente? Escribinos a {store.whatsappDisplay} o {store.email} mencionando tu código {order.code}.
          </p>
        </div>
      </div>
    </main>
  );
}
