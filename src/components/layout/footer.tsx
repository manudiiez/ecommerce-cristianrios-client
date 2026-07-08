import Link from "next/link";
import type { Category, Store } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/button";
import { mailLink, waLink } from "@/lib/utils";

interface FooterProps {
  categories: Category[];
  store: Store;
}

export function Footer({ categories, store }: FooterProps) {
  const relig = categories.filter((c) => c.world === "religioso").slice(0, 5);
  const holi = categories.filter((c) => c.world === "holistico");

  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div className="brand">
          <b>Hanna</b>
          <span className="script" style={{ fontSize: 24 }}>
            Yesos y Aromas
          </span>
          <p style={{ maxWidth: "34ch", marginTop: 14, fontSize: 14, lineHeight: 1.6 }}>
            Distribuidora de figuras en yeso y regalería holística. Hacé tu pedido por la web y
            coordinamos pago y envío por WhatsApp o email.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <LinkButton
              variant="wa"
              size="sm"
              href={waLink("¡Hola Hanna! Quería hacer una consulta 🙂")}
              target="_blank"
              rel="noreferrer"
            >
              <Ico.wa /> WhatsApp
            </LinkButton>
            <LinkButton
              variant="ghost"
              size="sm"
              style={{ borderColor: "rgba(255,255,255,.25)", color: "var(--paper)" }}
              href={mailLink("Consulta", "Hola Hanna,")}
            >
              <Ico.mail /> Email
            </LinkButton>
          </div>
        </div>
        <div>
          <h5>Religioso</h5>
          <ul>
            {relig.map((c) => (
              <li key={c.id}>
                <Link href={`/categoria/${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>Holístico</h5>
          <ul>
            {holi.map((c) => (
              <li key={c.id}>
                <Link href={`/categoria/${c.id}`}>
                  {c.name}
                  {c.mode === "whatsapp" ? " ·wsp" : ""}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>La tienda</h5>
          <ul>
            <li>
              <Link href="/kits">Kits y combos</Link>
            </li>
            <li>
              <Link href="/ofertas-flash">Ofertas Flash</Link>
            </li>
            <li>
              <Link href="/contacto">Cómo comprar</Link>
            </li>
            <li style={{ marginTop: 8, opacity: 0.8 }}>{store.whatsappDisplay}</li>
            <li style={{ opacity: 0.8 }}>{store.email}</li>
            <li style={{ opacity: 0.8 }}>{store.instagram}</li>
          </ul>
        </div>
      </div>
      <div className="wrap ftr-bot">
        <span>© {new Date().getFullYear()} Hanna · Yesos y Aromas. Distribuidora mayorista y minorista.</span>
        <span>No se realizan pagos online — coordinamos por WhatsApp o email.</span>
      </div>
    </footer>
  );
}
