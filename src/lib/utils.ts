type ClassValue = string | number | false | null | undefined;

/** Joiner de clases livianos — el sitio usa el CSS del design system (clases
 * semánticas + tokens), no utilidades de Tailwind, así que no hace falta
 * tailwind-merge acá. */
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function ars(n: number) {
  return "$" + n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
}

const STORE_WHATSAPP = "5492610000000";
const STORE_EMAIL = "hola@hannayesos.com.ar";

export function waLink(text: string) {
  return `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export function mailLink(subject: string, body: string) {
  return `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
