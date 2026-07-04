# Landing + Docs Page Design

## Goal

Replace the placeholder homepage with a T3-style (create.t3.gg) marketing landing page, and add a docs page, positioning this starter as a fast way to spin up business applications in the AI age.

## Landing page

`apps/web/app/pages/index.vue` (replaces current placeholder content):

- Hero: app name (`appName` from `@appstarter/shared`), tagline ("Ship business apps at AI speed"), primary CTA button → `/docs`, secondary CTA → GitHub repo link
- Stack grid: cards for Nuxt, shadcn-vue, Cloudflare Workers (nitro `cloudflare_module` preset), pnpm monorepo, Vitest, and bundled Claude Code skills — each with a one-line "why it's here"
- Static terminal-style code snippet block showing clone/install/dev steps
- Footer with GitHub link

## Docs page

Add `@nuxt/content` to `apps/web` as a new dependency (idiomatic Nuxt way to author docs as markdown, closest analog to T3's MDX docs).

- `apps/web/content/1.getting-started.md` — clone/install/dev/deploy steps, project structure overview, and a blurb pointing to the `bootstrap-services` Claude Code skill for scaffolding new features/services
- `apps/web/app/pages/docs/[...slug].vue` — catch-all page, queries the content collection and renders via `<ContentRenderer>`, with a simple left sidebar nav built from the queried page list
- Route: `/docs`

Scope is a single getting-started doc for now — no multi-page nav complexity, no search, no versioning, no custom MDX components. Add those later if there's more than one doc page to navigate between.

## Removed

The `/notes` demo page, `NoteCard.vue`, `useNotes.ts`, and their tests — dead demo code once the landing page no longer points to it.

## Out of scope

- Docs search, sidebar generated from multiple sections, versioning
- Any backend/API changes
