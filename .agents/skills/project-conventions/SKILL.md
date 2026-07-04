---
name: project-conventions
description: Use when adding or modifying any page, component, composable, or server route in apps/web, or when adding a new feature/resource from scratch - defines this project's folder structure, data-fetching, and UI conventions, plus a step-by-step recipe for scaffolding a new feature.
---

# Project Conventions

## Tech stack

- **Nuxt 4 + Nitro on Cloudflare Workers** — SSR framework and its deploy target; drives the server/api convention below (Nitro is the server runtime, Workers is where it runs).
- **shadcn-vue + Tailwind v4** — component primitives and styling; new UI components are added via the shadcn CLI (`apps/web/app/components/ui/*`), not hand-rolled or pulled from another component library.
- **vue-sonner** — toast notifications; use `toast.success()`/`toast.error()`, not a custom toast implementation.
- **Vitest + `@nuxt/test-utils` + `@vue/test-utils` + happy-dom** — testing; `registerEndpoint` mocks `/api/*` calls in composable tests, `mount` renders components directly.
- **ESLint via `@nuxt/eslint`** — zero-config lint setup for TS+Vue, wired into CI ahead of typecheck/test/build.
- **No database yet.** Persistence is in-memory (see `notes-store.ts`). Adding a real database is a separate, not-yet-made decision — don't reach for one in a new feature without checking with the user first.

## Folder structure

Idiomatic Nuxt (type-based), not feature-folders: `app/pages/`, `app/components/`, `app/composables/`, `server/api/`. Follow Nuxt's auto-import conventions exactly — no manual imports for components, composables, or server utils within their respective directories.

## Data fetching

Composables call `$fetch`/`useFetch` only against this app's own `/api/*` routes. Server routes (`server/api/*`) are the only place that talk to anything external (a real backend, a third-party API, a database). Never call an external URL directly from a composable, page, or component.

## UI conventions

- **Toast on mutations.** Every create/update/delete calls a shadcn-vue toast (`vue-sonner`'s `toast.success()` / `toast.error()`) on both success and failure. No silent mutations.
- **`NuxtLink` for navigation.** Any link between pages uses `<NuxtLink>`, never `<a href>` or programmatic `router.push` for plain navigation. (`router.push`/`navigateTo` is fine for post-mutation redirects.) To make a link look like a button, use `<Button as-child><NuxtLink to="...">...</NuxtLink></Button>`.
- **Query params for filters.** Any page with filterable/sortable list state reflects that state in the URL via `useRoute().query`, read and written through `NuxtLink`/`navigateTo({ query })` — never local component state alone.

## Reference implementation

See the `notes` feature for a worked example of most conventions above (it only demonstrates create — apply the same success/error toast pattern from `addNote` in `useNotes.ts` to update/delete):
- `apps/web/server/utils/notes-store.ts`, `apps/web/server/api/notes.get.ts`, `apps/web/server/api/notes.post.ts`
- `apps/web/app/composables/useNotes.ts`
- `apps/web/app/components/NoteCard.vue`
- `apps/web/app/pages/notes/index.vue`

## Adding a new feature

Given a resource name (e.g. `todos`), scaffold it the same way as `notes`, copying and adapting each file:

1. **Store** — `apps/web/server/utils/<resource>-store.ts`. Plain TS module (no Nitro auto-imports), so it's directly importable from Vitest. Export an in-memory array plus `list*`/`create*` (and `update*`/`delete*` if the feature needs them) functions. Throw a plain `Error` on invalid input.
2. **Server API** — `apps/web/server/api/<resource>.get.ts` (and `.post.ts`/`.put.ts`/`.delete.ts` as needed). Thin `defineEventHandler` wrappers that call the store functions (auto-imported by Nitro) and `createError({ statusCode, statusMessage })` on failure.
3. **Composable** — `apps/web/app/composables/use<Resource>.ts`. Wraps `useFetch`/`$fetch` against `/api/<resource>` only. Every mutation calls `toast.success()`/`toast.error()` and re-`refresh()`s the list on success. Write its test (`use<Resource>.test.ts`) first, using `registerEndpoint` backed by the real store functions from step 1.
4. **Display component** — `apps/web/app/components/<Resource>Card.vue`. Single-purpose, props-in, no data fetching. Write its test first.
5. **Page** — `apps/web/app/pages/<resource>/index.vue`. Reads the composable, renders the list + a form. If the resource is filterable, drive the filter through `useRoute().query`/`NuxtLink`, per the UI conventions above — don't invent local component state for it.
6. **Link it** — add a `NuxtLink` to the new page from wherever makes sense (e.g. the home page), per the navigation convention above.

Run `pnpm --filter @appstarter/web typecheck` and `pnpm --filter @appstarter/web test` after each step, not just at the end.
