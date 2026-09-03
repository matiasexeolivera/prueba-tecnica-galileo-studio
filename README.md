# Customer portal · Galileo Studio

Technical assessment for a Product Engineer / Full Stack Developer role, built as a portal where a
consultancy's clients can create, track and comment on tickets, requests and questions — without
depending on someone answering a WhatsApp. Each client organization only sees its own tickets.

The reasoning behind every decision (what I prioritized, what I left out and why, what's missing) lives
in [DECISIONS.md](./DECISIONS.md). This README only covers the operational part: how to run it.

## Stack

Everything in a single Next.js 16 project (App Router, TypeScript, Server Actions) — no separate
backend, see DECISIONS.md for why. Persistence with SQLite via Prisma ORM (Prisma 7 requires a driver
adapter even for SQLite, already wired up). Auth with Auth.js (credentials + JWT). Styling with
Tailwind.

## Requirements

- Node.js 20+
- npm

## Running it from scratch

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Optional: generate your own AUTH_SECRET
# openssl rand -base64 32   →  paste it into .env

# 3. Create the database and apply migrations
npx prisma migrate dev

# 4. Generate the Prisma client (Prisma 7 doesn't do it automatically after the step above)
npx prisma generate

# 5. Load sample data (organizations, users, tickets)
npm run db:seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To reset the database from scratch (wipes everything and re-migrates):

```bash
npm run db:reset
npm run db:seed
```

## Test users

Password for all of them: **`demo1234`**

| Role | Email | Organization |
|---|---|---|
| Staff · Admin | `admin@galileostudio.ai` | — (sees every client) |
| Staff · Agent | `agente@galileostudio.ai` | — (sees every client) |
| Client · Admin | `admin@acme.test` | Acme Corp |
| Client · Member | `dev@acme.test` | Acme Corp |
| Client · Admin | `admin@bluewave.test` | Bluewave S.A. |

Fastest way to confirm the isolation works: log in as `admin@acme.test`, note which tickets you see,
log out and log in as `admin@bluewave.test`. You'll see a completely different set of tickets — no
overlap, even though both users share the same role.

## Repository structure

```
prisma/
  schema.prisma       Data model (Organization, User, Ticket, Comment, TicketEvent)
  migrations/          Migration history
  seed.ts              Sample data and demo users
src/
  app/
    login/              Login
    (app)/               Protected area (requires a session)
      dashboard/          Ticket list (scoped by role)
      tickets/new/        Create ticket (client)
      tickets/[id]/       Detail, comments, status changes (staff)
    api/auth/[...nextauth]/  Auth.js route handler
  lib/
    auth.ts / auth.config.ts   Auth.js config (edge-safe config kept separate, see DECISIONS.md)
    authz.ts             Session/role helpers (requireSession, requireStaff)
    tickets.ts           Single data-access layer for tickets — enforces org isolation
    prisma.ts             Prisma client (singleton)
  components/           Shared UI components (badges, logomark)
  proxy.ts               Route-protection middleware (Next.js 16's "proxy" convention)
```

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server |
| `npm run build` | Production build |
| `npm run start` | Serves the production build |
| `npm run lint` | Lint |
| `npm run db:seed` | Loads sample data |
| `npm run db:reset` | Wipes the database and re-applies migrations (run `db:seed` after) |
