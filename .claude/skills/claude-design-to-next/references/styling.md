# Estilos: extracción de tokens y modalidades

## Extracción de tokens del export

Los exports de Claude Design traen los valores de diseño dispersos en estilos inline, `<style>` embebidos o clases Tailwind arbitrarias (`bg-[#e85d3a]`). El primer paso es inventariarlos:

1. **Colores**: grep de hex/rgb/hsl en el export. Agrupar por rol semántico, no por valor: `primary`, `primary-hover`, `background`, `surface`, `border`, `text-primary`, `text-muted`, `success`, `danger`. Si un color aparece una sola vez y no tiene rol claro, probablemente no es un token.
2. **Tipografía**: familias, pesos usados, escala de tamaños (mapear a una escala consistente aunque el diseño tenga valores casi-iguales como 15px y 16px — normalizar).
3. **Espaciado y radios**: detectar la escala implícita. Claude Design suele usar múltiplos de 4px; mapear a la escala estándar de Tailwind cuando coincida.
4. **Sombras**: extraer las 2-3 sombras reales del diseño como `shadow-sm/md/lg` custom.

## Modalidad Tailwind (default para proyectos nuevos)

Tailwind v4 (CSS-first) — definir tokens en `globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #e85d3a;
  --color-primary-hover: #d14e2d;
  --color-surface: #faf7f2;
  --color-text-muted: #6b6b6b;
  --font-sans: "Inter", sans-serif;
  --radius-card: 12px;
}
```

Tailwind v3 (si el proyecto existente lo usa) — `tailwind.config.ts` con `theme.extend.colors` mapeando a variables CSS definidas en `globals.css` (permite theming futuro):

```ts
colors: {
  primary: "hsl(var(--primary))",
  surface: "hsl(var(--surface))",
}
```

Reglas:
- Prohibido `bg-[#...]` en componentes una vez definidos los tokens. Los valores arbitrarios del export se reemplazan por el token semántico.
- Variantes de componentes con un mapa simple o `cva` si hay 3+ variantes × tamaños:

```tsx
const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  outline: "border border-primary text-primary hover:bg-primary/10",
};
```

- `cn()` (clsx + tailwind-merge) en `lib/utils.ts` para composición de clases.

## Modalidad CSS Modules

Para proyectos que no usan Tailwind. Tokens como variables CSS globales:

```css
/* styles/tokens.css — importado en app/layout.tsx */
:root {
  --color-primary: #e85d3a;
  --space-1: 4px;
  --space-2: 8px;
  --radius-card: 12px;
  --font-sans: "Inter", sans-serif;
}
```

Cada componente con su módulo colocado al lado:

```
components/ui/button/
├── button.tsx
└── button.module.css
```

```css
/* button.module.css */
.button { border-radius: var(--radius-card); font-family: var(--font-sans); }
.primary { background: var(--color-primary); }
```

Reglas:
- Los módulos SOLO usan variables de tokens para colores/espaciado/radios — nunca valores literales.
- Variantes como clases del módulo combinadas en el componente (`styles[variant]`).
- Layout utilities repetidas (container, visually-hidden) van en un `styles/utilities.css` global, no duplicadas por módulo.

## Detección en proyectos existentes

Antes de decidir, chequear en orden:
1. `tailwind.config.{ts,js}` o `@import "tailwindcss"` en CSS → Tailwind (detectar v3 vs v4 por la presencia del config file vs `@theme`).
2. Archivos `*.module.css` → CSS Modules.
3. `styled-components`/`emotion` en package.json → seguir esa convención (raro, pero respetarla).
4. Nada de lo anterior y el usuario no especificó → preguntar, sugiriendo Tailwind.