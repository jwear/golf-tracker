# Golf Tracker

A full-stack golf round tracker — built as an Nx monorepo with a NestJS REST API and a React SPA.

```
golf-tracker/
├── api/              # NestJS REST API   → port 3001
├── web/              # React SPA         → port 3000
├── nx.json           # Nx workspace configuration
├── package.json      # Root dependencies & scripts
└── tsconfig.base.json
```

## Tech Stack

### Backend — `api/`

- [NestJS](https://nestjs.com/) — REST API framework
- [TypeORM](https://typeorm.io/) — ORM with migration support
- [PostgreSQL](https://www.postgresql.org/) — relational database
- TypeScript — language
- Jest — unit testing

### Frontend — `web/`

- [React 19](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — build tool & dev server
- [TanStack React Query](https://tanstack.com/query) — server state & caching
- [React Router v6](https://reactrouter.com/) — client-side routing
- [React Hook Form](https://react-hook-form.com/) — form state management
- [Zod](https://zod.dev/) — schema validation
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- Vitest — unit testing
- Playwright — e2e testing

## Prerequisites

- [Node.js](https://nodejs.org/) (recent LTS)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running locally
- [Nest CLI](https://docs.nestjs.com/cli/overview): `npm install -g @nestjs/cli`

## First-Time Setup

1. **Clone and install dependencies** (installed at the workspace root — this is an Nx integrated monorepo, so there's a single `package.json` at the root, not one per app):

   ```bash
   git clone <repo-url> golf-tracker
   cd golf-tracker
   npm install --legacy-peer-deps
   ```

   > `--legacy-peer-deps` is required due to a peer-dependency version mismatch between `typeorm` and `ts-node` pulled in by Nx's jest tooling. This is also set permanently via the repo's `.npmrc`.

2. **Create the database:**

   ```bash
   psql postgres
   ```

   ```sql
   CREATE DATABASE golf_tracker;
   \q
   ```

3. **Configure environment variables** — create `api/.env`:

   ```dotenv
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=<your_postgres_user>
   DB_PASSWORD=
   DB_NAME=golf_tracker
   JWT_SECRET=your-super-secret-key
   PORT=3001
   ```

4. **Run migrations** to build out the schema:
   ```bash
   npm run migration:run
   ```

## Running the App

```bash
# Start both api and web concurrently
npm run dev

# Or start individually
npm run api        # NestJS backend, http://localhost:3001
npm run web         # Vite dev server, http://localhost:3000
```

The `web` Vite dev server proxies `/api/*` requests to `http://localhost:3001`, so frontend and backend can be developed together without CORS issues.

## Database Migrations

Migrations are managed via a standalone TypeORM `DataSource` (`api/src/datasource.ts`), separate from the Nest app's `TypeOrmModule` connection — the CLI runs outside Nest's dependency injection, so it needs its own connection config sourced directly from `.env` via `dotenv`.

```bash
npm run migration:generate   # scaffold a new migration by diffing entities against the DB
npm run migration:run        # apply pending migrations
npm run migration:revert     # roll back the last migration
```

## Project Structure

```
api/
├── src/
│   ├── main.ts                          # bootstrap — listens on port 3001
│   ├── datasource.ts                    # standalone TypeORM config, used by the CLI
│   ├── app/
│   │   ├── app.module.ts                # root module — Config + TypeORM wiring
│   │   └── modules/
│   │       └── rounds/
│   │           ├── rounds.controller.ts
│   │           ├── rounds.service.ts
│   │           ├── rounds.module.ts
│   │           ├── entities/
│   │           └── dto/
│   └── migrations/                      # generated TypeORM migrations
└── .env                                  # DB credentials & JWT secret (not committed)

web/
├── src/
│   ├── main.tsx                         # entry point
│   ├── router.tsx                       # route definitions
│   ├── features/                        # feature-based pages/components
│   ├── components/                      # reusable UI
│   └── lib/                             # API client, query client, schemas
└── vite.config.ts                       # dev proxy: /api/* → localhost:3001
```

## Notes

- `.env` is gitignored — never commit real credentials.
- `.npmrc` (with `legacy-peer-deps=true`) is committed, since it's shared project config, not a secret.
- `synchronize` is set to `false` in both the app's TypeORM config and `datasource.ts` — schema changes always go through migrations, never auto-sync.
