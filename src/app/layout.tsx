import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import { CartProvider } from "@/hooks/use-cart";
import { api } from "@/lib/api";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Hanna · Yesos y Aromas",
  description:
    "Figuras religiosas en yeso y regalería holística. Pedidos por WhatsApp o email, sin pago online.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, store, soonestFlash] = await Promise.all([
    api.catalog.getCategories(),
    api.store.get(),
    api.flash.getSoonest(),
  ]);

  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable} ${pinyon.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Saltar al contenido
        </a>
        <CartProvider>
          <SiteChrome categories={categories} store={store} soonestFlash={soonestFlash}>
            {children}
          </SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
