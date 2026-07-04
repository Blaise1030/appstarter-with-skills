# Database

Standardize on **Drizzle ORM** for schema and queries; stay agnostic about the underlying engine.

## Engine choice (ask the developer)

- **Cloudflare D1** — SQLite at the edge, no external account, works with `wrangler` locally. Default unless the app needs a feature D1 doesn't have (e.g. heavier concurrent writes, extensions Postgres has and SQLite doesn't).
- **Postgres via Hyperdrive** — connects to an external managed Postgres (Neon, Supabase, etc.) through Cloudflare Hyperdrive for pooling. Pick this only if the developer already has or wants a Postgres provider.

## Wiring

Apply `codebase-design` first: the store module is the seam — keep its interface (`list*`/`create*`/`update*`/`delete*`) deep and unaware of Drizzle-vs-in-memory from the caller's side.

1. Add the binding to `apps/web/wrangler.jsonc`:
   ```jsonc
   // D1
   { "d1_databases": [{ "binding": "DB", "database_name": "...", "database_id": "..." }] }
   // or Hyperdrive
   { "hyperdrive": [{ "binding": "HYPERDRIVE", "id": "..." }] }
   ```
2. Define schema in `apps/web/server/utils/schema.ts` using `drizzle-orm/sqlite-core` (D1) or `drizzle-orm/pg-core` (Postgres).
3. Create the Drizzle client from the binding, e.g. `apps/web/server/utils/db.ts`:
   ```ts
   import { drizzle } from 'drizzle-orm/d1'
   export const useDb = (event: H3Event) => drizzle(event.context.cloudflare.env.DB)
   ```
4. Replace the in-memory `*-store.ts` pattern from `project-conventions` with Drizzle queries, keeping the same function shape (`list*`/`create*`/`update*`/`delete*`, plain `Error` on invalid input) so `server/api/*` and composables don't change shape.
5. Migrations: `drizzle-kit` generates SQL migrations; run via `wrangler d1 migrations apply` (D1) or the project's existing Postgres migration flow.

## Checklist before considering this done

- [ ] Engine chosen and binding present in `wrangler.jsonc`
- [ ] Schema file exists and typechecks
- [ ] At least one store module migrated from in-memory to Drizzle, tests updated
- [ ] Migration generated and applied locally
- [ ] ADR written (see main skill file)
