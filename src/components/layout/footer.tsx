import Link from "next/link";
import type { Category, Store } from "@/lib/api";
import { Ico } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/button";
import { mailLink, waLink } from "@/lib/utils";

interface FooterProps {
  categories: Category[];
  store: Store;
}

const h5Class = "mb-3.5 text-xs tracking-[0.14em] text-paper uppercase";
const ulClass = "flex flex-col gap-[9px] text-sm list-none m-0 p-0";
const linkClass = "cursor-pointer hover:text-paper";

export function Footer({ categories, store }: FooterProps) {
  const relig = categories.filter((c) => c.world === "religioso").slice(0, 5);
  const holi = categories.filter((c) => c.world === "holistico");

  return (
    <footer className="mt-[70px] bg-ink text-[color-mix(in_oklab,var(--color-paper)_80%,transparent)]">
      <div className="wrap grid grid-cols-[1.5fr_1fr_1fr_1.4fr] gap-9 pt-14 pb-10 max-[820px]:grid-cols-2 max-[820px]:gap-7 max-[480px]:grid-cols-1">
        <div>
          <b className="font-display block text-[26px] text-paper">{store.name}</b>
          {store.tagline && <span className="script text-[22px] text-rose">{store.tagline}</span>}
          <p style={{ maxWidth: "34ch", marginTop: 14, fontSize: 14, lineHeight: 1.6 }}>
            Distribuidora de figuras en yeso y regalería holística. Hacé tu pedido por la web y
            coordinamos pago y envío por WhatsApp o email.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <LinkButton
              variant="wa"
              size="sm"
              href={waLink(store.whatsapp, `¡Hola ${store.name}! Quería hacer una consulta 🙂`)}
              target="_blank"
              rel="noreferrer"
            >
              <Ico.wa /> WhatsApp
            </LinkButton>
            <LinkButton
              variant="ghost"
              size="sm"
              style={{ borderColor: "rgba(255,255,255,.25)", color: "var(--color-paper)" }}
              href={mailLink(store.email, "Consulta", `Hola ${store.name},`)}
            >
              <Ico.mail /> Email
            </LinkButton>
          </div>
        </div>
        <div>
          <h5 className={h5Class}>Religioso</h5>
          <ul className={ulClass}>
            {relig.map((c) => (
              <li key={c.id}>
                <Link href={`/categoria/${c.id}`} className={linkClass}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className={h5Class}>Holístico</h5>
          <ul className={ulClass}>
            {holi.map((c) => (
              <li key={c.id}>
                <Link href={`/categoria/${c.id}`} className={linkClass}>
                  {c.name}
                  {c.mode === "whatsapp" ? " ·wsp" : ""}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className={h5Class}>La tienda</h5>
          <ul className={ulClass}>
            <li>
              <Link href="/kits" className={linkClass}>
                Kits y combos
              </Link>
            </li>
            <li>
              <Link href="/ofertas-flash" className={linkClass}>
                Ofertas Flash
              </Link>
            </li>
            <li>
              <Link href="/contacto" className={linkClass}>
                Cómo comprar
              </Link>
            </li>
            <li style={{ marginTop: 8, opacity: 0.8 }}>{store.whatsappDisplay ?? store.whatsapp}</li>
            <li style={{ opacity: 0.8 }}>{store.email}</li>
            {store.instagram && <li style={{ opacity: 0.8 }}>{store.instagram}</li>}
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-wrap justify-between gap-4 border-t border-[rgba(255,255,255,.12)] py-5 text-[12.5px]">
        <span>
          © {new Date().getFullYear()} {store.name}
          {store.tagline ? ` · ${store.tagline}` : ""}. Distribuidora mayorista y minorista.
        </span>
        <span>No se realizan pagos online — coordinamos por WhatsApp o email.</span>
      </div>
    </footer>
  );
}
