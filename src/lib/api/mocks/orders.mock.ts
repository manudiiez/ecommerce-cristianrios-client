import type { CreateOrderInput, OrdersService } from "../services/orders.service";
import type { Order } from "../types";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const ORDERS_KEY = "hanna_orders";

function genCode() {
  return "HNN-" + Math.random().toString(36).slice(2, 6).toUpperCase() + (Date.now() % 1000);
}

export const ordersMock: OrdersService = {
  async create(input: CreateOrderInput) {
    await delay();
    const order: Order = {
      code: genCode(),
      nombre: (input.form.nombre ?? "").trim(),
      count: input.count,
      lines: input.items.length,
      total: input.total,
      canal: input.form.canal || "WhatsApp o email",
    };
    // En producción: POST a la API → entra al CRM del dueño.
    if (typeof window !== "undefined") {
      try {
        const prev = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
        prev.push({ ...order, when: Date.now(), items: input.items, form: input.form });
        localStorage.setItem(ORDERS_KEY, JSON.stringify(prev));
      } catch {
        // localStorage no disponible — no bloquea la confirmación del pedido
      }
    }
    return order;
  },
};
