# BetDay Lite

BetDay Lite es una aplicación demo de apuestas deportivas construida con Next.js. El proyecto fue desarrollado como reto técnico y simula un flujo básico de autenticación, exploración de partidos, selección de picks, gestión de saldo y consulta del historial de apuestas.

## Overview del proyecto resumen

- Aplicación monolítica con Next.js App Router.
- Autenticación demo con `next-auth` y provider de credenciales.
- Listado de partidos y apuestas históricas cargados desde archivos JSON estáticos.
- Apuestas creadas por el usuario y saldo persistidos en `localStorage`.
- Proyecto orientado a demostración funcional, no a un entorno productivo.

## Instrucciones de ejecución

### Requisitos

- Node.js instalado.
- `pnpm` como package manager.

### Configuración inicial

1. Instalar dependencias:

```bash
pnpm install
```

2. Crear un archivo `.env.local` tomando como base `.env.example`:

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_EMAIL=demo@betday.com
NEXT_PUBLIC_DEMO_PASSWORD=BetDay123
```

### Comandos disponibles

| Comando                  | Descripción                                              |
| ------------------------ | -------------------------------------------------------- |
| `pnpm dev`               | Inicia la aplicación en modo desarrollo.                 |
| `pnpm build`             | Genera el build de producción.                           |
| `pnpm start`             | Levanta la aplicación usando el build generado.          |
| `pnpm lint`              | Ejecuta ESLint sobre el proyecto.                        |
| `pnpm test`              | Ejecuta la suite de tests con Vitest.                    |
| `pnpm test:watch`        | Ejecuta Vitest en modo watch.                            |
| `pnpm exec tsc --noEmit` | Valida tipos con TypeScript sin emitir archivos.         |
| `pnpm lint-staged`       | Ejecuta las validaciones definidas para archivos staged. |

### Flujo local recomendado

```bash
pnpm install
pnpm dev
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

Antes de cerrar cambios relevantes, conviene ejecutar:

```bash
pnpm lint
pnpm test
pnpm exec tsc --noEmit
```

## Overview del proyecto más detallado

### Qué hace la aplicación

BetDay Lite simula una experiencia liviana de sportsbook. Un usuario puede autenticarse con credenciales demo, revisar partidos disponibles, elegir un mercado 1X2, cargar saldo ficticio y registrar apuestas. También puede consultar su historial y ver el detalle de una apuesta puntual.

### Alcance funcional actual

- No existe una base de datos real.
- No hay integraciones con APIs externas de partidos o cuotas.
- Los partidos iniciales se leen desde `src/shared/data/matches.today.50.json`.
- Las apuestas históricas de ejemplo se leen desde `src/shared/data/bets.me.50.json`.
- Las apuestas creadas por el usuario y el saldo solo existen en el navegador mediante `localStorage`.

Importante: el nombre "today" en los datasets es parte del lenguaje del producto. La app ordena los partidos por horario de inicio, pero no recalcula un "día actual" real a partir del reloj del sistema.

### Arquitectura a alto nivel

- `src/app`: rutas App Router, layout global, páginas, loading states y route handlers.
- `src/modules/auth`: autenticación demo basada en `next-auth`.
- `src/modules/matches`: obtención y renderizado de partidos disponibles.
- `src/modules/bets`: creación de apuestas, historial y detalle.
- `src/modules/wallet`: recarga de saldo ficticio y débito al confirmar una apuesta.
- `src/shared`: componentes reutilizables, validaciones, errores, stores, providers, utilidades y datos semilla.

### Rutas principales

- `/`: home pública con timeline de partidos y widgets laterales.
- `/login`: acceso con credenciales demo.
- `/profile`: vista privada con historial combinado de apuestas.
- `/bets/[betId]`: detalle privado de una apuesta.
- `/api/matches`: endpoint público de solo lectura para partidos semilla.
- `/api/bets`: endpoint público de solo lectura para apuestas semilla.
- `/api/auth/[...nextauth]`: handler de autenticación.

### Modelo de datos y ejecución

- El shell principal combina renderizado del lado del servidor con interactividad del lado del cliente.
- La autenticación de UI protegida se resuelve con middleware.
- El saldo y las apuestas del usuario se hidratan en cliente mediante providers y stores.
- Al crear una apuesta, la app valida el stake, verifica saldo disponible, congela la cuota seleccionada y persiste el resultado localmente.

### Stack técnico

- Next.js `16.2.2`
- React `19.2.4`
- TypeScript en modo `strict`
- Tailwind CSS `4`
- `next-auth`
- Zustand
- Zod
- Vitest
- shadcn/Radix UI

### Testing actual

La cobertura automatizada actual está concentrada en reglas de negocio clave:

- validación de depósitos en wallet
- ordenamiento de partidos
- utilidades de fecha para partidos
- reglas de colocación de apuesta y débito de saldo

No existe actualmente una suite E2E ni cobertura de integración para flujos completos de autenticación, middleware o navegación protegida.
