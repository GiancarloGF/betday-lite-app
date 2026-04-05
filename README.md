# BetDay Lite

BetDay Lite es una demo de apuestas deportivas construida con Next.js App Router. El proyecto forma parte de un reto técnico y simula una experiencia liviana de sportsbook con autenticación, exploración de partidos, recarga de saldo ficticio, registro de apuestas e historial por usuario.

La versión actual usa Google OAuth con `next-auth` y Supabase como backend principal para usuarios, wallet, partidos y apuestas.

## Funcionalidades actuales

- Timeline pública de partidos con cuotas 1X2.
- Inicio de sesión con Google.
- Creación o sincronización del usuario de aplicación al autenticarse.
- Wallet por usuario con saldo ficticio en Supabase.
- Registro de apuestas con cuota congelada al momento de apostar.
- Historial privado de apuestas.
- Detalle privado de una apuesta.
- `robots.txt` y `sitemap.xml`.

## Alcance y limitaciones

- Es una demo, no un producto de dinero real.
- No hay feed en vivo de partidos ni de cuotas.
- No hay integración con pagos.
- No existe settlement automático de apuestas.
- Los partidos parten de un dataset semilla.
- El historial inicial de apuestas se siembra por usuario en el primer login.

## Stack técnico

- Next.js 16.2.2
- React 19.2.4
- TypeScript `strict`
- Tailwind CSS 4
- `next-auth`
- Supabase
- Zod
- Vitest
- shadcn + Radix UI

## Arquitectura resumida

- `src/app`: páginas App Router, route handlers, metadata routes y layout global.
- `src/proxy.ts`: protección de rutas privadas.
- `src/modules/auth`: Google OAuth y sincronización del usuario.
- `src/modules/matches`: lectura y visualización de partidos.
- `src/modules/bets`: creación, historial, detalle y bootstrap de apuestas semilla.
- `src/modules/wallet`: saldo y recargas.
- `src/shared`: utilidades, componentes UI, SEO, validaciones, errores y cliente server-side de Supabase.
- `scripts/seed-matches.mjs`: carga de partidos semilla a Supabase.
- `supabase/migrations`: schema SQL y políticas RLS.

## Rutas principales

- `/`: home pública con timeline de partidos.
- `/login`: inicio de sesión con Google.
- `/profile`: historial privado de apuestas.
- `/bets/[betId]`: detalle privado de una apuesta.
- `/api/auth/[...nextauth]`: handler de NextAuth.
- `/api/matches`: endpoint público que devuelve partidos desde Supabase.

## Requisitos

- Node.js.
- `pnpm`.
- Un proyecto Supabase accesible.
- Un cliente OAuth de Google configurado para desarrollo local.

## Variables de entorno

Crea `.env.local` a partir de `.env.example`:

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

### Significado de cada variable

| Variable               | Descripción                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `NEXTAUTH_SECRET`      | Secreto de sesión para `next-auth`.                                                                |
| `NEXTAUTH_URL`         | URL base de la aplicación. En local normalmente `http://localhost:3000`.                           |
| `GOOGLE_CLIENT_ID`     | Client ID del proyecto OAuth en Google Cloud.                                                      |
| `GOOGLE_CLIENT_SECRET` | Client secret del proyecto OAuth en Google Cloud.                                                  |
| `SUPABASE_URL`         | URL del proyecto Supabase.                                                                         |
| `SUPABASE_SECRET_KEY`  | Clave server-side con permisos elevados para operaciones backend. Nunca debe exponerse al cliente. |

## Configuración local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar Google OAuth

Crea un OAuth Client en Google Cloud y registra como callback:

```text
http://localhost:3000/api/auth/callback/google
```

Si usas otro dominio o puerto, ajusta también `NEXTAUTH_URL` y las URLs autorizadas en Google.

### 3. Preparar Supabase

Este repo ya incluye configuración base de Supabase en `supabase/config.toml` y las migraciones necesarias en:

- `supabase/migrations/20260404090000_create_initial_app_schema.sql`
- `supabase/migrations/20260404093000_enable_rls_and_create_policies.sql`

Si vas a usar Supabase CLI, normalmente basta con enlazar el proyecto y aplicar migraciones:

