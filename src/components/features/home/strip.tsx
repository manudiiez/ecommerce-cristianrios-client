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
    <span>
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
    <div className="strip">
      <div className="strip-track">
        <Row />
        <Row />
      </div>
    </div>
  );
}
