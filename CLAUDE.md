# CRM CrediMil — Frontend

SPA del CRM interno de CrediMil Servicios. Consume la API del repo `CRM-Backend`.

Es una **web app responsiva**, no una app nativa. Debe funcionar bien en
escritorio y celular desde el diseño, no como ajuste posterior.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (sin `tailwind.config.js` — la config vive en CSS)
- React Router v7
- axios, jwt-decode
- react-hook-form + zod
- lucide-react (iconos), recharts (gráficas)

## Comandos

```bash
npm run dev      # Vite, puerto 5173
npm run build
```

**Siempre `npm`, nunca pnpm.** El backend sí usa pnpm; no los mezcles.

El backend debe estar corriendo en `localhost:3000`. La URL vive en
`.env.local` como `VITE_API_URL`.

## Estructura

Por **features**, no por tipo de archivo:

```
src/
├── app/               # App, providers, rutas
│   └── routes/        # index.tsx, ProtectedRoute.tsx
├── features/
│   ├── auth/          # login, sesión, AuthContext
│   ├── clientes/      # alta, consulta, detalle, edición
│   ├── creditos/      # solicitudes (wizard), consulta, detalle, PDFs
│   ├── lista-negra/
│   ├── usuarios/      # placeholder
│   └── dashboard/admin/
├── shared/
│   ├── api/client.ts  # axios + interceptores
│   ├── constants/     # roles.ts, zonas.ts
│   ├── hooks/         # useDebounce
│   ├── layout/        # AppLayout, Sidebar, nav.config.ts
│   ├── styles/        # tokens.css (@theme), global.css
│   └── ui/            # UI kit
└── pages/             # NoAutorizado, NotFound
```

Cada feature tiene `api/`, `components/`, `hooks/`, `pages/`, `types.ts`.

## Tailwind v4 — reglas

**No hay `tailwind.config.js`.** Los tokens viven en `src/shared/styles/tokens.css`
dentro de un bloque `@theme`. Solo se declaran los colores de marca (navy,
primary, accent); los grises son `slate` de Tailwind y los de feedback son
`red`/`amber`/`green`/`sky`.

**`global.css` se importa con `layer(base)`.** Sin eso, sus resets (`button {
background: none }`) le ganan a las utilidades y los botones salen sin color.
Fue un bug real.

**Las clases deben aparecer literales en el código.** Tailwind escanea texto, no
ejecuta JS:

```tsx
const TONOS = { sky: "bg-sky-100", green: "bg-green-100" };  // ✓
className={`bg-${color}-100`}                                 // ✗ no genera nada
```

**Equivalencias contra el CSS que tenía el proyecto antes de migrar:**
`--radius-md` (8px) = `rounded-lg`, no `rounded-md` (6px).
`--control-height` (44px) = `min-h-11`.

**CSS aparte solo cuando Tailwind no puede:** `body`/`#root` (fuera de React),
`text-wrap: balance`, `:focus-visible` global, `::-ms-reveal`, y el bloque de
`prefers-reduced-motion`. Todo lo demás va en utilidades.

## Sesión y rutas

El token se guarda en `localStorage` bajo `credimil.token` y se decodifica con
`jwt-decode` para leer el rol sin llamar a `/me` en cada render. Expira en 8h,
no hay refresh token.

**El interceptor de 401 ignora `/auth/login`.** Sin eso, escribir mal la
contraseña borraría el token y haría redirect antes de que el usuario leyera el
error. Fue un bug real.

`ProtectedRoute` valida sesión y rol. Los permisos del frontend son **espejo**
de los del backend, no la autorización real: esconder un link no protege nada.

**React Router rankea por especificidad**, pero mantén las rutas literales antes
que las paramétricas por legibilidad. `/clientes/alta` antes de `/clientes/:id`.

## Patrones establecidos

### Hooks de listado
Todos iguales (`useClientes`, `useCreditos`, `useSolicitudes`, `useListaNegra`):
serializan los filtros con `JSON.stringify` para que el efecto no se dispare en
cada render por recibir un objeto nuevo con el mismo contenido.

### Páginas de listado
Breadcrumb → header → tarjeta de filtros → tabla en `overflow-x-auto` →
paginación. Búsqueda con `useDebounce(400)`. Cualquier cambio de filtro resetea
a página 1.

### Decimales del backend
Llegan como **string**. Convertir con `Number()` antes de operar o de formatear
con `toLocaleString("es-MX")`.

### PDFs
No se abren con `<a href>`: la ruta exige el header de autorización. Se
descargan con axios (`responseType: "blob"`) y se abren con `URL.createObjectURL`.
Ver `abrirTarjeton` / `abrirContrato`.

### Documentos en el wizard
Los archivos se guardan en memoria durante los 5 pasos y se suben **después** de
crear la solicitud, porque antes no existe el id al que colgarlos. Si alguno
falla, la solicitud ya quedó registrada y se avisa cuáles faltan.

## UI kit (`src/shared/ui`)

`Button`, `Input`, `Select`, `Textarea`, `Card`, `Alert`, `Badge`, `Spinner`,
`Skeleton`, `Modal`, `FileInput`, `Paginacion`, `Breadcrumb`.

Todos exportados desde el barril `index.ts`.

`Input`, `Select` y `Textarea` usan `forwardRef` — es obligatorio para que
react-hook-form pueda registrarlos.

El `Modal` **no atrapa el foco**. Para diálogos de confirmación es aceptable; si
aparecen modales complejos, traer Radix UI.

## Diseño

Sidebar navy fijo de 240px en `lg:`, drawer con hamburguesa debajo. La
navegación sale de `src/shared/layout/nav.config.ts`, que filtra por rol y
marca los módulos no disponibles como atenuados.

Colores de marca (provisionales hasta tener los hex definitivos del Figma):
navy `#0b2239`, primary `#0ea5e9`, accent `#e8112d`. Tipografía Inter.

## Estado de los módulos

| Módulo | Estado |
|---|---|
| Login, roles, UI kit | Completo |
| Dashboard admin | Completo (KPIs mock salvo usuarios activos) |
| Clientes | Completo: alta, consulta, detalle, edición, lista negra, historial de zona |
| Créditos | Solicitudes (wizard 5 pasos), aprobación, consulta, detalle, tarjetón y contrato PDF |
| Pagos | Solo el schema |
| Usuarios | Placeholder — el backend existe desde el primer entregable |
| Evidencia, Reportes, Gestión, Balance | No existen |

## Deuda conocida

- `/inicio` sirve el dashboard de admin a los cinco roles; faltan las variantes
- Los KPIs del dashboard son mock salvo "Usuarios Activos" (marcados con `// TODO`)
- `useCreditoDetalle` devuelve `any` — tiparlo cuando el módulo se estabilice
- `as any` en los payloads de alta y edición de clientes, por `ClienteFormInput`
- Los documentos se listan en el detalle del crédito pero no se visualizan