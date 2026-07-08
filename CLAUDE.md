@AGENTS.md

# Convenciones del proyecto

## Capa de datos (regla dura)
- Todo dato pasa por `@/lib/api` (el index). Ningún componente, hook o página
  importa desde `lib/api/mocks/` ni `lib/api/services/` directamente.
- Los mocks son async con la misma firma que el servicio real (`Promise<T>`).
  Switch mock/real: `NEXT_PUBLIC_USE_MOCKS` en `lib/api/config.ts`.
- Al agregar una entidad nueva: types → service interface → mock → export en index.

## Estilos
- [Tailwind v4 / CSS Modules — según lo que elijas]. Colores/espaciados solo
  via tokens definidos en globals.css. Prohibido `bg-[#hex]` en componentes.

## Estructura
- `components/ui/` = primitivos sin dominio. `components/features/[entidad]/` = dominio.
- Server Components por defecto; `"use client"` solo con estado/eventos, y en
  el nivel más bajo posible.
- Páginas delgadas (~50 líneas): componen features, no implementan.

## Comandos
- `npm run build` debe pasar antes de dar por cerrada cualquier tarea.