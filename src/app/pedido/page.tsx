import { CartPageClient } from "@/components/features/cart/cart-page-client";
import { api } from "@/lib/api";

export default async function PedidoPage() {
  const store = await api.store.get();
  return <CartPageClient store={store} />;
}
