# Guía de datos y API para el backend de Hanna · Yesos y Aromas

## 1. Introducción

Este documento describe el **modelo de datos** y el **contrato de API** que necesita el backend real de la tienda, a partir de cómo funciona hoy el frontend Next.js (`client/`) con datos mock.

Está pensado para usarse **sin tener el código del frontend a mano**: sirve como especificación para construir el backend en cualquier tecnología (Python, Node.js, Payload CMS, etc.) en otro proyecto/repositorio.

### Punto de partida importante

Todo el frontend consume los datos a través de una única capa (`src/lib/api`, expuesta como el objeto `api`). Ningún componente ni página accede a los datos "crudos" directamente. Esa capa tiene dos implementaciones intercambiables por variable de entorno:

- **Mocks** (`src/lib/api/mocks/**`): arrays de TypeScript hardcodeados en `src/lib/api/mocks/data/*.ts`.
- **Servicios reales** (`src/lib/api/services/**`): stubs vacíos, uno por dominio, que hoy solo lanzan `Error("API not implemented")`.

Esto significa que **el backend real solo necesita respetar la forma de los datos y de las funciones** (mismos campos, mismas firmas `Promise<T>`) — no hace falta cambiar nada del frontend salvo implementar esos servicios y apagar el flag de mocks (`NEXT_PUBLIC_USE_MOCKS=false`).

### Los datos mock NO están relacionados de verdad

Es clave entender esto antes de diseñar el schema del backend: los mocks son **arrays independientes**, cada uno en su propio archivo, vinculados entre sí solo por **convención de IDs en string** (por ejemplo, `Product.cat` que "debería" coincidir con algún `Category.id`). No hay:

- Claves foráneas.
- Validación de que un ID referenciado exista.
- Validación cruzada (por ejemplo, que el `world` de un producto coincida con el `world` de su categoría).

El backend real es libre de convertir estas referencias sueltas en relaciones reales (FKs, relaciones de un ORM, `relationship` de Payload, etc.) — de hecho es lo recomendable. La sección 2 lista cada una de estas referencias.

---

## 2. Mapa de relaciones (hoy implícitas, por convención de string)

| Campo origen | Tipo hoy | Debería referenciar a | Notas |
|---|---|---|---|
| `Category.world` | `string` (`WorldId`) | `World.id` | Tipado como unión (`"religioso" \| "holistico"`), pero no verificado contra la lista real de mundos. |
| `Product.cat` | `string` | `Category.id` | Ej: `"jesus"`, `"virgen"`. Sin validación de existencia. |
| `Product.world` | `string` (`WorldId`) | `World.id` | No se verifica contra `Category.world` de su propia categoría — podrían quedar inconsistentes. |
| `Product.availableSizes[]` | `string[]` | `Size.id` | Los IDs están "scoped" por mundo por convención de prefijo (`r-15`…`r-70` para religioso, `h-mini`…`h-gigante` para holístico), pero nada impide poner un tamaño del otro mundo. |
| `Product.finishes[]` | `FinishId[]` | `Finish.id` | Al menos está tipado como unión (`"crudo" \| "pintada"`), pero no se valida que ese finish exista en el catálogo de finishes. |
| `Product.discount.scope` | `` "all" \| `finish:${FinishId}` `` | `Finish.id` (cuando no es `"all"`) | Se parsea manualmente con `scope.split(":")[1]` en el frontend. En el backend conviene modelarlo como dos campos (`scope: "all" | "finish"`, `finishId?`) en vez de un string compuesto. |
| `KitItem.productId` | `string?` (opcional) | `Product.id` | **Puede no existir.** Hay ítems de kit que son "solo WhatsApp" (aromáticos) y no están linkeados a ningún producto del catálogo. |
| `KitItem.sizeId` | `string?` | `Size.id` | Opcional, misma falta de validación que `availableSizes`. |
| `KitItem.finishId` | `FinishId?` | `Finish.id` | Opcional. |
| `Kit.world` | `string` (`WorldId`) | `World.id` | No se valida contra el `world` real de los productos que contiene. |
| `CartLine.id` | `string` | Ambiguo: `Product.id` **o** `Kit.id` **o** `FlashDeal.id` | Se desambigua solo con los flags booleanos `isKit` / `isFlash`. Es un antipatrón: el backend de checkout debería recibir/modelar esto como una unión discriminada explícita (`type: "product" | "kit" | "flash"`), no inferirlo de flags. |
| `CartLine.cat` | `string` | `Category.id` | Es una copia denormalizada de `Product.cat` tomada en el momento de agregar al carrito (no una referencia viva). |

