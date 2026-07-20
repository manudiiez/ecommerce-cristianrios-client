---
name: css-to-tailwind
description: Migra estilos CSS existentes (CSS plano, CSS Modules, styled-components, SCSS o estilos inline) a Tailwind CSS manteniendo el resultado visual EXACTAMENTE igual, siguiendo las mejores prácticas de Tailwind (tokens en theme, sin valores arbitrarios innecesarios, variantes con cva/mapas, clases ordenadas). Usar esta skill SIEMPRE que el usuario pida "pasar a Tailwind", "migrar los estilos", "convertir CSS a Tailwind", "tailwindear" un componente/proyecto, o quiera reemplazar archivos .css/.module.css/.scss por clases utility — incluso si solo menciona un componente suelto.
---

# CSS → Tailwind (con paridad visual)

Migra CSS existente a Tailwind sin cambiar cómo se ve nada. La regla de oro: **esto es una migración, no un rediseño**. Cada decisión que "mejoraría" el diseño (redondear un padding de 18px a 16px, unificar dos grises casi iguales) rompe la paridad visual y está prohibida salvo aprobación explícita del usuario.

## Principios

1. **Paridad visual primero, pureza de Tailwind segundo.** Si un valor no mapea a la escala de Tailwind, usar valor arbitrario (`p-[18px]`) o un token custom — nunca "el más cercano de la escala". Aproximar valores es el error #1 de estas migraciones.
2. **Tokens antes que clases.** Los valores repetidos del CSS (colores, fuentes, radios, sombras) se extraen primero al theme. Los componentes usan `bg-primary`, no `bg-[#e85d3a]` repetido 30 veces.
3. **Valores arbitrarios solo para valores únicos.** `w-[137px]` está bien si aparece una vez y es deliberado. Si un valor arbitrario se repite en 3+ lugares, es un token que faltó extraer.
4. **Migrar y borrar.** Un componente migrado no conserva su `.module.css` ni clases CSS muertas. CSS que Tailwind no puede expresar razonablemente (animaciones complejas con keyframes múltiples, selectores muy específicos) queda en CSS, documentado con un comentario de por qué.

## Flujo de trabajo

### Paso 0 — Detectar versión de Tailwind

Antes de nada: ¿el proyecto ya tiene Tailwind? ¿v3 (existe `tailwind.config.{ts,js}`) o v4 (`@import "tailwindcss"` + `@theme` en CSS)? Si hay que instalarlo, usar v4 salvo que el usuario pida v3. Esto determina dónde viven los tokens (ver `references/token-mapping.md`).

### Paso 1 — Inventariar el CSS de origen

Leer TODO el CSS a migrar antes de tocar el primer componente:

- **Valores repetidos** → candidatos a tokens: colores, familias/pesos tipográficos, radios, sombras, spacings recurrentes, breakpoints custom, z-indexes.
- **Variables CSS existentes** (`:root { --color-... }`) → migran casi 1:1 al theme; conservar los nombres si son semánticos.
- **Casos difíciles** a listar por adelantado: `@keyframes`, pseudo-elementos con contenido, selectores descendientes complejos (`.card:hover .title`), `@media` no estándar, `calc()` anidados, estilos sobre HTML generado externamente (markdown, CMS). Decidir para cada uno: utilidad Tailwind, valor arbitrario, `@layer components`, o dejar en CSS.
- **CSS muerto**: selectores que ningún markup usa. Confirmar con grep y NO migrarlos — pero avisar al usuario de qué se descartó.

### Paso 2 — Construir el theme

Volcar los tokens del inventario al theme (v4: `@theme` en el CSS global; v3: `theme.extend` en config). Reglas en `references/token-mapping.md`. Nombrar por rol semántico (`primary`, `surface`, `text-muted`), no por valor (`orange`, `gray-2`).

### Paso 3 — Migrar componente por componente

Orden: primitivos/hoja más usados primero (botones, cards), páginas al final. Por cada componente:

1. Traducir cada declaración con la tabla de `references/css-equivalences.md`. Ante la duda de si `X` equivale exactamente a `y-Z` de Tailwind, verificar el valor real (la escala default: `p-4` = 1rem = 16px) — no confiar en la memoria.
2. Estados y variantes: `:hover` → `hover:`, `:focus-visible` → `focus-visible:`, media queries → prefijos responsive (`md:`), `@media (prefers-reduced-motion)` → `motion-reduce:`, dark mode → `dark:` si el proyecto lo usa.
3. Selectores dependientes del padre (`.card:hover .title`) → `group`/`group-hover:`; hermanos → `peer`. Si la cadena es muy compleja, es un caso legítimo para CSS.
4. Variantes del componente (`.button.primary`, `.button.large`): NO concatenar strings gigantes con ternarios. Usar un mapa de variantes u objeto `cva` (ver `references/css-equivalences.md`, sección variantes) + `cn()` (clsx + tailwind-merge) para composición.
5. Orden de clases consistente: layout → box model (spacing/size) → tipografía → color/fondo → borde/sombra → estados/responsive. Si el proyecto tiene Prettier, instalar `prettier-plugin-tailwindcss` y dejar que lo haga solo.
6. Borrar el CSS de origen del componente migrado en el mismo commit/paso.

### Paso 4 — Verificar paridad

- **Diff de valores**: para cada componente, repasar el CSS original contra las clases: ¿cada `color`, `padding`, `font-size` tiene su equivalente con el MISMO valor computado? Los sospechosos habituales: `line-height` (el CSS suelto suele diferir de los pares font-size/line-height de Tailwind — usar `leading-[valor]` si difiere), `font-weight` heredados, `box-sizing`, transiciones (`transition` a secas ≠ `transition-colors`).
- **Reset**: Preflight (el reset de Tailwind) puede cambiar cosas que el CSS viejo asumía — márgenes default de `h1`/`p`/`ul`, estilos de botones e inputs, `img { display: block }`. Revisar específicamente headings, listas y formularios tras activar Tailwind.
- Levantar el dev server y comparar lado a lado contra el original (o capturas antes/después) en desktop y mobile.
- `npm run build` sin errores. Grep final: no quedan imports de los `.css`/`.module.css` eliminados, y ningún valor arbitrario repetido 3+ veces sin tokenizar.

## Errores comunes a evitar

- Redondear a la escala de Tailwind "porque queda más limpio". `padding: 18px` es `p-[18px]` (o un token), no `p-4`.
- Migrar sin inventario previo y descubrir en el componente 40 que había un token global.
- Olvidar los estilos que venían de herencia/cascada: un `.container { color: #333 }` que pintaba 20 hijos debe reaparecer en el padre migrado, no perderse.
- Traducir `@keyframes` a fuerza de utilidades cuando 5 líneas de CSS en `@layer` son más claras.
- Dejar el CSS viejo "por las dudas": genera doble fuente de verdad y specificity wars con las utilities.
- Ignorar Preflight y entregar formularios/headings que se ven distintos al original.