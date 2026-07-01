# Reusable Nuxt Template for AFK Agent Work

## Goal

Turn this pnpm monorepo (Nuxt 4 + Cloudflare Workers, shadcn-vue) into a template that can be cloned as the starting point for new app projects, with strong enough structure and conventions that an agent can take a spec/issue, implement it, and open a PR unsupervised.

## Reuse model

Clone/fork as a starting point. No ongoing sync tooling between the template and downstream projects — each clone diverges freely after creation. The existing `.agents/skills/` + `skills-lock.json` mechanism (pulling skills from `cloudflare/skills`, `mattpocock/skills`, etc.) is unchanged and continues to be the way external skills get vendored in, both in this repo and in projects cloned from it.

## CI quality gate

Currently `ci.yml` only runs `pnpm -r build`. Add, in order, before build:

1. **Lint** — `@nuxt/eslint` module, Nuxt's zero-config ESLint setup for TS+Vue.
2. **Typecheck** — `nuxt typecheck` (already available via Nuxt, currently unused in CI).
3. **Test** — Vitest (`vitest`, `@vue/test-utils`, `happy-dom`), run via `pnpm -r test`.

Rationale: cheapest checks run first so an agent's PR fails fast. This is the safety net that lets an agent self-verify before opening a PR, per the project's `verification-before-completion` and `test-driven-development` skills.

## Example vertical slice: "notes"

A minimal worked example establishing the pattern every future feature follows. No database — in-memory data, so the template stays infra-agnostic.

- `apps/web/server/api/notes.get.ts`, `notes.post.ts` — in-memory array of notes.
- `apps/web/app/composables/useNotes.ts` — wraps `useFetch`/`$fetch` against `/api/notes`.
- `apps/web/app/pages/notes/index.vue` — list + add form, built from shadcn-vue `Button`/`Input`.
- `apps/web/app/components/NoteCard.vue` — single-purpose display component.
- `apps/web/app/composables/useNotes.test.ts` and `apps/web/app/components/NoteCard.test.ts` — Vitest coverage for the composable and component.

Demonstrates all three UI conventions below: the add-note form fires a toast on success/failure, the home page (`app.vue`) links to `/notes` via `NuxtLink` (not `<a>`/`router.push`), and the notes list supports a `?tag=` filter reflected in the URL.

## Folder structure convention

Idiomatic Nuxt (type-based), not feature-folders: `app/pages/`, `app/components/`, `app/composables/`, `server/api/`. This matches Nuxt's auto-import conventions and the vendored `.agents/skills/nuxt` reference exactly, so agents get correct behavior without a project-specific override to learn. Feature-folders were considered and rejected — they only pay off at a scale (many unrelated domains) this template isn't targeting, and would require an extra rule taught in every downstream project's docs.

## Data-fetching convention

Composables call `$fetch`/`useFetch` only against this app's own `/api/*` routes. Server routes (`server/api/*`) are the only place that talk to anything external (a real backend, a third-party API, a database — none exist yet). This keeps the frontend swappable later: the mock in-memory data in `server/api/notes.get.ts` can be replaced with a real backend without touching any page or component.

## UI conventions

- **Toast on mutations.** Every create/update/delete calls a shadcn-vue toast on both success and failure (`Sonner`/`useToast` from `shadcn-vue`, added via the shadcn CLI like the existing `Button` component). No silent mutations — the user always gets feedback, and agents don't need to invent ad-hoc feedback patterns per feature.
- **`NuxtLink` for navigation.** Any link between pages uses `<NuxtLink>`, never `<a href>` or programmatic `router.push` for plain navigation (`router.push` is still fine for post-mutation redirects). Preserves Nuxt's client-side routing and prefetching by default.
- **Query params for filters.** Any page with filterable/sortable list state reflects that state in the URL via `useRoute().query` / `navigateTo({ query })`, not local component state. Makes filtered views shareable/bookmarkable and gives agents one consistent place to read and write filter state instead of reinventing it per page.

## Error handling

Server routes throw `createError({ statusCode, message })`. Pages and composables surface errors via Nuxt's built-in `error` state from `useFetch` (`const { data, error } = await useFetch(...)`). No custom error-boundary abstraction — YAGNI until a project actually needs one.

## Conventions doc

Add `.agents/skills/project-conventions/SKILL.md` capturing the folder-structure, data-fetching, and UI conventions above, so agents pick it up the same way they pick up the vendored Cloudflare/Nuxt skills. The root `CLAUDE.md` currently contains only the context-mode plugin's auto-injected routing rules (untracked as of this writing) — once reviewed, project-specific conventions can live there instead of or alongside that content; this is a follow-up decision for the user, not part of this design.

## `packages/shared`

Left as-is (placeholder `appName` export). No design work until a second real consumer of shared code exists — YAGNI.

## Out of scope

- Auth, database, deployment beyond what already exists (Cloudflare Workers via Wrangler).
- Any sync mechanism between the template and projects cloned from it.
- Redesigning `packages/shared`.