---

## 3. Modelos de datos

A continuación, cada entidad con sus campos y un ejemplo real tomado de los datos mock. Los nombres de campos y tipos se mantienen en inglés (como están en el código) para que sirvan de referencia exacta al implementar el schema.

### Store (singleton)

Datos de contacto de la tienda. Un único registro.

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre de la marca |
| `tagline` | `string` | Bajada/slogan |
| `whatsapp` | `string` | Número en formato internacional sin `+` ni espacios (para armar links `wa.me`) |
| `whatsappDisplay` | `string` | Número formateado para mostrar |
| `email` | `string` | Email de contacto |
| `instagram` | `string` | Usuario de Instagram (con `@`) |

```json
{
  "name": "Hanna",
  "tagline": "Yesos y Aromas",
  "whatsapp": "5492610000000",
  "whatsappDisplay": "+54 9 261 000-0000",
  "email": "hola@hannayesos.com.ar",
  "instagram": "@hanna.yesosyaromas"
}
```

### World

Los dos "mundos" de catálogo de la tienda.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `"religioso" \| "holistico"` | Identificador único |
| `name` | `string` | Nombre visible |
| `kicker` | `string` | Texto corto de apoyo/categoría |
| `blurb` | `string` | Descripción breve |
| `accent` | `"clay" \| "rose"` | Color de acento visual asociado |

```json
{ "id": "religioso", "name": "Religioso", "kicker": "Devoción en yeso", "blurb": "...", "accent": "clay" }
```

Hoy hay exactamente **2** worlds: `religioso` y `holistico`.

### Category

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | `string` | sí | Identificador único (slug) |
| `world` | `WorldId` | sí | Mundo al que pertenece |
| `name` | `string` | sí | Nombre visible |
| `count` | `number` | sí | Cantidad de productos (hoy hardcodeado en el mock, no calculado) |
| `mode` | `"catalog" \| "whatsapp"` | sí | Ver sección 4 — determina si la categoría lista productos o redirige a WhatsApp |
| `discount` | `{ pct: number; label: string }` | no | Descuento aplicable a nivel categoría |
| `note` | `string` | no | Nota libre, usada sobre todo en categorías `whatsapp` |

```json
{ "id": "jesus", "world": "religioso", "name": "Jesús", "count": 14, "mode": "catalog" }
```

Categorías `mode: "whatsapp"` (hoy: `sahumerios`, `velas`, `inciensos`, todas de `world: "holistico"`) — ver sección 4 para el detalle de por qué son especiales.

### Size

**El precio vive en el tamaño, no en el producto.** Esta es la regla de pricing central de la tienda (ver sección 4).

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Ej: `"r-15"`, `"h-mini"` |
| `label` | `string` | Texto visible, ej. `"15 cm"` |
| `price` | `number` | Precio base (ARS) para ese tamaño, acabado `crudo` |
| `paintedAdd` | `number` | Monto adicional (ARS) si el acabado es `pintada` |

```json
{ "id": "r-15", "label": "15 cm", "price": 5200, "paintedAdd": 1500 }
```

Tamaños hoy: **6** para religioso (`r-15` … `r-70`), **5** para holístico (`h-mini` … `h-gigante`).

### Finish

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `"crudo" \| "pintada"` | Identificador |
| `label` | `string` | Texto visible |
| `sub` | `string` | Subtítulo/descripción corta |
| `add` | `number` | **Hoy siempre 0** en los datos mock — el recargo real de pintado vive en `Size.paintedAdd`, no acá. Posible inconsistencia de diseño a resolver en el backend (¿debería el recargo vivir en `Finish.add` en vez de en cada `Size`?) |
| `swatch` | `string` | Color hex para mostrar como muestra visual |

```json
{ "id": "crudo", "label": "Sin pintar", "sub": "Yeso natural", "add": 0, "swatch": "#ece4d6" }
```

Finishes hoy: exactamente **2**, `crudo` y `pintada`.

### Product

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | `string` | sí | Slug único |
| `cat` | `string` | sí | → `Category.id` |
| `world` | `WorldId` | sí | → `World.id` |
| `name` | `string` | sí | Nombre visible |
| `availableSizes` | `string[]` | sí | Lista de `Size.id` disponibles para este producto |
| `finishes` | `FinishId[]` | sí | Acabados disponibles (`crudo`, `pintada`, o ambos) |
| `blurb` | `string` | sí | Descripción corta |
| `tag` | `string` | no | Etiqueta libre, ej. `"Más vendido"` |
| `discount` | `ProductDiscount` | no | Ver abajo |

