# Extracción de tokens desde el CSS de origen

Cómo decidir qué del CSS existente se convierte en token del theme y qué queda como valor puntual.

## Proceso de inventario

Correr sobre todo el CSS a migrar (incluyendo `<style>` embebidos e inline styles si los hay):

```bash
# Colores
grep -rhoE "#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)" src --include="*.css" --include="*.scss" | sort | uniq -c | sort -rn

# Font sizes / spacing sospechosos
grep -rhoE "font-size:\s*[^;]+|padding[^:]*:\s*[^;]+|border-radius:\s*[^;]+" src --include="*.css" | sort | uniq -c | sort -rn

# Variables ya existentes
grep -rh "^\s*--" src --include="*.css" | sort | uniq
```

Con el conteo en mano, aplicar:

## Criterio token vs valor puntual

| Situación | Decisión |
|---|---|
| Valor aparece 3+ veces | Token, siempre |
| Valor aparece 1-2 veces pero tiene rol claro (color de marca, radio de cards) | Token |
| Valor aparece 1 vez, decisión puntual de layout (`width: 137px` de un logo) | Valor arbitrario `w-[137px]` |
| Dos valores casi iguales (#6b6b6b y #6f6f6f, 15px y 16px) | NO unificar. Migrar ambos tal cual y AVISAR al usuario de la posible inconsistencia para que decida. Unificar sin permiso rompe la paridad. |
| Valor coincide exacto con la escala default de Tailwind | Usar la utilidad estándar (`rounded-xl` para 12px) — no crear token redundante |

## Nombres

- Por rol, no por valor: `primary`, `primary-hover`, `surface`, `border`, `text-muted`, `danger`. Nunca `orange-main` ni `gray-2`.
- Si el origen ya tiene variables semánticas (`--brand`, `--ink`), conservar los nombres — minimiza el diff mental para quien conoce el proyecto.
- Sombras y radios con nombre de uso: `shadow-card`, `shadow-modal`, `radius-card` (v4) / `rounded-card` (v3).

## Colores derivados (hover, overlays)

Antes de crear un token `primary-hover`, chequear si el hover del original es matemáticamente derivable del base:

- `rgba(brand, 0.1)` → `bg-primary/10` (sin token nuevo)
- Un hover que es "el mismo color más oscuro" con valor propio en el CSS → token `primary-hover` con ESE valor exacto (no `primary/90`, que computa distinto)

## Breakpoints

Comparar los `@media` del origen con los defaults de Tailwind (sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536):

- Coinciden (o difieren en <20px y el usuario aprueba) → usar los default.
- El origen usa breakpoints propios consistentes (ej. 900px en todo el proyecto) → definirlos en el theme y usarlos. NO mapear 900px a `lg:` (1024) silenciosamente: cambia el comportamiento responsive real.

## z-index

Si el origen tiene una escala de z-index (dropdown 100, modal 1000, toast 9999), tokenizarla (`z-dropdown`, `z-modal`, `z-toast`). Es de los valores que más bugs sutiles produce si se migra "de memoria".