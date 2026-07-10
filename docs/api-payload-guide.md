# API Payload CMS — Hanna · Yesos y Aromas

Acá está la información que me solicitaste sobre la API en Payload CMS. Voy a ir agregando acá todos los endpoints y ejemplos de respuesta a medida que los vayas pasando, para tener una referencia centralizada y actualizada de la API.

Base URL local: `http://localhost:3000/api`

---

## Índice

- [Products](#products)
- [Categories](#categories)
- [Worlds](#worlds)
- [Sizes](#sizes)
- [Finishes](#finishes)
- [WhatsApp Items](#whatsapp-items)
- [Kits](#kits)
- [Flash Deals](#flash-deals)
- [Globals — Store](#globals--store)

---

## Products

### `GET /api/products` — Listar todos los productos

Respuesta paginada estándar de Payload (`docs`, `hasNextPage`, `totalDocs`, etc.). Cada producto trae `category` (con su `world` embebido), `world`, `availableSizes` (con precio y `paintedAdd` por tamaño) y `finishes` (con `swatch`).

```json
{
  "docs": [
    {
      "id": 24,
      "slug": "plato-ofrenda-redondo",
      "name": "Plato Ofrenda Redondo",
      "category": {
        "id": 6,
        "slug": "decorativos",
        "name": "Decorativos",
        "world": { "id": 2, "slug": "holistico", "name": "Holístico" },
        "mode": "catalog",
        "count": 4
      },
      "world": { "id": 2, "slug": "holistico", "name": "Holístico" },
      "availableSizes": [
        { "id": 7, "slug": "h-mini", "label": "Mini", "price": 2500, "paintedAdd": 1000, "order": 1 },
        { "id": 8, "slug": "h-chico", "label": "Chico", "price": 3800, "paintedAdd": 1400, "order": 2 },
        { "id": 9, "slug": "h-mediano", "label": "Mediano", "price": 5200, "paintedAdd": 1900, "order": 3 },
        { "id": 10, "slug": "h-grande", "label": "Grande", "price": 7200, "paintedAdd": 2600, "order": 4 },
        { "id": 11, "slug": "h-xl", "label": "Extra grande", "price": 9800, "paintedAdd": 3400, "order": 5 }
      ],
      "finishes": [
        { "id": 3, "slug": "crudo", "label": "Crudo", "sub": "Sin pintar", "swatch": "#d8c3a5" },
        { "id": 2, "slug": "pintada", "label": "Pintada", "sub": "Pintada a mano", "swatch": "#c97b63" }
      ],
      "blurb": "Plato redondo para ofrendas y sahumado.",
      "tag": null,
      "featured": false,
      "featuredOrder": null,
      "discount": { "pct": null, "label": null, "scope": "all", "finish": null }
    }
  ],
  "hasNextPage": true,
  "hasPrevPage": false,
  "limit": 3,
  "nextPage": 2,
  "page": 1,
  "totalDocs": 24,
  "totalPages": 8
}
```

> Nota: hay productos con `featured: true` y `featuredOrder` (para destacados en home), y productos con `discount.pct` / `discount.label` (ej. "10% OFF") con `discount.scope` y `discount.finish` para acotar el alcance del descuento.

### `GET /api/products/:id?depth=2&draft=false&locale=undefined&trash=false` — Producto por ID

Mismo shape que un item del listado, pero como objeto único (sin paginación).

```json
{
  "id": 24,
  "slug": "plato-ofrenda-redondo",
  "name": "Plato Ofrenda Redondo",
  "category": { "id": 6, "slug": "decorativos", "name": "Decorativos", "world": { "id": 2, "slug": "holistico", "name": "Holístico" } },
  "world": { "id": 2, "slug": "holistico", "name": "Holístico" },
  "availableSizes": [ /* igual estructura que en el listado */ ],
  "finishes": [ /* igual estructura que en el listado */ ],
  "blurb": "Plato redondo para ofrendas y sahumado.",
  "tag": null,
  "featured": false,
  "featuredOrder": null,
  "discount": { "pct": null, "label": null, "scope": "all", "finish": null }
}
```

---

## Categories

### `GET /api/categories` — Listar todas las categorías

Cada categoría trae su `world` embebido, un `mode` (`catalog` o `whatsapp`), `discount` propio, `note` (usado en modo whatsapp) y `count` de productos.

```json
{
  "docs": [
    { "id": 9, "slug": "inciensos", "name": "Inciensos", "world": { "id": 2, "slug": "holistico" }, "mode": "whatsapp", "note": "Ítems de consulta por WhatsApp, sin ficha de producto.", "count": 0 },
    { "id": 8, "slug": "velas", "name": "Velas", "world": { "id": 2, "slug": "holistico" }, "mode": "whatsapp", "count": 0 },
    { "id": 7, "slug": "sahumerios", "name": "Sahumerios", "world": { "id": 2, "slug": "holistico" }, "mode": "whatsapp", "count": 0 },
    { "id": 6, "slug": "decorativos", "name": "Decorativos", "world": { "id": 2, "slug": "holistico" }, "mode": "catalog", "count": 4 },
    { "id": 5, "slug": "portavelas", "name": "Portavelas", "world": { "id": 2, "slug": "holistico" }, "mode": "catalog", "count": 4 },
    { "id": 4, "slug": "figuras", "name": "Figuras", "world": { "id": 2, "slug": "holistico" }, "mode": "catalog", "count": 4 },
    { "id": 3, "slug": "angeles", "name": "Ángeles", "world": { "id": 1, "slug": "religioso" }, "mode": "catalog", "count": 4 },
    { "id": 2, "slug": "virgen", "name": "Virgen", "world": { "id": 1, "slug": "religioso" }, "mode": "catalog", "discount": { "pct": 10, "label": "10% OFF" }, "count": 4 },
    { "id": 1, "slug": "jesus", "name": "Jesús", "world": { "id": 1, "slug": "religioso" }, "mode": "catalog", "count": 4 }
  ],
  "hasNextPage": false,
  "totalDocs": 9,
  "totalPages": 1
}
```

> Nota: categorías con `mode: "whatsapp"` son de consulta directa por WhatsApp, sin ficha de producto propia (ver [WhatsApp Items](#whatsapp-items)).

### `GET /api/categories/:id?depth=2&draft=false&locale=undefined&trash=false` — Categoría por ID

```json
{
  "id": 1,
  "slug": "jesus",
  "name": "Jesús",
  "world": { "id": 1, "slug": "religioso", "name": "Religioso", "kicker": "Fe y devoción", "blurb": "Figuras religiosas en yeso, para el hogar y el altar.", "accent": "clay" },
  "mode": "catalog",
  "discount": { "pct": null, "label": null },
  "note": null,
  "count": 4
}
```

---

## Worlds

### `GET /api/worlds` — Listar todos los mundos

Un "mundo" agrupa categorías (ej. Holístico, Religioso) y define identidad visual (`accent`) y copy (`kicker`, `blurb`).

```json
{
  "docs": [
    { "id": 2, "slug": "holistico", "name": "Holístico", "kicker": "Bienestar y energía", "blurb": "Aromas, sahumerios y objetos para equilibrar espacios.", "accent": "rose" },
    { "id": 1, "slug": "religioso", "name": "Religioso", "kicker": "Fe y devoción", "blurb": "Figuras religiosas en yeso, para el hogar y el altar.", "accent": "clay" }
  ],
  "hasNextPage": false,
  "totalDocs": 2,
  "totalPages": 1
}
```

### `GET /api/worlds/:id?depth=2&draft=false&locale=undefined&trash=false` — Mundo por ID

```json
{ "id": 2, "slug": "holistico", "name": "Holístico", "kicker": "Bienestar y energía", "blurb": "Aromas, sahumerios y objetos para equilibrar espacios.", "accent": "rose" }
```

---

## Sizes

Colección centralizada de tamaños/precios (recordar: **el precio vive en el tamaño, no en el producto**). Cada size pertenece a un `world` y define `price`, `paintedAdd` (adicional por pintado a mano) y `order`.

### `GET /api/sizes` — Listar todos los tamaños

```json
{
  "docs": [
    { "id": 7, "slug": "h-mini", "label": "Mini", "world": { "id": 2, "slug": "holistico" }, "price": 2500, "paintedAdd": 1000, "order": 1 },
    { "id": 1, "slug": "r-10", "label": "10 cm", "world": { "id": 1, "slug": "religioso" }, "price": 3500, "paintedAdd": 1500, "order": 1 },
    { "id": 8, "slug": "h-chico", "label": "Chico", "world": { "id": 2, "slug": "holistico" }, "price": 3800, "paintedAdd": 1400, "order": 2 },
    { "id": 2, "slug": "r-15", "label": "15 cm", "world": { "id": 1, "slug": "religioso" }, "price": 4500, "paintedAdd": 1800, "order": 2 },
    { "id": 9, "slug": "h-mediano", "label": "Mediano", "world": { "id": 2, "slug": "holistico" }, "price": 5200, "paintedAdd": 1900, "order": 3 },
    { "id": 3, "slug": "r-20", "label": "20 cm", "world": { "id": 1, "slug": "religioso" }, "price": 6000, "paintedAdd": 2200, "order": 3 },
    { "id": 10, "slug": "h-grande", "label": "Grande", "world": { "id": 2, "slug": "holistico" }, "price": 7200, "paintedAdd": 2600, "order": 4 },
    { "id": 4, "slug": "r-25", "label": "25 cm", "world": { "id": 1, "slug": "religioso" }, "price": 7500, "paintedAdd": 2600, "order": 4 },
    { "id": 11, "slug": "h-xl", "label": "Extra grande", "world": { "id": 2, "slug": "holistico" }, "price": 9800, "paintedAdd": 3400, "order": 5 },
    { "id": 5, "slug": "r-30", "label": "30 cm", "world": { "id": 1, "slug": "religioso" }, "price": 9500, "paintedAdd": 3200, "order": 5 }
  ],
  "hasNextPage": true,
  "limit": 10,
  "nextPage": 2,
  "totalDocs": 11,
  "totalPages": 2
}
```

> Nota: existe también `r-40` ("40 cm", $13000, `paintedAdd` 4200, `order` 6) visto en el detalle de kits, en la página 2 de este listado.

### `GET /api/sizes/:id?depth=2&draft=false&locale=undefined&trash=false` — Tamaño por ID

```json
{ "id": 7, "slug": "h-mini", "label": "Mini", "world": { "id": 2, "slug": "holistico" }, "price": 2500, "paintedAdd": 1000, "order": 1 }
```

---

## Finishes

Acabados disponibles (crudo/sin pintar vs. pintado a mano), con `swatch` (color hex) para UI.

### `GET /api/finishes` — Listar todos los acabados

```json
{
  "docs": [
    { "id": 2, "slug": "pintada", "label": "Pintada", "sub": "Pintada a mano", "swatch": "#c97b63" },
    { "id": 1, "slug": "sin-pintar", "label": "Sin pintar", "sub": "Sin pintar", "swatch": "#d8c3a5" }
  ],
  "hasNextPage": false,
  "totalDocs": 2,
  "totalPages": 1
}
```

> Nota: en `products.finishes` aparece el slug `crudo` (id 3) como equivalente visual de "Sin pintar" — revisar si `crudo` y `sin-pintar` son el mismo concepto duplicado o dos entradas distintas en la colección.

### `GET /api/finishes/:id?depth=2&draft=false&locale=undefined&trash=false` — Acabado por ID

```json
{ "id": 2, "slug": "pintada", "label": "Pintada", "sub": "Pintada a mano", "swatch": "#c97b63" }
```

---

## WhatsApp Items

Ítems de consulta directa por WhatsApp (sin ficha de producto), asociados a categorías con `mode: "whatsapp"` (inciensos, velas, sahumerios). Incluyen `waMessage`, el texto prearmado para iniciar la conversación.

### `GET /api/whatsapp-items` — Listar todos los ítems de WhatsApp

```json
{
  "docs": [
    { "id": 7, "name": "Incienso Mirra", "category": { "id": 9, "slug": "inciensos" }, "blurb": "Caja x15 varillas de Mirra.", "waMessage": "Hola! Quiero consultar por el Incienso Mirra 🌿" },
    { "id": 6, "name": "Incienso Nag Champa", "category": { "id": 9, "slug": "inciensos" }, "blurb": "Caja x15 varillas Nag Champa.", "waMessage": "Hola! Quiero consultar por el Incienso Nag Champa 🌿" },
    { "id": 5, "name": "Vela Aromática Citronela", "category": { "id": 8, "slug": "velas" }, "blurb": "Vela de soja aromática, aroma citronela.", "waMessage": "Hola! Quiero consultar por la Vela Aromática Citronela 🕯️" },
    { "id": 4, "name": "Vela Aromática Vainilla", "category": { "id": 8, "slug": "velas" }, "blurb": "Vela de soja aromática, aroma vainilla.", "waMessage": "Hola! Quiero consultar por la Vela Aromática Vainilla 🕯️" },
    { "id": 3, "name": "Sahumerio Sándalo", "category": { "id": 7, "slug": "sahumerios" }, "blurb": "Caja x20 varillas de Sándalo.", "waMessage": "Hola! Quiero consultar por el Sahumerio Sándalo 🙏" },
    { "id": 2, "name": "Sahumerio Lavanda", "category": { "id": 7, "slug": "sahumerios" }, "blurb": "Caja x20 varillas de Lavanda.", "waMessage": "Hola! Quiero consultar por el Sahumerio Lavanda 🙏" },
    { "id": 1, "name": "Sahumerio Palo Santo", "category": { "id": 7, "slug": "sahumerios" }, "blurb": "Caja x20 varillas de Palo Santo.", "waMessage": "Hola! Quiero consultar por el Sahumerio Palo Santo 🙏" }
  ],
  "hasNextPage": false,
  "totalDocs": 7,
  "totalPages": 1
}
```

### `GET /api/whatsapp-items/:id?depth=2&draft=false&locale=undefined&trash=false` — Ítem de WhatsApp por ID

```json
{
  "id": 1,
  "name": "Sahumerio Palo Santo",
  "category": { "id": 7, "slug": "sahumerios", "mode": "whatsapp" },
  "blurb": "Caja x20 varillas de Palo Santo.",
  "waMessage": "Hola! Quiero consultar por el Sahumerio Palo Santo 🙏"
}
```

---

## Kits

Combos con **precio fijo** (`price` + `regular` para mostrar el ahorro), compuestos por `items[]`. Cada item puede:
- Referenciar un `product` real + `size` + `finish` (con `qty`), o
- Ser un ítem "de regalo" / genérico sin producto asociado (`product: null`, `size: null`, `finish: null`), como "Sahumerios surtidos" o "Vela aromática de regalo".

### `GET /api/kits` — Listar todos los kits

```json
{
  "docs": [
    {
      "id": 3,
      "slug": "kit-bienestar-total",
      "name": "Kit Bienestar Total",
      "blurb": "Buda Meditando, Portavelas Luna y sahumerios surtidos.",
      "world": { "id": 2, "slug": "holistico" },
      "items": [
        { "id": "6a5064ed4c853d28b38448f0", "name": "Buda Meditando chico crudo", "qty": 1, "product": { "id": 13, "slug": "buda-meditando", "name": "Buda Meditando" }, "size": { "id": 8, "slug": "h-chico", "price": 3800 }, "finish": null },
        { "id": "6a5064ed4c853d28b38448f1", "name": "Portavelas Luna mini crudo", "qty": 1, "product": { "id": 17, "slug": "portavelas-luna", "name": "Portavelas Luna" }, "size": { "id": 7, "slug": "h-mini", "price": 2500 }, "finish": null },
        { "id": "6a5064ed4c853d28b38448f2", "name": "Sahumerios surtidos", "qty": 3, "product": null, "size": null, "finish": null }
      ],
      "price": 15000,
      "regular": 19000,
      "note": null,
      "tag": "Combo"
    },
    {
      "id": 2,
      "slug": "kit-angeles-protectores",
      "name": "Kit Ángeles Protectores",
      "blurb": "Dos Ángeles de la Guarda para acompañar tu hogar.",
      "world": { "id": 1, "slug": "religioso" },
      "items": [
        { "id": "6a5064ed4c853d28b38448ee", "name": "Ángel de la Guarda 15 cm crudo", "qty": 2, "product": { "id": 9, "slug": "angel-de-la-guarda" }, "size": { "id": 2, "slug": "r-15", "price": 4500 }, "finish": null },
        { "id": "6a5064ed4c853d28b38448ef", "name": "Vela aromática de regalo", "qty": 1, "product": null, "size": null, "finish": null }
      ],
      "price": 9000,
      "regular": 11500,
      "note": null,
      "tag": null
    },
    {
      "id": 1,
      "slug": "kit-altar-familiar",
      "name": "Kit Altar Familiar",
      "blurb": "Jesús Sagrado Corazón y Virgen de Luján para armar tu altar en casa.",
      "world": { "id": 1, "slug": "religioso" },
      "items": [
        { "id": "6a5064ed4c853d28b38448eb", "name": "Jesús Sagrado Corazón 15 cm crudo", "qty": 1, "product": { "id": 1, "slug": "jesus-sagrado-corazon" }, "size": { "id": 2, "slug": "r-15", "price": 4500 }, "finish": null },
        { "id": "6a5064ed4c853d28b38448ec", "name": "Virgen de Luján 15 cm crudo", "qty": 1, "product": { "id": 5, "slug": "virgen-de-lujan" }, "size": { "id": 2, "slug": "r-15", "price": 4500 }, "finish": null },
        { "id": "6a5064ed4c853d28b38448ed", "name": "Sahumerio de regalo", "qty": 1, "product": null, "size": null, "finish": null }
      ],
      "price": 12000,
      "regular": 15000,
      "note": null,
      "tag": "Combo"
    }
  ],
  "hasNextPage": false,
  "totalDocs": 3,
  "totalPages": 1
}
```

> Nota: con `depth=2` cada `product` dentro de `items[]` viene expandido completo (category, world, availableSizes, finishes, etc. — igual shape que en `/api/products`).

### `GET /api/kits/:id?depth=2&draft=false&locale=undefined&trash=false` — Kit por ID

Mismo shape que un item del listado (objeto único, con `items[]` totalmente expandidos si `depth=2`).

```json
{
  "id": 3,
  "slug": "kit-bienestar-total",
  "name": "Kit Bienestar Total",
  "blurb": "Buda Meditando, Portavelas Luna y sahumerios surtidos.",
  "world": { "id": 2, "slug": "holistico" },
  "items": [ /* ver ejemplo del listado */ ],
  "price": 15000,
  "regular": 19000,
  "note": null,
  "tag": "Combo"
}
```

---

## Flash Deals

Productos/ofertas de tiempo limitado. A diferencia de products/kits, tienen `stockLeft`/`stockTotal`, `endsAt` (timestamp epoch en **milisegundos**) y `variantGroups[]` (grupos de variantes tipo talle/color/acabado/aroma, cada uno con `values[]`). No están necesariamente ligados a un `product` real — pueden ser ítems independientes (ej. remera).

### `GET /api/flash-deals` — Listar todas las ofertas flash

```json
{
  "docs": [
    {
      "id": 5,
      "slug": "remera-mundial",
      "name": "Remera de argentina 3 estrellas",
      "kicker": "Limitado",
      "blurb": "...",
      "price": 28000,
      "regular": 45000,
      "stockLeft": 4,
      "stockTotal": 10,
      "endsAt": 1785553200000,
      "variantGroups": [
        { "id": "6a50f4a6444d5ea37038df69", "slug": "colores", "name": "colores", "values": [
          { "id": "6a50f4b3444d5ea37038df6b", "slug": "negra", "label": "Negra" },
          { "id": "6a50f4bd444d5ea37038df6d", "slug": "blanca", "label": "Blanca" }
        ]},
        { "id": "6a50f4cd444d5ea37038df6f", "slug": "talles", "name": "Talle", "values": [
          { "id": "6a50f4d8444d5ea37038df71", "slug": "s", "label": "S" },
          { "id": "6a50f4de444d5ea37038df73", "slug": "m", "label": "M" },
          { "id": "6a50f4e3444d5ea37038df75", "slug": "l", "label": "L" },
          { "id": "6a50f4ea444d5ea37038df77", "slug": "xl", "label": "XL" }
        ]}
      ]
    },
    {
      "id": 3,
      "slug": "oferta-set-portavelas",
      "name": "Set Portavelas x2",
      "kicker": "Última semana",
      "blurb": "Combo de 2 portavelas a elección, acabado crudo.",
      "price": 8500,
      "regular": 11000,
      "stockLeft": 3,
      "stockTotal": 8,
      "endsAt": 1786071540000,
      "variantGroups": [
        { "id": "6a5064ee4c853d28b38448fe", "slug": "modelo", "name": "Modelo", "values": [
          { "id": "6a5064ee4c853d28b38448fc", "slug": "luna-mandala", "label": "Luna + Mandala" },
          { "id": "6a5064ee4c853d28b38448fd", "slug": "loto-geometrico", "label": "Flor de Loto + Geométrico" }
        ]}
      ]
    },
    {
      "id": 2,
      "slug": "oferta-buda-abundancia",
      "name": "Buda de la Abundancia Mediano",
      "kicker": "Tiempo limitado",
      "blurb": "Buda de la abundancia tamaño mediano con precio especial.",
      "price": 7000,
      "regular": 9200,
      "stockLeft": 6,
      "stockTotal": 12,
      "endsAt": 1784861940000,
      "variantGroups": [
        { "id": "6a5064ed4c853d28b38448f8", "slug": "acabado", "name": "Acabado", "values": [
          { "id": "6a5064ed4c853d28b38448f6", "slug": "crudo", "label": "Crudo" },
          { "id": "6a5064ed4c853d28b38448f7", "slug": "pintada", "label": "Pintada" }
        ]},
        { "id": "6a5064ed4c853d28b38448fb", "slug": "aroma", "name": "Aroma", "values": [
          { "id": "6a5064ed4c853d28b38448f9", "slug": "sandalo", "label": "Sándalo" },
          { "id": "6a5064ed4c853d28b38448fa", "slug": "lavanda", "label": "Lavanda" }
        ]}
      ]
    },
    {
      "id": 1,
      "slug": "oferta-jesus-sagrado-corazon",
      "name": "Jesús Sagrado Corazón 20 cm",
      "kicker": "Solo por hoy",
      "blurb": "Jesús Sagrado Corazón 20 cm, acabado a elección, con descuento especial.",
      "price": 5200,
      "regular": 6800,
      "stockLeft": 4,
      "stockTotal": 10,
      "endsAt": 1784257140000,
      "variantGroups": [
        { "id": "6a5064ed4c853d28b38448f5", "slug": "acabado", "name": "Acabado", "values": [
          { "id": "6a5064ed4c853d28b38448f3", "slug": "crudo", "label": "Crudo" },
          { "id": "6a5064ed4c853d28b38448f4", "slug": "pintada", "label": "Pintada" }
        ]}
      ]
    }
  ],
  "hasNextPage": false,
  "totalDocs": 4,
  "totalPages": 1
}
```

### `GET /api/flash-deals/:id?depth=2&draft=false&locale=undefined&trash=false` — Oferta flash por ID

```json
{
  "id": 5,
  "slug": "remera-mundial",
  "name": "Remera de argentina 3 estrellas",
  "kicker": "Limitado",
  "price": 28000,
  "regular": 45000,
  "stockLeft": 4,
  "stockTotal": 10,
  "endsAt": 1785553200000,
  "variantGroups": [ /* ver ejemplo del listado */ ]
}
```

---

## Globals — Store

Configuración global de la tienda (singleton, `globalType: "store"`).

### `GET /api/globals/store?depth=2&draft=false&locale=undefined&trash=false`

```json
{
  "id": 1,
  "name": "Hanna · Yesos y Aromas",
  "tagline": "Garantia de que nuestros productos son de calidad",
  "whatsapp": "5492615398384",
  "whatsappDisplay": "+54 9 261 539-8384",
  "email": "manudiez2003@gmail.com",
  "instagram": "hanna.yesosyaromas",
  "globalType": "store"
}
```

---

## Pendiente / por agregar

- [ ] Endpoint de `orders` (creación y consulta de pedidos)
- [ ] Cualquier endpoint de autenticación/admin si aplica
- [ ] Parámetros de query adicionales que se vayan usando (filtros, `where`, `sort`, etc.)

> Este documento se va actualizando a medida que se van pasando nuevos endpoints y respuestas de ejemplo.