`ProductDiscount`:

| Campo | Tipo | Descripción |
|---|---|---|
| `pct` | `number` | Porcentaje de descuento |
| `label` | `string` | Texto a mostrar (ej. `"20% OFF"`) |
| `scope` | `` "all" \| `finish:${FinishId}` `` | A qué aplica el descuento — todo el producto, o solo un acabado específico |

```json
{
  "id": "jesus-sagrado-corazon",
  "cat": "jesus",
  "world": "religioso",
  "name": "Jesús · Sagrado Corazón",
  "availableSizes": ["r-15", "r-20", "r-30", "r-40"],
  "finishes": ["crudo", "pintada"],
  "blurb": "...",
  "tag": "Más vendido"
}
```

Hoy hay **24** productos (12 religioso + 12 holístico). **No existe un campo `featured`** — ver sección 4.

### Kit + KitItem

Un kit es un **combo de precio fijo**, no calculado a partir de sus componentes.

`KitItem`:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `name` | `string` | sí | Nombre visible del ítem dentro del kit |
| `qty` | `number` | sí | Cantidad |
| `productId` | `string?` | no | → `Product.id`. **Puede faltar** (ítems solo-WhatsApp, ej. aromáticos que no tienen ficha propia) |
| `sizeId` | `string?` | no | → `Size.id` |
| `finishId` | `FinishId?` | no | → `Finish.id` |

`Kit`:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | `string` | sí | Slug único |
| `world` | `WorldId` | sí | Mundo del kit |
| `name` | `string` | sí | Nombre visible |
| `blurb` | `string` | sí | Descripción |
| `items` | `KitItem[]` | sí | Componentes del kit |
| `price` | `number` | sí | Precio final fijo del combo |
| `regular` | `number` | sí | Precio de referencia "comprado por separado" (para mostrar el ahorro) |
| `note` | `string?` | no | Nota libre |
| `tag` | `string?` | no | Etiqueta libre |

```json
{
  "id": "kit-altar",
  "world": "religioso",
  "name": "Kit Altar",
  "blurb": "...",
  "items": [
    { "name": "Jesús Sagrado Corazón", "qty": 1, "productId": "jesus-sagrado-corazon", "sizeId": "r-20", "finishId": "pintada" }
  ],
  "price": 18000,
  "regular": 21500
}
```

Hoy hay **3** kits en total.

### FlashDeal + FlashVariant

Ofertas por tiempo limitado. **No están vinculadas a `Product` ni a `Kit`** — son entidades independientes con su propio precio fijo.

`FlashVariant`:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador de la variante |
| `label` | `string` | Texto visible (ej. color/sabor) |

`FlashDeal`:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Slug único |
| `name` | `string` | Nombre visible |
| `kicker` | `string` | Texto corto de apoyo |
| `blurb` | `string` | Descripción |
| `price` | `number` | Precio de oferta (fijo, igual para todas las variantes) |
| `regular` | `number` | Precio regular de referencia |
| `stockLeft` | `number` | Stock restante |
| `stockTotal` | `number` | Stock total inicial |
| `endsAt` | `number` | **Timestamp absoluto (epoch ms)** de fin de la oferta |
| `variants` | `FlashVariant[]` | Variantes disponibles (cosméticas — no cambian el precio) |

```json
{
  "id": "flash-vino-mundial",
  "name": "...",
  "price": 12000,
  "regular": 16000,
  "stockLeft": 7,
  "stockTotal": 20,
  "endsAt": 1720540800000,
  "variants": [{ "id": "tinto", "label": "Tinto" }]
}
```

⚠️ **Importante para el backend**: en el mock, `endsAt` **no está persistido** — se recalcula en cada request como `Date.now() + endsInMs` (un offset relativo). Esto hace que la cuenta regresiva "se resetee" cada vez que se llama al mock. **El backend real debe guardar `endsAt` como una fecha absoluta fija en la base de datos**, no recalcularla por request.

Hoy hay **3** flash deals.

### CartLine

Vive hoy en `localStorage` del navegador, no en ningún backend — pero el checkout la va a recibir como parte del payload de `POST /orders`, así que hay que modelarla igual.

