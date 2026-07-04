---
name: bootstrap-services
description: Use when bootstrapping a new app off this starter and deciding whether it needs a database, auth, file storage, or background jobs. Also use when the user asks to "add a database", "add auth/login", "add file uploads", or "add background jobs/queues" for the first time in a project that doesn't have one yet.
---

# Bootstrap Services

This app starts with none of the services below wired up (see `project-conventions`: "No database yet"). Adding one is a real architectural decision, not a default — this skill interviews the developer first, then only walks through the sections the app actually needs.

## Step 0: Interview

Ask these one at a time, in order. Recommend an answer per [Decision defaults](#decision-defaults) but let the developer override.

1. **Does this app need data to persist beyond a single deploy?** (the in-memory `*-store.ts` pattern isn't enough) → if yes, do [Database](#database).
2. **Does this app need user accounts or login?** → if yes, do [Auth](#auth). (Implies yes to Database — auth needs somewhere to persist users/sessions.)
3. **Does this app need file or image uploads?** → if yes, do [Storage](#storage).
4. **Does this app need background/async work** (processing after the response is sent, retries, scheduled work)? → if yes, do [Queues](#queues).

Skip any section whose answer was no. Don't wire up a service the developer didn't ask for.

Before starting any section's implementation, apply the `codebase-design` skill to shape the module (interface, seam, depth) before writing the wiring code — don't just follow the reference file's example verbatim without designing the seam for this app.

## Decision defaults

| Concern | Default | Why |
|---|---|---|
| Database | Drizzle ORM, engine left to the developer (D1 or Postgres via Hyperdrive) | Consistent schema/query layer regardless of underlying engine; has a first-party better-auth adapter |
| Auth | better-auth | Self-hosted, TS-native, Cloudflare Workers-friendly, has a Drizzle adapter |
| Storage | Cloudflare R2 | Native Workers binding, no external account |
| Queues | Cloudflare Queues | Native Workers binding, no external account |

## Database

See [references/database.md](references/database.md).

## Auth

See [references/auth.md](references/auth.md). Needs [Database](#database) done first (better-auth persists via the Drizzle adapter). For sending verification/reset emails, use the existing `cloudflare-email-service` skill — don't re-document email here.

## Storage

See [references/storage.md](references/storage.md).

## Queues

See [references/queues.md](references/queues.md).

## Recording the decision

`CONTEXT.md` in this repo is a glossary only (see `domain-modeling`) — never write implementation decisions into it.

- For each section completed, write an ADR at `docs/adr/NNNN-<slug>.md` (e.g. `0001-database-drizzle.md`) capturing what was chosen and why. Create `docs/adr/` if it doesn't exist yet.
- Only touch `CONTEXT.md` if the interview surfaced new domain vocabulary worth defining (e.g. "Session", "Account") — and only add the term, never the implementation reasoning behind it.
