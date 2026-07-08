---
name: claude-design-to-next
description: Transforma exports de Claude Design (zip o carpeta con HTML/React) en proyectos Next.js production-ready con App Router, componentes reutilizables, design tokens (Tailwind o CSS Modules según el proyecto) y una capa de datos donde los mocks se consumen como si fueran una API real, de modo que migrar a la API de verdad sea un cambio de una sola línea. Usar esta skill SIEMPRE que el usuario mencione Claude Design, un zip/export de diseño, "pasar el diseño a Next", "convertir el diseño en app", "armar el frontend a partir del diseño", o pida montar un frontend Next.js sobre datos mock — incluso si no nombra explícitamente Claude Design.
---

# Claude Design → Next.js

Convierte un export de Claude Design en un proyecto Next.js bien estructurado. El export típico de Claude Design es HTML/React monolítico con estilos inline o embebidos y datos hardcodeados dentro del JSX. El trabajo de esta skill es descomponer eso en: componentes reutilizables, tokens de diseño centralizados, y una capa de datos con contrato de API.

## Principios (no negociables)

1. **Los mocks se tratan como una API.** Ningún componente importa datos mock directamente. Todo dato pasa por una capa de servicio con funciones `async` que devuelven promesas — misma firma que tendrá la API real. Migrar de mock a API real debe ser cambiar UNA línea (o una variable de entorno), sin tocar ningún componente.
2. **Los estilos viven en tokens, no en componentes.** Colores, tipografías, espaciados y radios se extraen del diseño una sola vez a `tailwind.config.ts` / `globals.css` (variables CSS). Los componentes referencian tokens, nunca valores hardcodeados (`bg-primary`, no `bg-[#e85d3a]`).
3. **Componentizar por repetición real.** Si un patrón visual aparece 2+ veces en el diseño (botón, card, badge, input), es un componente en `components/ui/`. No crear abstracciones especulativas para cosas que aparecen una vez.
4. **Server Components por defecto.** `"use client"` solo donde hay interactividad (estado, eventos, hooks). Las páginas son delgadas: componen, no implementan.

## Flujo de trabajo

### Paso 1 — Inspeccionar el export

Descomprimir/leer el export de Claude Design. Antes de escribir código, producir un inventario breve:

- **Vistas/páginas** detectadas y sus rutas propuestas
- **Componentes repetidos** (candidatos a `ui/`): botones, cards, inputs, badges, navs, modales
- **Design tokens**: paleta de colores, fuentes, escala de espaciado, radios, sombras (extraer los valores exactos del CSS/inline styles del export)
- **Entidades de datos** hardcodeadas en el JSX (ej: propiedades, productos, usuarios) → serán los tipos del dominio y los mocks

Mostrar este inventario al usuario antes de generar el proyecto si hay ambigüedad sobre rutas o entidades. Si es obvio, continuar.

### Paso 2 — Decidir el sistema de estilos

- **Proyecto existente** → detectar: si tiene `tailwind.config.*`, usar Tailwind; si usa CSS Modules, seguir con CSS Modules. Respetar las convenciones del proyecto.
- **Proyecto nuevo** → preguntar al usuario si no lo especificó. Default recomendado: Tailwind.

Leer `references/styling.md` para el detalle de extracción de tokens en cada modalidad.

### Paso 3 — Scaffolding

Proyecto nuevo: `create-next-app` con TypeScript, App Router, `src/`, ESLint (y Tailwind si aplica). Estructura objetivo:

```
src/
├── app/                    # Rutas. Páginas delgadas que componen features
│   ├── layout.tsx
│   ├── page.tsx
│   └── [ruta]/page.tsx
├── components/
│   ├── ui/                 # Primitivos reutilizables (Button, Card, Input, Badge)
│   └── features/           # Componentes por dominio (property-card, product-grid)
│       └── [dominio]/
├── hooks/                  # Hooks de datos (use-properties.ts) y de UI
├── lib/
│   ├── api/                # Capa de datos completa (ver Paso 5)
│   └── utils.ts            # cn(), formatters
└── styles/                 # Solo si CSS Modules; con Tailwind basta globals.css
```

Leer `references/project-structure.md` para las reglas de cada carpeta y convenciones de nombres.

### Paso 4 — Tokens y componentes UI

1. Volcar los tokens extraídos en Paso 1 a la configuración de estilos (variables CSS en `globals.css` + mapeo en Tailwind, o solo variables CSS).
2. Construir los primitivos de `components/ui/` identificados, con variantes via props (`variant`, `size`). Con Tailwind, usar `cva` o un mapa de variantes simple; sin librerías pesadas salvo que el proyecto ya las use.
3. Recién después construir los componentes de feature componiendo los primitivos.

Fidelidad visual: el resultado debe verse igual al diseño de Claude Design. Comparar contra el export, no "aproximar".

### Paso 5 — Capa de datos (mock-as-API)

Esta es la parte más importante de la skill. Leer `references/data-layer.md` y seguir ese patrón exacto. Resumen del contrato:

```
src/lib/api/
├── types.ts                 # Tipos del dominio (extraídos de los datos del diseño)
├── config.ts                # USE_MOCKS: punto único de switch
├── http.ts                  # fetch wrapper para la implementación real
├── services/
│   └── [entidad].service.ts # Implementación real (HTTP) — puede ser stub inicial
├── mocks/
│   ├── data/[entidad].data.ts    # Los datos extraídos del diseño
│   └── [entidad].mock.ts         # Implementación mock (async + latencia simulada)
└── index.ts                 # Exporta la implementación activa según config
```

Los componentes consumen SOLO via hooks (`hooks/use-properties.ts`), que llaman a `lib/api`. Si el proyecto usa TanStack Query, los hooks lo envuelven; si no, hooks simples con `useState`/`useEffect` o fetching en Server Components llamando al servicio directamente.

### Paso 6 — Verificar

- `npm run build` debe pasar sin errores ni warnings de tipos.
- Grep de sanidad: ningún archivo en `components/` o `app/` importa desde `lib/api/mocks/` — solo `lib/api` (index).
- Grep de tokens: no quedan colores hex hardcodeados en componentes (excepto casos justificados como charts).
- Revisar visualmente contra el diseño original (levantar dev server si es posible).

## Errores comunes a evitar

- Copiar el JSX del export tal cual en una página gigante y "componentizar después". Componentizar es el trabajo, no un paso posterior.
- Poner los datos mock en el componente "por ahora". Nunca: el costo de hacerlo bien desde el inicio es mínimo y es el motivo de esta skill.
- Firmas de mock síncronas (`getProperties(): Property[]`). Siempre `Promise<Property[]>` — si la firma cambia al migrar a la API, el patrón falló.
- Crear un `ui/Button` con 12 variantes especulativas. Solo las variantes que el diseño usa.
- Ignorar responsive: los exports de Claude Design suelen ser desktop-first; verificar breakpoints y adaptar con mobile en mente.