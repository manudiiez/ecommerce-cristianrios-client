const ITEMS = [
  "Envíos a todo el país",
  "Precios mayoristas y minoristas",
  "Pedido sin pago online",
  "Pintadas a mano",
  "Kits para revender",
  "Atención personal",
];

function Row() {
  return (
    <span className="inline-flex gap-12 text-[13px] font-semibold tracking-[0.08em] uppercase opacity-90">
      {ITEMS.map((t, i) => (
        <span key={i} style={{ display: "inline-flex", gap: 48 }}>
          ✦ {t}
        </span>
      ))}
    </span>
  );
}

export function Strip() {
  return (
    <div className="overflow-hidden bg-ink text-paper">
      <div className="flex animate-marquee gap-12 py-[13px] whitespace-nowrap">
        <Row />
        <Row />
      </div>
    </div>
  );
}
