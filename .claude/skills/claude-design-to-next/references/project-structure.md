# Estructura Next.js y componentización

## Estructura de referencia (App Router + src/)

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fuentes, providers, metadata
│   ├── page.tsx                # Home — delgada, compone features
│   ├── globals.css             # Tokens + reset
│   ├── (grupo)/                # Route groups para layouts compartidos
│   └── propiedades/
│       ├── page.tsx
│       └── [id]/page.tsx
├── components/
│   ├── ui/                     # Primitivos sin lógica de dominio
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── layout/                 # Header, Footer, Sidebar, Nav
│   └── features/               # Componentes con conocimiento del dominio
│       └── properties/
│           ├── property-card.tsx
│           ├── property-grid.tsx
│           └── property-filters.tsx
├── hooks/
│   ├── use-properties.ts       # Hooks de datos (envuelven lib/api)
│   └── use-media-query.ts      # Hooks de UI
├── lib/
│   ├── api/                    # Ver references/data-layer.md
│   └── utils.ts                # cn(), formatCurrency(), etc.
└── providers/                  # QueryClientProvider, ThemeProvider (si aplica)
```

## Reglas por carpeta

**`app/`** — Solo routing y composición. Una página no debería superar ~50 líneas: importa componentes de features, hace fetching (si es Server Component) y compone. Cero lógica de presentación compleja.

**`components/ui/`** — Primitivos genéricos: reciben props, no conocen entidades del dominio. Un `Card` no sabe qué es una propiedad. Test mental: ¿este componente serviría en otro proyecto sin cambios? Si sí, va en `ui/`.

**`components/features/`** — Organizado por dominio (una subcarpeta por entidad/área). Conocen los tipos del dominio (`Property`), componen primitivos de `ui/`, y reciben datos por props o los piden via hooks. Preferir props: `<PropertyGrid properties={...}>` es más reutilizable y testeable que un grid que hace su propio fetching.

**`hooks/`** — Los hooks de datos son la única puerta de los Client Components hacia `lib/api`. Un hook por entidad/operación.

## Server vs Client Components

- Default: Server Component. Fetching en la página con `await api.x.getAll()`.
- `"use client"` solo cuando hay: `useState`/`useEffect`, event handlers, browser APIs, o TanStack Query.
- Empujar el boundary de client lo más abajo posible: si solo el botón de favorito es interactivo, el botón es client, no toda la card.
- Datos interactivos (filtros, búsqueda en vivo) → Client Component + hook. Datos estáticos de la vista → Server Component.

## Convenciones de nombres

- Archivos: `kebab-case.tsx` (`property-card.tsx`). Componentes: `PascalCase`.
- Hooks: `use-*.ts` / `useX`.
- Un componente por archivo salvo subcomponentes privados triviales.
- Path alias `@/` apuntando a `src/` (viene por default en create-next-app).

## Proceso de componentización del export

1. Identificar en el export los bloques visuales que se repiten → esos son los componentes. Orden de construcción: tokens → `ui/` → `layout/` → `features/` → páginas.
2. Al descomponer un bloque del export, separar: estructura (JSX), estilo (tokens/clases), datos (van a `lib/api/mocks/data/`), comportamiento (props/handlers).
3. Los textos del diseño que son contenido de datos (títulos de propiedades, precios) van a los mocks. Los textos que son UI (labels de botones, headings de secciones) quedan en los componentes — o en un archivo de constantes si el proyecto lo pide.
4. Imágenes del export: mover a `public/` y referenciar con `next/image` (con `width`/`height` o `fill`). Si el diseño usa placeholders, mantener URLs de placeholder en los mocks.
5. No perseguir DRY absoluto entre features: dos cards parecidas de dominios distintos pueden ser dos componentes. Duplicación leve > abstracción incorrecta.