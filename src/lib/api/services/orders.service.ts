import { mapOrder, type PayloadOrder, type PayloadOrderItem } from "../payload/adapters";
import { payloadPost } from "../payload/client";
import type { CartLine, Order, OrderForm } from "../types";

export interface CreateOrderInput {
  items: CartLine[];
  form: OrderForm;
}

export interface OrdersService {
  create(input: CreateOrderInput): Promise<Order>;
}

function toOrderItem(line: CartLine): PayloadOrderItem {
  const type: PayloadOrderItem["type"] = line.isKit ? "kit" : line.isFlash ? "flash" : "product";
  const base: PayloadOrderItem = {
    type,
    refId: line.id,
    name: line.name,
    unitPrice: line.price,
    qty: line.qty,
  };
  if (type === "product") {
    if (!line.sizeId || !line.finishId) {
      throw new Error(`Falta tamaño o terminación para "${line.name}" — volvé a agregarlo al pedido.`);
    }
    base.sizeSlug = line.sizeId;
    base.finishSlug = line.finishId;
    base.sizeLabel = line.sizeLabel;
    base.finishLabel = line.finishLabel;
  }
  return base;
}

export const ordersService: OrdersService = {
  async create(input) {
    const raw = await payloadPost<PayloadOrder>("/orders", {
      form: input.form,
      items: input.items.map(toOrderItem),
    });
    console.log(JSON.stringify(raw)) 
    return mapOrder(raw);
  },
};