```bash
pnpm dlx supabase@latest login
pnpm dlx supabase@latest link --project-ref <tu-project-ref>
pnpm dlx supabase@latest db push
```

Notas:

- No necesitas `supabase init` si ya estás trabajando sobre este repo.
- `db push` aplica las migraciones del directorio `supabase/migrations`.

### 4. Cargar partidos semilla

Una vez creada la base y configuradas las variables de entorno:

```bash
pnpm seed:matches
```

Ese script:

- lee `src/shared/data/matches.today.50.json`
- carga `.env.local` automáticamente si existe
- hace `upsert` en `public.matches`

### 5. Iniciar la aplicación

```bash
pnpm dev
```

La app quedará disponible en [http://localhost:3000](http://localhost:3000).

## Flujo funcional esperado

1. El usuario abre la home y ve los partidos disponibles.
2. Inicia sesión con Google.
3. En el primer login, la app crea o actualiza el usuario en `app_users`, asegura la wallet y siembra apuestas históricas semilla.
4. El usuario puede agregar saldo ficticio.
5. El usuario puede registrar apuestas sobre los partidos listados.
6. El historial y el detalle se consultan desde Supabase.

## Comandos disponibles

| Comando                  | Descripción                                       |
| ------------------------ | ------------------------------------------------- |
| `pnpm dev`               | Inicia la app en desarrollo.                      |
| `pnpm build`             | Genera el build de producción.                    |
| `pnpm start`             | Levanta la app usando el build generado.          |
| `pnpm lint`              | Ejecuta ESLint.                                   |
| `pnpm test`              | Ejecuta Vitest.                                   |
| `pnpm test:watch`        | Ejecuta Vitest en modo watch.                     |
| `pnpm exec tsc --noEmit` | Ejecuta validación de tipos.                      |
| `pnpm lint-staged`       | Ejecuta validaciones sobre archivos staged.       |
| `pnpm seed:matches`      | Inserta o actualiza partidos semilla en Supabase. |

## Validaciones recomendadas

Antes de cerrar cambios relevantes:

```bash
pnpm lint
pnpm test
pnpm exec tsc --noEmit
```

Si estás tocando App Router, auth o rendering de páginas, también conviene ejecutar:

```bash
pnpm build
```

## Estado actual de validación

En el escaneo más reciente:

- `pnpm lint` pasa.
- `pnpm test` pasa con 6 archivos y 16 tests.
- `pnpm exec tsc --noEmit` pasa.
- `pnpm build` falla actualmente.

Motivo actual del fallo de build:

- `/login` usa `useSearchParams()` en `src/modules/auth/presentation/login-form.tsx`.
- Next.js exige una estrategia compatible con `Suspense` para ese caso durante el prerender de la página.

## Testing

La cobertura automatizada actual se concentra en reglas de negocio y utilidades:

- `placeBetUseCase`
- `getPendingBetsUseCase`
- `depositBalanceUseCase`
- `getBalanceUseCase`
- `getTodayMatchesUseCase`
- utilidades de fechas para partidos

Todavía no existe una suite E2E y tampoco hay cobertura completa para:

- callbacks de `next-auth`
- `syncAppUser()`
- server actions
- `src/proxy.ts`
- metadata routes
- scripts de seed o migraciones

## Consideraciones importantes

- La aplicación usa `SUPABASE_SECRET_KEY` solo en el servidor. Nunca expongas esa clave en código cliente.
- Las escrituras de apuestas y wallet hoy no están envueltas en una transacción; no asumas seguridad de concurrencia.
- `public.matches` se puede leer públicamente; las demás escrituras dependen de credenciales elevadas en backend.
- `src/shared/data/bets.me.50.json` hoy contiene 27 apuestas, aunque el nombre del archivo sugiere 50.
- Para reglas operativas específicas de agentes, revisa `AGENTS.md`.

## Estructura rápida del repo

```text
.
├─ scripts/
├─ src/
│  ├─ app/
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ bets/
│  │  ├─ matches/
│  │  └─ wallet/
│  ├─ shared/
│  └─ proxy.ts
├─ supabase/
│  ├─ config.toml
│  └─ migrations/
└─ tests/
```