| Campo | Tipo | Descripción |
|---|---|---|
| `key` | `string` | Clave única de línea (compuesta, ej. `productId\|sizeId\|finishId`, `"kit\|" + kitId`, `"flash\|" + dealId + "\|" + variantId`) |
| `id` | `string` | ID del producto/kit/deal referenciado (ambiguo, ver sección 2) |
| `name` | `string` | Nombre a mostrar |
| `world` | `WorldId \| "flash"` | Mundo, o literal `"flash"` para ítems de oferta flash |
| `cat` | `string` | Copia de `Product.cat` (o `"flash"` para flash) |
| `sizeLabel` | `string` | Texto de tamaño ya resuelto |
| `finishLabel` | `string` | Texto de acabado ya resuelto |
| `price` | `number` | Precio unitario ya calculado (post `priceFor()` o precio fijo de kit/flash) |
| `qty` | `number` | Cantidad |
| `isKit` | `boolean?` | Flag para distinguir que `id` apunta a un `Kit` |
| `isFlash` | `boolean?` | Flag para distinguir que `id` apunta a un `FlashDeal` |

> Recomendación de diseño para el backend: reemplazar `isKit`/`isFlash` por un campo único `type: "product" | "kit" | "flash"`.

### OrderForm

Datos de contacto capturados en el checkout.

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | `string?` | Nombre del cliente |
| `tel` | `string?` | Teléfono |
| `email` | `string?` | Email |
| `canal` | `string?` | Canal de contacto preferido (`"WhatsApp"`, `"Email"`, `"Cualquiera"`) |
| `tipo` | `string?` | Tipo de cliente (`"Público"`, `"Revendedor"`, `"Mayorista"`) |
| `notas` | `string?` | Notas libres |

### CreateOrderInput / Order

Payload de entrada y respuesta del endpoint de checkout.

`CreateOrderInput` (request):

```ts
{
  items: CartLine[];
  form: OrderForm;
  count: number;
  total: number;
}
```

`Order` (response):

| Campo | Tipo | Descripción |
|---|---|---|
| `code` | `string` | Código de pedido generado (hoy: `"HNN-" + random`) |
| `nombre` | `string` | Tomado de `form.nombre` |
| `count` | `number` | Cantidad total de ítems |
| `lines` | `number` | Cantidad de líneas distintas |
| `total` | `number` | Total del pedido |
| `canal` | `string` | Canal de contacto |

---

## 4. Reglas de negocio

### Pricing (producto individual)

El precio de un producto **no es un campo propio** — se calcula a partir del tamaño y el acabado elegidos:

```
finishAdd = (finish === "pintada") ? size.paintedAdd : 0
price     = size.price + finishAdd

si product.discount existe y aplica al finish elegido (scope "all" o "finish:<finishId>" coincidente):
    was   = price
    price = round100(price * (1 - discount.pct / 100))   // redondeo al múltiplo de 100 más cercano
```

Esta lógica hoy vive **enteramente en el cliente** (`src/lib/pricing.ts`, funciones `priceFor` / `round100`). El backend debería replicarla server-side (para no confiar en precios calculados por el cliente) o exponer un endpoint de cotización/pricing que reciba `productId + sizeId + finishId` y devuelva el precio final.

### Kits

El precio de un kit es **fijo y hardcodeado** (`Kit.price` / `Kit.regular`), no se deriva sumando el `priceFor()` de sus componentes. El "ahorro" mostrado es simplemente `regular - price`.

### Flash deals

El porcentaje de descuento mostrado no es un campo — se calcula inline como `Math.round((1 - price / regular) * 100)` en varios componentes del frontend. El backend puede optar por precalcularlo y exponerlo como campo, o dejar que el cliente lo derive igual que hoy.

### Categorías modo WhatsApp

Las categorías `sahumerios`, `velas`, `inciensos` (`Category.mode === "whatsapp"`) **nunca llegan a pedir productos a la API**: el frontend corta el flujo antes de llamar a `GET /products` y en su lugar muestra una lista de ejemplos **hardcodeada directamente en el componente del frontend** (no viene de ningún mock de datos), cada uno con un link `https://wa.me/...` con mensaje prellenado.

Gap a decidir en el backend: si se quiere que esos "productos" sean gestionables (por ejemplo desde un admin/CMS), hay que modelarlos igual que cualquier otro producto — hoy no existen como datos en absoluto, solo como texto fijo en el frontend.

### "Destacados" (featured)

No existe ningún campo `featured` en `Product`. Lo que hoy se muestra como "destacados" en la home es, literalmente, **"los primeros 4 productos del array, por mundo"** (`products.filter(p => p.world === world).slice(0, 4)`). Es un artefacto del orden del array mock, no una decisión de negocio real.

Recomendación: agregar un campo explícito (`featured: boolean`, o un campo de orden/prioridad) en el backend.

### Moneda

Los montos son enteros en ARS. Se formatean en el frontend con `n.toLocaleString("es-AR", { maximumFractionDigits: 0 })` con prefijo `"$"`. No hay implicancia de backend más allá de que los precios deben ser enteros (sin decimales).

