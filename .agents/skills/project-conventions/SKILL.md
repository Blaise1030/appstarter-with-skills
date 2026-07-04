---
name: project-conventions
description: Use when adding or modifying any page, component, composable, or server route in apps/web - defines this project's folder structure, data-fetching, and UI conventions that agents must follow.
---

# Project Conventions

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
