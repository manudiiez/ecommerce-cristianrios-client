import type { CartLine, Order, OrderForm } from "../types";

export interface CreateOrderInput {
  items: CartLine[];
  form: OrderForm;
  count: number;
  total: number;
}

export interface OrdersService {
  create(input: CreateOrderInput): Promise<Order>;
}

export const ordersService: OrdersService = {
  create() {
    throw new Error("API not implemented");
  },
};
