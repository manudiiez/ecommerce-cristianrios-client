# Capa de datos: mock-as-API

Objetivo: los componentes nunca saben si los datos vienen de mocks o de una API real. El switch es una variable de entorno o una línea en un solo archivo.

## Estructura completa

```
src/lib/api/
├── types.ts
├── config.ts
├── http.ts
├── services/
│   └── properties.service.ts
├── mocks/
│   ├── data/properties.data.ts
│   └── properties.mock.ts
└── index.ts
```

(Ejemplo con entidad `Property`; replicar el patrón por cada entidad del dominio: `products`, `users`, etc.)

## 1. types.ts — El contrato

Extraer los tipos de los datos hardcodeados en el export de Claude Design. Estos tipos son el contrato compartido entre mock y API real:

```ts
export interface Property {
  id: string;
  title: string;
  price: number;
  currency: "ARS" | "USD";
  imageUrl: string;
  // ... campos según el diseño
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  type?: string;
}
```

Si la API real ya existe y su shape difiere del diseño, definir los tipos según la API y adaptar en los componentes — nunca dos sets de tipos.

## 2. La interfaz del servicio (implícita por tipo)

Definir el shape del servicio una sola vez para que TypeScript obligue a que mock y real coincidan:

```ts
// services/properties.service.ts
import type { Property, PropertyFilters } from "../types";
import { http } from "../http";

export interface PropertiesService {
  getAll(filters?: PropertyFilters): Promise<Property[]>;
  getById(id: string): Promise<Property | null>;
  // solo los métodos que la UI necesita — no inventar CRUD completo
}

export const propertiesService: PropertiesService = {
  getAll: (filters) => http.get("/properties", { params: filters }),
  getById: (id) => http.get(`/properties/${id}`),
};
```

Si la API real todavía no existe, dejar esta implementación como stub que lanza `new Error("API not implemented")` — el tipo ya fija el contrato.

## 3. mocks/ — Misma interfaz, datos del diseño

```ts
// mocks/data/properties.data.ts
import type { Property } from "../../types";

// Datos extraídos LITERALMENTE del export de Claude Design
export const propertiesData: Property[] = [
  { id: "1", title: "Casa en Chacras", price: 185000, currency: "USD", ... },
];
```

```ts
// mocks/properties.mock.ts
import type { PropertiesService } from "../services/properties.service";
import { propertiesData } from "./data/properties.data";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const propertiesMock: PropertiesService = {
  async getAll(filters) {
    await delay();
    let result = propertiesData;
    if (filters?.type) result = result.filter((p) => p.type === filters.type);
    return result;
  },
  async getById(id) {
    await delay();
    return propertiesData.find((p) => p.id === id) ?? null;
  },
};
```

Claves del mock:
- **Async siempre**, con latencia simulada — así la UI ya maneja estados de loading reales.
- **Implementa filtros/paginación de verdad** sobre los datos, no los ignora — la UI se comporta igual que con la API.
- Tipado con `PropertiesService`: si el contrato cambia, TypeScript rompe el mock también.

## 4. config.ts + index.ts — El switch

```ts
// config.ts
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";
// default true durante desarrollo; en prod se setea NEXT_PUBLIC_USE_MOCKS=false
```

```ts
// index.ts — ÚNICO punto de importación para el resto de la app
import { USE_MOCKS } from "./config";
import { propertiesService } from "./services/properties.service";
import { propertiesMock } from "./mocks/properties.mock";

export const api = {
  properties: USE_MOCKS ? propertiesMock : propertiesService,
};

export * from "./types";
```

Migrar a la API real = setear la env var (o cambiar una línea acá). Cero cambios en componentes, hooks o páginas.

Nota sobre tree-shaking: si preocupa que los mocks entren al bundle de producción, usar el condicional con import dinámico o simplemente aceptarlo — para la mayoría de los proyectos el peso de los mocks es trivial. No complicar el patrón prematuramente.

## 5. Consumo desde la UI

**Con TanStack Query** (si el proyecto lo usa):

```ts
// hooks/use-properties.ts
import { useQuery } from "@tanstack/react-query";
import { api, type PropertyFilters } from "@/lib/api";

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => api.properties.getAll(filters),
  });
}
```

**En Server Components** (fetching directo, sin hook):

```tsx
// app/propiedades/page.tsx
import { api } from "@/lib/api";

export default async function PropertiesPage() {
  const properties = await api.properties.getAll();
  return <PropertyGrid properties={properties} />;
}
```

**Sin TanStack Query, en Client Components**: hook simple con `useState`/`useEffect` que llama a `api.properties.*` y expone `{ data, isLoading, error }` — misma forma que Query para facilitar migración futura.

## Regla de verificación

Ningún archivo fuera de `lib/api/` importa desde `lib/api/mocks/` o `lib/api/services/`. Todo pasa por `@/lib/api` (el index). Verificar con grep al final:

```bash
grep -rn "lib/api/mocks\|lib/api/services" src/app src/components src/hooks
# debe devolver vacío
```