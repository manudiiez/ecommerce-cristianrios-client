# Equivalencias CSS → Tailwind

Referencia de traducción. Regla transversal: verificar el valor computado, no el nombre. La escala default es 1 unidad = 0.25rem = 4px (`p-4` = 16px, `gap-6` = 24px). Si el valor de origen no cae exacto en la escala → valor arbitrario o token, nunca el vecino más cercano.

## Layout y posicionamiento

| CSS | Tailwind |
|---|---|
| `display: flex` + `align-items: center` + `justify-content: space-between` | `flex items-center justify-between` |
| `display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px` | `grid grid-cols-3 gap-6` |
| `grid-template-columns: 240px 1fr` | `grid-cols-[240px_1fr]` |
| `position: absolute; top: 0; right: 0` | `absolute top-0 right-0` |
| `position: sticky; top: 16px` | `sticky top-4` |
| `inset: 0` | `inset-0` |
| `z-index: 50` | `z-50` (custom: `z-[60]` o token) |
| `overflow: hidden` | `overflow-hidden` |

## Box model

| CSS | Tailwind |
|---|---|
| `padding: 16px 24px` | `px-6 py-4` |
| `padding: 18px` | `p-[18px]` — 18px NO está en la escala |
| `margin: 0 auto` | `mx-auto` |
| `max-width: 1200px` | `max-w-[1200px]` (o token `max-w-content`) |
| `width: 100%` / `height: 100vh` | `w-full` / `h-screen` (considerar `h-dvh` para mobile) |
| `aspect-ratio: 1` | `aspect-square` |
| `gap: 8px` | `gap-2` |

## Tipografía

⚠️ Zona de mayor riesgo de paridad: las utilidades `text-*` de Tailwind fijan font-size Y line-height juntos (`text-sm` = 14px/20px). Si el CSS original tiene otro line-height, sobreescribir: `text-sm leading-[1.3]`.

| CSS | Tailwind |
|---|---|
| `font-size: 14px; line-height: 20px` | `text-sm` (coincide exacto) |
| `font-size: 15px` | `text-[15px]` — no existe en la escala |
| `font-weight: 600` | `font-semibold` |
| `letter-spacing: 0.05em` | `tracking-wider` (verificar valor; custom: `tracking-[0.08em]`) |
| `text-transform: uppercase` | `uppercase` |
| `text-overflow: ellipsis` + `white-space: nowrap` + `overflow: hidden` | `truncate` |
| Clamp multilínea (`-webkit-line-clamp: 2`) | `line-clamp-2` |

## Color, fondo, borde, sombra

| CSS | Tailwind |
|---|---|
| `color: var(--text-muted)` | `text-muted` (con token en theme) |
| `background: rgba(0,0,0,.5)` | `bg-black/50` |
| `border: 1px solid #e5e5e5` | `border border-[#e5e5e5]` → mejor `border-border` (token) |
| `border-radius: 12px` | `rounded-xl` (= 12px exacto) |
| `border-radius: 10px` | `rounded-[10px]` |
| `box-shadow` custom | Token en theme (`shadow-card`); no aproximar a `shadow-md` |
| `background: linear-gradient(...)` | `bg-gradient-to-r from-... to-...` si es simple; `bg-[linear-gradient(...)]` o CSS si es complejo |

## Estados, responsive y contexto

| CSS | Tailwind |
|---|---|
| `.btn:hover { background: X }` | `hover:bg-X` |
| `.input:focus-visible { outline... }` | `focus-visible:ring-2 ...` (verificar contra el original) |
| `.btn:disabled` | `disabled:opacity-50 disabled:pointer-events-none` |
| `@media (min-width: 768px)` | prefijo `md:` (verificar que los breakpoints coincidan; custom → theme) |
| Media query max-width | `max-md:` |
| `.card:hover .title { ... }` | `group` en card + `group-hover:` en title |
| Hermano previo con estado (`input:checked ~ label`) | `peer` + `peer-checked:` |
| `&:nth-child(odd)` | `odd:` |
| `.parent > * + *` (espaciado entre hijos) | `space-y-N` o `divide-y` |
| `@media (prefers-reduced-motion)` | `motion-reduce:` / `motion-safe:` |

## Transiciones y animación

| CSS | Tailwind |
|---|---|
| `transition: all .2s ease` | `transition duration-200` — pero preferir la propiedad real: `transition-colors`, `transition-transform` |
| `transform: translateY(-2px)` | `-translate-y-0.5` (= 2px) |
| `transform: scale(1.05)` | `scale-105` |
| `@keyframes` custom | v4: definir en `@theme` (`--animate-*`) o dejar en CSS bajo `@layer`. v3: `theme.extend.keyframes` + `animation`. Si son >2 keyframes complejos, CSS plano es legítimo. |

## Lo que conviene DEJAR en CSS

- Animaciones de keyframes complejas (varios pasos, varias propiedades).
- Estilos sobre HTML que no controlás (markdown renderizado, contenido de CMS): usar el plugin typography (`prose`) o un bloque en `@layer components`.
- Selectores con lógica que en utilities queda ilegible (más de 2 niveles de combinadores).
- Hacks de scrollbar (`::-webkit-scrollbar`).

Regla: si la traducción a utilities es más larga Y menos legible que el CSS original, no traducir — documentar con un comentario por qué se queda.

## Patrón de variantes (reemplazo de `.button.primary.large`)

Nunca ternarios encadenados en `className`. Mapa simple:

```tsx
const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  outline: "border border-primary text-primary hover:bg-primary/10",
} as const;

const sizeClasses = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4",
} as const;

<button className={cn("inline-flex items-center rounded-lg font-medium transition-colors",
  variantClasses[variant], sizeClasses[size], className)} />
```

Con 3+ ejes de variantes o defaults/compound variants, usar `cva` (class-variance-authority). `cn()` = `clsx` + `tailwind-merge` en `lib/utils.ts` — necesario para que `className` externo pueda sobreescribir sin conflictos de specificity.

## Tokens: dónde viven

**v4** — en el CSS global:

```css
@import "tailwindcss";

@theme {
  --color-primary: #e85d3a;
  --color-surface: #faf7f2;
  --font-sans: "Inter", sans-serif;
  --radius-card: 12px;
  --shadow-card: 0 2px 8px rgb(0 0 0 / 0.08);
  --breakpoint-3xl: 1920px;
}
```

**v3** — `tailwind.config.ts`, idealmente apuntando a variables CSS (permite theming):

```ts
theme: {
  extend: {
    colors: { primary: "hsl(var(--primary))" },
    borderRadius: { card: "12px" },
    boxShadow: { card: "0 2px 8px rgb(0 0 0 / 0.08)" },
  },
}
```

Si el CSS de origen ya tenía variables en `:root` con nombres semánticos, mapearlas tal cual — es la migración más segura (el valor computado no cambia por definición).