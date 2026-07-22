"use server";

import { api, type CreateOrderInput, type Order } from "@/lib/api";

export async function createOrderAction(input: CreateOrderInput): Promise<Order> {
  return api.orders.create(input);
}