---

## 5. Contrato de endpoints necesarios

Basado en cada método que el frontend llama hoy a través de `api.*`. Se agrupan por dominio, igual que la capa actual (`src/lib/api/services/*.service.ts`).

### Store
- `GET /store` → `Store` (singleton, sin parámetros).

### Catálogo (worlds, categories, sizes, finishes)
- `GET /worlds` → `World[]`
- `GET /categories` → `Category[]`
- `GET /categories/:id` → `Category | 404`
- `GET /sizes?world=religioso|holistico` → `Size[]` (tamaños de un mundo específico)
- `GET /sizes` → `Record<string, Size>` (todos los tamaños, como mapa por id — usado para resolver precios sin importar el mundo)
- `GET /finishes` → `Record<"crudo"|"pintada", Finish>`

### Products
- `GET /products?cat=&world=` → `Product[]`
  - Filtros hoy soportados por el mock: `cat` (exacto), `world` (exacto). Se combinan con AND.
  - **Gap importante**: el frontend hoy filtra client-side, sobre la lista completa ya traída, por tamaño (`sizeIds[]`) y por "solo con descuento" (`onlyOffers`) — ver `use-shop-filter.ts`. El backend real debería soportar estos filtros server-side (`sizeIds[]`, `onlyDiscounted`), además de **paginación y orden**, ninguno de los cuales existe hoy (el mock siempre devuelve el array completo).
- `GET /products/:id` → `Product | 404`
- `GET /products/:id/related?limit=4` → `Product[]`
  - Regla de armado: primero productos de la misma `cat` (excluyendo el propio); si no alcanzan el `limit`, completar con productos del mismo `world` mismo pero de otra `cat`, hasta el límite.

### Kits
- `GET /kits` → `Kit[]`
- `GET /kits/:id` → `Kit | 404`

### Flash deals
- `GET /flash` → `FlashDeal[]`
- `GET /flash/soonest` → `FlashDeal | null` (la oferta viva —`endsAt` en el futuro— que termina más pronto; usada para el banner/FAB global del sitio)
- `GET /flash/:id` → `FlashDeal | 404`
- Recordatorio: `endsAt` debe ser un timestamp persistido en la base, no recalculado.

### Orders (checkout)
- `POST /orders`
  - Body: `CreateOrderInput` (`{ items: CartLine[], form: OrderForm, count: number, total: number }`)
  - Response: `Order`
  - Nota: esto **no es un cobro online** — es captura de datos de contacto/pedido para que el dueño de la tienda lo cierre por WhatsApp/email. El mock actual literalmente comenta `// En producción: POST a la API → entra al CRM del dueño`. El backend real debería persistir el pedido completo (hoy el mock guarda todo en `localStorage` del navegador) y, potencialmente, notificar al dueño (email/WhatsApp/CRM).

### Lo que explícitamente NO existe hoy
- Sin endpoint de búsqueda/autocompletado de productos.
- Sin autenticación ni cuentas de usuario/cliente.
- Sin pagos online — el checkout es solo intake de datos de contacto.
- Sin gestión de stock real para productos (`stockLeft`/`stockTotal` solo existen en `FlashDeal`, no en `Product`).

---

## 6. Resumen de gaps y recomendaciones para el backend real

- **Paginación y orden** en `GET /products` — hoy no existe en absoluto.
- **Filtros server-side de catálogo**: tamaño (`sizeIds[]`) y "solo con descuento" (`onlyDiscounted`) hoy son 100% client-side.
- **Campo `featured`** explícito en `Product` (hoy es solo "los primeros 4 del array").
- **`endsAt` de `FlashDeal` como timestamp absoluto persistido**, no recalculado por request.
- **Validar/normalizar las referencias por string** listadas en la sección 2 como relaciones reales (FKs o su equivalente en la tecnología elegida).
- **Decidir el modelo de las categorías `mode: "whatsapp"`**: hoy sus "productos" no existen como datos en ningún lado (están hardcodeados en el frontend) — si se quieren gestionar desde el backend, hay que crearlos como entidad.
- **Reemplazar los flags `isKit`/`isFlash` de `CartLine`** por un campo discriminador único (`type: "product" | "kit" | "flash"`) al diseñar el modelo de pedido en el backend.
- **Replicar (o exponer como endpoint) la lógica de pricing** de `priceFor()` — hoy el cálculo de precio final con descuento ocurre enteramente en el cliente sobre datos crudos, lo cual no es confiable para un pedido real.
