# Spartan Stack

A fullstack Angular application built with **AnalogJS**, **Nx**, **tRPC**, **Spartan UI**, **Supabase**, and **Drizzle ORM**.

This README is written as a learning guide — if you know Angular 18, everything here is explained relative to what you already know.

---

## Table of Contents

1. [The Big Picture](#the-big-picture)
2. [Project Structure](#project-structure)
3. [Technology Deep Dives](#technology-deep-dives)
   - [Nx — Monorepo Tooling](#nx--monorepo-tooling)
   - [AnalogJS — Angular's Meta-Framework](#analogjs--angulars-meta-framework)
   - [tRPC — Type-Safe API Layer](#trpc--type-safe-api-layer)
   - [Spartan UI — Angular Component Library](#spartan-ui--angular-component-library)
   - [Supabase — Your Backend](#supabase--your-backend)
   - [Drizzle ORM — Type-Safe Database Queries](#drizzle-orm--type-safe-database-queries)
4. [How Everything Connects](#how-everything-connects)
5. [Data Flow: A Request End-to-End](#data-flow-a-request-end-to-end)
6. [File Reference Guide](#file-reference-guide)
7. [Common Commands](#common-commands)
8. [Environment Variables](#environment-variables)

---

## The Big Picture

If you have only built Angular 18 apps before, you likely used:
- Angular CLI to scaffold the project
- `HttpClient` to call a separate backend API (REST)
- A component library like Angular Material
- A separate backend you didn't own (or didn't build)

This stack changes all of that:

| What you knew | What this stack uses | Why |
|---|---|---|
| Angular CLI | **Nx** | Manages multiple apps/libs in one repo |
| Plain Angular app | **AnalogJS** | Adds SSR, file-based routing, and server API routes to Angular |
| `HttpClient` + REST | **tRPC** | Fully type-safe API — no manual types, no `any` |
| Angular Material | **Spartan UI** | Tailwind-based, fully customizable UI components |
| Separate backend | **Supabase** | Postgres database + auth + storage as a service |
| Raw SQL / no ORM | **Drizzle ORM** | Write SQL queries in TypeScript with full type safety |

The key insight: **this is a fullstack TypeScript app**. The same codebase contains your Angular frontend AND your Node.js backend API. Types flow automatically from your database schema all the way to your Angular components — no manual synchronization.

---

## Project Structure

```
stack/                              ← Nx workspace root
├── spartan-analog/                 ← The main fullstack application
│   └── src/
│       ├── app/                    ← Angular frontend (you know this)
│       │   ├── app.config.ts       ← Angular providers (replaces AppModule)
│       │   ├── trpc-client.ts      ← tRPC client for Angular
│       │   └── pages/             ← File-based routes (like Angular routing, but automatic)
│       │       └── (home).page.ts  ← Maps to the "/" route
│       └── server/                 ← Node.js backend (NEW — runs on the server)
│           ├── db/
│           │   ├── schema.ts       ← Drizzle table definitions
│           │   └── index.ts        ← Drizzle database client
│           ├── lib/
│           │   └── supabase.ts     ← Supabase server clients
│           ├── trpc/
│           │   ├── init.ts         ← tRPC initialization
│           │   ├── context.ts      ← What every API call has access to (db, supabase)
│           │   └── routers/
│           │       └── index.ts    ← Your API endpoints live here
│           └── routes/
│               ├── api/v1/hello.ts ← Plain REST endpoint (optional)
│               └── trpc/[trpc].ts  ← tRPC HTTP bridge (do not touch)
├── spartan-analog-e2e/             ← Playwright end-to-end tests
├── drizzle.config.ts               ← Drizzle Kit configuration
├── .env                            ← Your secrets (never commit this)
├── .env.example                    ← Template for .env
├── tsconfig.base.json              ← TypeScript config shared across all projects
└── package.json                    ← All dependencies for the whole workspace
```

---

## Technology Deep Dives

### Nx — Monorepo Tooling

**What is it?**
Nx is a build system and monorepo manager. A monorepo means one Git repository contains multiple related projects. In this workspace, `spartan-analog` (the app) and `spartan-analog-e2e` (the tests) live side by side.

**Why use it instead of Angular CLI?**
Angular CLI manages one app per project. Nx lets you grow: add a shared UI library, an admin app, a mobile app — all sharing the same `node_modules`, TypeScript configs, and tooling.

**Mental model:**
Think of Nx as Angular CLI but for an entire organization's codebase. Under the hood it still uses Angular CLI generators, but adds caching, task orchestration, and code sharing on top.

**Key concepts:**
- **Workspace** — the root folder (`stack/`) containing everything
- **Project** — an app or library inside the workspace (e.g. `spartan-analog`)
- **Target** — a task you run on a project: `build`, `serve`, `test`, `lint`
- **Executor** — the tool that runs a target (e.g. `@analogjs/platform:vite-dev-server`)

**Common Nx commands:**
```bash
npx nx serve spartan-analog      # start dev server
npx nx build spartan-analog      # production build
npx nx test spartan-analog       # run unit tests
npx nx lint spartan-analog       # lint the project
npx nx graph                     # visualize project dependencies in browser
```

**Caching:**
Nx caches task results. If you run `nx build` twice without changing any files, the second run is instant. This matters when you have dozens of projects.

---

### AnalogJS — Angular's Meta-Framework

**What is it?**
AnalogJS is to Angular what Next.js is to React. It wraps Angular and adds:
- **Server-Side Rendering (SSR)** — pages render on the server before sending HTML to the browser
- **File-based routing** — create a file, get a route automatically
- **API routes** — write server-side Node.js handlers in the same project as your Angular app
- **Build tooling** — uses Vite instead of the Angular CLI's webpack/esbuild for faster builds

**Why does this matter if you know Angular 18?**
Angular 18 has SSR support via `@angular/ssr`, but you still need a separate backend for API endpoints. AnalogJS removes that separation — your backend API routes live inside `src/server/routes/` and are part of the same project.

**File-based routing:**

In Angular 18, you define routes manually in a `Routes` array:
```typescript
// Angular 18 way
const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'users/:id', component: UserDetailComponent },
];
```

In AnalogJS, you just create files in the `pages/` folder:
```
src/app/pages/
├── (home).page.ts        →  /
├── about.page.ts         →  /about
└── users/
    └── [id].page.ts      →  /users/:id   (dynamic route)
```

The filename IS the route. Parentheses like `(home)` mean the file defines the `/` route but the folder name doesn't appear in the URL.

**A page component looks like this:**
```typescript
// src/app/pages/about.page.ts
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<h1>About Page</h1>`,
})
export default class AboutPageComponent {}
// Note: must be a DEFAULT export
```

**Server API routes:**

Files inside `src/server/routes/` become HTTP endpoints:
```
src/server/routes/
├── api/v1/hello.ts     →  GET /api/v1/hello
└── trpc/[trpc].ts      →  ALL /api/trpc/*  (handled by tRPC)
```

A route handler uses the `h3` library (AnalogJS's HTTP layer):
```typescript
// src/server/routes/api/v1/hello.ts
import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
  return { message: 'Hello World' };
});
```

**SSR — how it works:**
When a user visits your site, the server:
1. Renders the Angular component to HTML
2. Sends that HTML immediately (fast first paint, good for SEO)
3. The browser downloads Angular, which "hydrates" the page (makes it interactive)

This is why there are two config files: `app.config.ts` (browser) and `app.config.server.ts` (server).

---

### tRPC — Type-Safe API Layer

**What is it?**
tRPC lets you call your server functions from the client as if they were local functions — with full TypeScript type safety, no code generation, and no REST endpoint definitions.

**The problem it solves:**
In a traditional Angular + REST setup, you define an API endpoint on the server, then manually create a TypeScript interface on the client that matches what the server returns. If the server changes, the client doesn't know — you get runtime errors.

```typescript
// Traditional way — types can get out of sync
// Server (Node.js):
app.get('/users', (req, res) => {
  res.json({ users: [...], total: 0 }); // server returns this shape
});

// Client (Angular) — you manually copy the type:
interface UsersResponse {
  users: User[];
  total: number; // what if server changes this to "count"? Runtime error.
}
this.http.get<UsersResponse>('/users').subscribe(...)
```

**How tRPC works:**

```
Server defines a "router" with procedures (functions)
           ↓
Client gets the EXACT TypeScript type of the router
           ↓
Client calls procedures — TypeScript catches any mismatch at compile time
```

**Your router** (`src/server/trpc/routers/index.ts`):
```typescript
export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))  // input is validated with Zod
    .query(({ input, ctx }) => {
      // ctx.db    ← Drizzle database
      // ctx.supabase ← Supabase client
      return { greeting: `Hello, ${input.name}!` };
    }),
});

export type AppRouter = typeof appRouter; // This type is shared with the client
```

**Using it in an Angular component:**
```typescript
import { Component, inject } from '@angular/core';
import { TrpcClient } from '../trpc-client';

@Component({
  standalone: true,
  template: `
    @if (greeting()) {
      <p>{{ greeting() }}</p>
    }
  `
})
export class HomeComponent {
  private trpc = inject(TrpcClient);

  // TypeScript KNOWS the input must have { name: string }
  // TypeScript KNOWS the output has { greeting: string }
  greeting = this.trpc.hello.query({ name: 'World' });
}
```

**Procedures — the two types:**
- `.query()` — for reading data (like HTTP GET)
- `.mutation()` — for creating/updating/deleting data (like HTTP POST/PUT/DELETE)

**Context:**
Every procedure receives a `ctx` object. In this project, context is defined in `src/server/trpc/context.ts` and gives every procedure access to:
- `ctx.db` — the Drizzle database client (to query Supabase Postgres)
- `ctx.supabase` — the Supabase client (for auth, storage, etc.)

**Validation with Zod:**
tRPC uses Zod to validate inputs at runtime. Zod schemas also generate the TypeScript types automatically:
```typescript
const schema = z.object({ name: z.string(), age: z.number().min(0) });
type Input = z.infer<typeof schema>; // { name: string; age: number }
```

---

### Spartan UI — Angular Component Library

**What is it?**
Spartan UI is an Angular component library built with Tailwind CSS. Unlike Angular Material (which gives you pre-styled, opinionated components), Spartan components are designed to be copied into your project so you own and control the source code.

**Two layers — Brain and Helm:**

| Layer | Package | What it does |
|---|---|---|
| **Brain** | `@spartan-ng/brain` (npm) | Behaviour + accessibility (keyboard nav, ARIA, focus trapping). No styles. |
| **Helm** | Copied into `libs/ui/` | The visual styling using Tailwind. You own this code. |

Think of Brain as the "engine" (it makes a dropdown accessible and keyboard-navigable) and Helm as the "body" (it makes the dropdown look good).

**Why copy the component source?**
Because you might need a slightly different button, a different color on a badge, or a custom animation. With traditional libraries, you're stuck overriding CSS. With Spartan, you directly edit the component file.

**Tailwind CSS:**
Spartan is built on Tailwind, which applies styles through utility classes directly in HTML:
```html
<!-- Instead of writing CSS -->
<button class="bg-primary text-primary-foreground px-4 py-2 rounded-md">
  Click me
</button>

<!-- Spartan wraps this into a directive -->
<button hlmBtn>Click me</button>
```

**Semantic color tokens:**
Instead of hardcoding colors, Spartan uses CSS variables that automatically switch between light and dark mode:
```
bg-primary        ← main brand color
text-foreground   ← main text color
bg-muted          ← subtle background
bg-destructive    ← danger/red actions
```

These are defined in `spartan-analog/src/styles.css` and can be changed for your brand.

**Adding a component:**
```bash
npx nx g @spartan-ng/cli:ui --name=button
npx nx g @spartan-ng/cli:ui --name=dialog
npx nx g @spartan-ng/cli:ui  # interactive picker
```

**Using a component:**
```typescript
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
  standalone: true,
  imports: [HlmButtonDirective],
  template: `
    <button hlmBtn>Default</button>
    <button hlmBtn variant="destructive">Delete</button>
    <button hlmBtn variant="outline" size="sm">Small Outline</button>
  `
})
export class MyComponent {}
```

---

### Supabase — Your Backend

**What is it?**
Supabase is an open-source Firebase alternative. It gives you:
- **PostgreSQL database** — a real, powerful SQL database
- **Authentication** — email/password, OAuth (Google, GitHub, etc.), magic links
- **Storage** — file uploads (images, videos, documents)
- **Realtime** — subscribe to database changes in real-time
- **Edge Functions** — serverless functions (optional)

All of this is managed for you — you don't need to run a database server.

**Why Supabase instead of just a database?**
With a plain database, you need to handle authentication yourself, write permission logic yourself, and manage connections yourself. Supabase provides all of this out of the box. You get a full backend with a Postgres database that you interact with either through:
1. The **Supabase client** (`@supabase/supabase-js`) — for auth, storage, and realtime
2. **Direct Postgres connection** — for complex queries via Drizzle ORM

**Row Level Security (RLS):**
Supabase uses Postgres's RLS feature to enforce data access rules at the database level. For example: "a user can only see their own rows". This runs inside Postgres itself, so it's very secure.

In this project, the server uses the **service role key** to bypass RLS (for trusted server operations), and the **anon key** for operations that should respect RLS.

**Two clients in this project:**
```typescript
// src/server/lib/supabase.ts
createServerSupabaseClient()  // service role — bypasses RLS, full access
createAnonSupabaseClient()    // anon key   — respects RLS, limited access
```

**The database connection:**
Supabase gives you a PostgreSQL connection string. Drizzle uses this to connect directly to Postgres for raw SQL queries — faster than going through the Supabase API.

---

### Drizzle ORM — Type-Safe Database Queries

**What is it?**
Drizzle is a TypeScript ORM (Object-Relational Mapper) that lets you query your Postgres database with full type safety. It is "SQL-first" — it thinks in SQL and generates TypeScript types from your schema.

**Why Drizzle instead of raw SQL or Supabase client?**

| Option | Type safety | Performance | Flexibility |
|---|---|---|---|
| Raw SQL strings | None | Best | Best |
| Supabase client | Partial | Good | Limited |
| **Drizzle ORM** | **Full** | **Best** | **Full** |

**Defining a table** (`src/server/db/schema.ts`):
```typescript
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Drizzle generates these types from the schema automatically:
export type User = typeof users.$inferSelect;    // { id: string, email: string, createdAt: Date }
export type NewUser = typeof users.$inferInsert; // { email: string, id?: string, ... }
```

**Querying in a tRPC procedure:**
```typescript
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const appRouter = router({
  // Get all users
  getUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(users);
    // Returns: User[]  ← TypeScript knows the exact shape
  }),

  // Get one user by email
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(({ input, ctx }) => {
      return ctx.db.select().from(users).where(eq(users.email, input.email));
    }),

  // Create a user
  createUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.insert(users).values({ email: input.email }).returning();
    }),
});
```

**Database migrations with Drizzle Kit:**

Drizzle Kit is the CLI companion to Drizzle ORM. You edit `schema.ts` and Drizzle Kit figures out what SQL to run to make the database match.

```bash
npm run db:push      # push schema directly to DB (good for development)
npm run db:generate  # generate a migration SQL file (good for production)
npm run db:migrate   # run pending migrations
npm run db:studio    # open a visual database browser at localhost:4983
```

**The Drizzle config** (`drizzle.config.ts`):
```typescript
export default defineConfig({
  schema: './spartan-analog/src/server/db/schema.ts', // your table definitions
  out: './spartan-analog/src/server/db/migrations',   // where migration files go
  dialect: 'postgresql',
  dbCredentials: { url: process.env['DATABASE_URL']! },
});
```

---

## How Everything Connects

Here is the complete picture of how the pieces relate:

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│  Angular Component                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  const trpc = inject(TrpcClient)                     │  │
│  │  const data = trpc.getUsers.query()                  │  │
│  │                  ↑ TypeScript knows the return type  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │ HTTP /api/trpc/getUsers          │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                        SERVER (Node.js / AnalogJS)          │
│                          │                                  │
│  src/server/routes/trpc/[trpc].ts  ← receives the request  │
│                          │                                  │
│  src/server/trpc/routers/index.ts  ← finds the procedure   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  getUsers: publicProcedure.query(({ ctx }) => {      │  │
│  │    return ctx.db.select().from(users);               │  │
│  │  })                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ctx.db = Drizzle client (src/server/db/index.ts)          │
│  ctx.supabase = Supabase client (src/server/lib/supabase)  │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │ PostgreSQL wire protocol
┌──────────────────────────┼──────────────────────────────────┐
│                        SUPABASE                             │
│                                                             │
│  PostgreSQL Database                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SELECT * FROM users;                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Auth  │  Storage  │  Realtime  │  Edge Functions          │
└─────────────────────────────────────────────────────────────┘
```

**Type safety flows upward:**
```
Drizzle schema (schema.ts)
    → generates TypeScript types (User, NewUser)
        → used in tRPC procedures
            → AppRouter type exported
                → TrpcClient in Angular has full knowledge of every endpoint
                    → Your component gets autocomplete and compile-time errors
```

---

## Data Flow: A Request End-to-End

Here is what happens when a user visits the home page and the component fetches data:

1. **Browser requests `/`**
2. **AnalogJS SSR** renders `(home).page.ts` on the server to HTML
3. **HTML is sent** to the browser — user sees content immediately
4. **Angular boots** in the browser and hydrates the page
5. **Component calls** `trpc.hello.query({ name: 'World' })`
6. **tRPC client** makes an HTTP request to `/api/trpc/hello`
7. **AnalogJS** routes this to `src/server/routes/trpc/[trpc].ts`
8. **tRPC server** finds the `hello` procedure and creates the context
9. **Context** (`src/server/trpc/context.ts`) provides `db` and `supabase`
10. **Procedure** runs and returns `{ greeting: 'Hello, World!' }`
11. **tRPC client** receives the response
12. **Component** renders the greeting — TypeScript knew the shape all along

---

## File Reference Guide

| File | Technology | Purpose |
|---|---|---|
| `spartan-analog/src/app/app.config.ts` | Angular | Browser-side providers. Add Angular services here. |
| `spartan-analog/src/app/app.config.server.ts` | AnalogJS | Server-side providers merged with app.config. |
| `spartan-analog/src/app/trpc-client.ts` | tRPC + Angular | Creates the typed Angular tRPC client. |
| `spartan-analog/src/app/pages/` | AnalogJS | File-based routes. Each file = one route. |
| `spartan-analog/src/server/trpc/init.ts` | tRPC | Initializes tRPC with the Context type. |
| `spartan-analog/src/server/trpc/context.ts` | tRPC | Defines what `ctx` contains in every procedure. |
| `spartan-analog/src/server/trpc/routers/index.ts` | tRPC | **Your API. Add new procedures here.** |
| `spartan-analog/src/server/routes/trpc/[trpc].ts` | AnalogJS + tRPC | Bridge that connects HTTP requests to tRPC. Do not touch. |
| `spartan-analog/src/server/db/schema.ts` | Drizzle | **Your database tables. Add columns and tables here.** |
| `spartan-analog/src/server/db/index.ts` | Drizzle | Creates the db client. Import `db` from here. |
| `spartan-analog/src/server/lib/supabase.ts` | Supabase | Server-side Supabase client factory. |
| `spartan-analog/src/styles.css` | Spartan + Tailwind | Global styles, theme CSS variables (colors, radius). |
| `spartan-analog/vite.config.ts` | AnalogJS + Vite | Build and dev server configuration. |
| `spartan-analog/project.json` | Nx | Defines the targets (serve, build, test, lint) for this project. |
| `drizzle.config.ts` | Drizzle Kit | Points to the schema and database for CLI commands. |
| `tsconfig.base.json` | TypeScript | Shared TypeScript settings across the whole workspace. |
| `.env` | — | Secret keys. Never commit. Copy from `.env.example`. |

---

## Common Commands

```bash
# Development
npx nx serve spartan-analog          # start dev server at localhost:4200

# Building
npx nx build spartan-analog          # production build

# Testing
npx nx test spartan-analog           # unit tests (Vitest)
npx nx e2e spartan-analog-e2e        # end-to-end tests (Playwright)

# Database (Drizzle)
npm run db:push                      # push schema changes to Supabase (dev)
npm run db:generate                  # generate migration SQL files
npm run db:migrate                   # apply pending migrations
npm run db:studio                    # open visual DB browser

# Spartan UI components
npx nx g @spartan-ng/cli:ui          # add UI components (interactive)
npx nx g @spartan-ng/cli:ui --name=button  # add a specific component
npx nx g @spartan-ng/cli:info --json # see installed/available components

# Nx utilities
npx nx graph                         # visualize project graph in browser
npx nx lint spartan-analog           # run ESLint
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values from the Supabase dashboard.

```bash
cp .env.example .env
```

| Variable | Where to find it | Used by |
|---|---|---|
| `SUPABASE_URL` | Supabase → Settings → API | Supabase client |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API | Supabase anon client |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | Supabase service client |
| `DATABASE_URL` | Supabase → Settings → Database → Connection string (URI, port 5432) | Drizzle ORM |

> These variables are only used server-side. They are never sent to the browser.
