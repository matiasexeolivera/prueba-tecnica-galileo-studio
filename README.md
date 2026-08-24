# Portal de clientes · Galileo Studio

Prueba técnica para Product Engineer / Full Stack Developer, resuelta como un portal donde los clientes
de una consultora pueden crear, seguir y comentar incidencias, solicitudes y dudas — sin depender de que
alguien les conteste un WhatsApp. Cada organización cliente ve únicamente sus propios tickets.

El razonamiento detrás de cada decisión (qué prioricé, qué dejé afuera y por qué, qué falta) está en
[DECISIONS.md](./DECISIONS.md). Este README es solo la parte operativa: cómo levantarlo.

## Stack

Todo en un solo proyecto Next.js 16 (App Router, TypeScript, Server Actions) — sin backend separado,
ver DECISIONS.md para el porqué. Persistencia con SQLite vía Prisma ORM (Prisma 7 exige un driver
adapter incluso para SQLite, ya viene resuelto). Autenticación con Auth.js (credenciales + JWT).
Estilos con Tailwind.

## Requisitos

- Node.js 20+
- npm

## Cómo levantar el proyecto desde cero

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Opcional: generar tu propio AUTH_SECRET
# openssl rand -base64 32   →  pegarlo en .env

# 3. Crear la base de datos y aplicar las migraciones
npx prisma migrate dev

# 4. Generar el cliente de Prisma (Prisma 7 no lo hace solo tras el paso anterior)
npx prisma generate

# 5. Cargar datos de ejemplo (organizaciones, usuarios, tickets)
npm run db:seed

# 6. Levantar el servidor de desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Para reiniciar la base de datos desde cero (borra todo y vuelve a migrar):

```bash
npm run db:reset
npm run db:seed
```

## Usuarios de prueba

Contraseña para todos: **`demo1234`**

| Rol | Email | Organización |
|---|---|---|
| Staff · Admin | `admin@galileostudio.ai` | — (ve todos los clientes) |
| Staff · Agente | `agente@galileostudio.ai` | — (ve todos los clientes) |
| Cliente · Admin | `admin@acme.test` | Acme Corp |
| Cliente · Miembro | `dev@acme.test` | Acme Corp |
| Cliente · Admin | `admin@bluewave.test` | Bluewave S.A. |

La forma más rápida de ver que el aislamiento funciona: entrá con `admin@acme.test`, anotá qué tickets
ves, cerrá sesión y entrá con `admin@bluewave.test`. Vas a ver un set de tickets completamente distinto
— ninguno se pisa con el otro, aunque ambos usuarios tengan el mismo rol.

## Estructura del repositorio

```
prisma/
  schema.prisma       Modelo de datos (Organization, User, Ticket, Comment, TicketEvent)
  migrations/          Historial de migraciones
  seed.ts              Datos de ejemplo y usuarios demo
src/
  app/
    login/              Login
    (app)/               Área protegida (requiere sesión)
      dashboard/          Listado de tickets (scoped por rol)
      tickets/new/        Alta de ticket (cliente)
      tickets/[id]/       Detalle, comentarios, cambio de estado (staff)
    api/auth/[...nextauth]/  Route handler de Auth.js
  lib/
    auth.ts / auth.config.ts   Configuración de Auth.js (config edge-safe separada, ver DECISIONS.md)
    authz.ts             Helpers de sesión y rol (requireSession, requireStaff)
    tickets.ts           Única capa de acceso a datos de tickets — fuerza el aislamiento por organización
    prisma.ts             Cliente Prisma (singleton)
  components/           Componentes de UI compartidos (badges, logomark)
  proxy.ts               Middleware de protección de rutas (convención "proxy" de Next.js 16)
```

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | Lint |
| `npm run db:seed` | Carga los datos de ejemplo |
| `npm run db:reset` | Borra la base de datos y vuelve a aplicar las migraciones (correr `db:seed` después) |
