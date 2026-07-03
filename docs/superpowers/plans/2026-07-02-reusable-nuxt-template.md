# Reusable Nuxt Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn this repo into a reusable Nuxt template by adding a CI quality gate (lint/typecheck/test) and a worked "notes" example feature that demonstrates every project convention (idiomatic Nuxt folders, server-only external data access, shadcn toast on mutations, `NuxtLink` navigation, query-param filters).

**Architecture:** Nuxt 4 app (`apps/web`) with a Nitro server (`server/api/*`) backing a single in-memory "notes" resource. Frontend reads/writes through one composable (`useNotes`) that never talks to anything but this app's own `/api/*` routes. CI runs lint → typecheck → test → build in that order so cheap checks fail fast.

**Tech Stack:** Nuxt 4, Vue 3, shadcn-vue (reka-nova style), Tailwind v4, vue-sonner (toast), Vitest + `@nuxt/test-utils` + `@vue/test-utils` + happy-dom, `@nuxt/eslint`.

Reference spec: `docs/superpowers/specs/2026-07-02-reusable-nuxt-template-design.md`

---

### Task 1: Commit pending CI/CD fixes and add workspace scripts

**Files:**
- Modify: `.github/workflows/ci.yml`, `.github/workflows/cd.yml`, `.github/workflows/release-please.yml`, `package.json` (already modified on disk, uncommitted)
- Modify: `package.json:7-11`

- [ ] **Step 1: Commit the already-made CI/CD fixes**

These changes are already on disk from an earlier session (Node 20→22 for pnpm 11 compatibility; Release Please now uses `GITHUB_TOKEN` instead of a missing GitHub App token). Commit them as their own change before adding anything new:

```bash
git add .github/workflows/ci.yml .github/workflows/cd.yml .github/workflows/release-please.yml package.json
git commit -m "fix: bump CI Node to 22 for pnpm 11 compatibility, use GITHUB_TOKEN for release-please"
```

- [ ] **Step 2: Add workspace-level lint/typecheck/test scripts**

Edit `package.json`, replacing the `scripts` block:

```json
{
  "name": "appstarter-with-skills",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.3.0",
  "scripts": {
    "dev": "pnpm --filter @appstarter/web dev",
    "build": "pnpm -r build",
    "preview": "pnpm --filter @appstarter/web preview",
    "lint": "pnpm -r --if-present run lint",
    "typecheck": "pnpm -r --if-present run typecheck",
    "test": "pnpm -r --if-present run test"
  },
  "engines": {
    "node": ">=22.13"
  }
}
```

The `--if-present` flag means `packages/shared` (which has no `lint`/`typecheck`/`test` script) is silently skipped instead of erroring.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add workspace lint/typecheck/test scripts"
```

---

### Task 2: Add ESLint to apps/web

**Files:**
- Modify: `apps/web/package.json`, `apps/web/nuxt.config.ts`
- Create: `apps/web/eslint.config.mjs`

- [ ] **Step 1: Install ESLint and the Nuxt ESLint module**

```bash
pnpm add -D eslint @nuxt/eslint --filter @appstarter/web
```

- [ ] **Step 2: Register the module in `nuxt.config.ts`**

In `apps/web/nuxt.config.ts`, change the `modules` array:

```ts
  modules: ['shadcn-nuxt', '@nuxt/eslint'],
```

(Leave everything else in the file unchanged.)

- [ ] **Step 3: Generate the Nuxt-aware ESLint config**

Run once so `.nuxt/eslint.config.mjs` exists (it's gitignored, regenerated on every `nuxt prepare`/`dev`/`build`):

```bash
pnpm --filter @appstarter/web exec nuxt prepare
```

- [ ] **Step 4: Create `apps/web/eslint.config.mjs`**

```js
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
```

- [ ] **Step 5: Add the `lint` script**

In `apps/web/package.json`, add to `scripts`:

```json
    "lint": "eslint .",
```

- [ ] **Step 6: Run lint to verify it works**

```bash
pnpm --filter @appstarter/web lint
```

Expected: exits 0 (no lint errors) or prints specific lint errors to fix. Fix any errors it reports in existing files before continuing.

- [ ] **Step 7: Commit**

```bash
git add apps/web/package.json apps/web/nuxt.config.ts apps/web/eslint.config.mjs pnpm-lock.yaml
git commit -m "chore: add ESLint via @nuxt/eslint"
```

---

### Task 3: Add typecheck to apps/web

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Install vue-tsc (required by `nuxt typecheck`)**

```bash
pnpm add -D vue-tsc --filter @appstarter/web
```

- [ ] **Step 2: Add the `typecheck` script**

In `apps/web/package.json`, add to `scripts`:

```json
    "typecheck": "nuxt typecheck",
```

- [ ] **Step 3: Run typecheck to verify it works**

```bash
pnpm --filter @appstarter/web typecheck
```

Expected: `No errors found` (or similar success output). Fix any type errors it reports before continuing.

- [ ] **Step 4: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "chore: add typecheck via nuxt typecheck"
```

---

### Task 4: Add Vitest to apps/web

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/vitest.config.ts`

- [ ] **Step 1: Install Vitest and Nuxt test utilities**

```bash
pnpm add -D vitest @nuxt/test-utils @vue/test-utils happy-dom --filter @appstarter/web
```

- [ ] **Step 2: Create `apps/web/vitest.config.ts`**

```ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
  },
})
```

- [ ] **Step 3: Add the `test` script**

In `apps/web/package.json`, add to `scripts`:

```json
    "test": "vitest run",
```

- [ ] **Step 4: Run test to verify the setup works with zero tests**

```bash
pnpm --filter @appstarter/web test
```

Expected: `No test files found` (not an error — there are no `*.test.ts` files yet, added in later tasks).

- [ ] **Step 5: Commit**

```bash
git add apps/web/package.json apps/web/vitest.config.ts pnpm-lock.yaml
git commit -m "chore: add Vitest via @nuxt/test-utils"
```

---

### Task 5: Wire lint/typecheck/test into CI

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add Lint, Typecheck, and Test steps before Build**

In `.github/workflows/ci.yml`, the `build` job currently ends with:

```yaml
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm -r build
```

Change it to:

```yaml
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm -r build
```

- [ ] **Step 2: Verify locally that all four commands pass in sequence**

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm -r build
```

Expected: all four complete successfully with exit code 0.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add lint, typecheck, and test steps before build"
```

---

### Task 6: Add the shadcn Input component

**Files:**
- Create: `apps/web/app/components/ui/input/Input.vue`
- Create: `apps/web/app/components/ui/input/index.ts`

- [ ] **Step 1: Create `apps/web/app/components/ui/input/Input.vue`**

Matches the existing `Button.vue` pattern (reka-nova style, `cn` helper, `class` prop passthrough):

```vue
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const modelValue = defineModel<string>()
</script>

<template>
  <input
    v-model="modelValue"
    :class="cn(
      'border-input file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      props.class,
    )"
  >
</template>
```

- [ ] **Step 2: Create `apps/web/app/components/ui/input/index.ts`**

```ts
export { default as Input } from './Input.vue'
```

- [ ] **Step 3: Verify it typechecks**

```bash
pnpm --filter @appstarter/web typecheck
```

Expected: `No errors found`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/components/ui/input
git commit -m "feat: add shadcn Input component"
```

---

### Task 7: Add the shadcn Sonner (toast) component

**Files:**
- Create: `apps/web/app/components/ui/sonner/Sonner.vue`
- Create: `apps/web/app/components/ui/sonner/index.ts`
- Modify: `apps/web/app/app.vue`

- [ ] **Step 1: Install vue-sonner**

```bash
pnpm add vue-sonner --filter @appstarter/web
```

- [ ] **Step 2: Create `apps/web/app/components/ui/sonner/Sonner.vue`**

```vue
<script setup lang="ts">
import { Toaster as Sonner } from 'vue-sonner'
</script>

<template>
  <Sonner class="toaster group" position="bottom-right" rich-colors />
</template>
```

- [ ] **Step 3: Create `apps/web/app/components/ui/sonner/index.ts`**

```ts
export { default as Toaster } from './Sonner.vue'
```

- [ ] **Step 4: Mount the toaster once, globally, in `apps/web/app/app.vue`**

Add `<Toaster />` next to the existing `<NuxtRouteAnnouncer />`:

```vue
<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
    <NuxtRouteAnnouncer />
    <Toaster />
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ appName }}
      </h1>
      <p class="text-muted-foreground text-sm">
        Nuxt monorepo with shadcn-vue
      </p>
    </div>
    <Button>
      Get started
    </Button>
  </div>
</template>
```

(The `<Button>` here gets replaced with a link to `/notes` in Task 12 — leave it as-is for now.)

- [ ] **Step 5: Verify the app still builds**

```bash
pnpm --filter @appstarter/web typecheck
```

Expected: `No errors found`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/package.json apps/web/app/components/ui/sonner apps/web/app/app.vue pnpm-lock.yaml
git commit -m "feat: add shadcn Sonner toast component"
```

---

### Task 8: Notes server API

**Files:**
- Create: `apps/web/server/utils/notes-store.ts`
- Create: `apps/web/server/api/notes.get.ts`
- Create: `apps/web/server/api/notes.post.ts`

- [ ] **Step 1: Create `apps/web/server/utils/notes-store.ts`**

Framework-agnostic in-memory store (no Nuxt/Nitro auto-imports used here, so it's directly importable from Vitest in Task 9 without any server runtime):

```ts
export interface Note {
  id: string
  title: string
  tag: string | null
  createdAt: string
}

const notes: Note[] = [
  { id: crypto.randomUUID(), title: 'Buy milk', tag: 'errand', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), title: 'Ship the notes feature', tag: 'work', createdAt: new Date().toISOString() },
]

export function listNotes(tag?: string): Note[] {
  return tag ? notes.filter(note => note.tag === tag) : notes
}

export function createNote(input: { title: string, tag?: string | null }): Note {
  const title = input.title?.trim()
  if (!title) {
    throw new Error('title is required')
  }
  const note: Note = {
    id: crypto.randomUUID(),
    title,
    tag: input.tag?.trim() || null,
    createdAt: new Date().toISOString(),
  }
  notes.push(note)
  return note
}
```

- [ ] **Step 2: Create `apps/web/server/api/notes.get.ts`**

`listNotes` is auto-imported from `server/utils/notes-store.ts` by Nitro:

```ts
export default defineEventHandler((event) => {
  const query = getQuery(event)
  const tag = typeof query.tag === 'string' ? query.tag : undefined
  return listNotes(tag)
})
```

- [ ] **Step 3: Create `apps/web/server/api/notes.post.ts`**

```ts
export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string, tag?: string }>(event)
  try {
    return createNote({ title: body?.title ?? '', tag: body?.tag })
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'title is required' })
  }
})
```

- [ ] **Step 4: Verify typecheck passes**

```bash
pnpm --filter @appstarter/web typecheck
```

Expected: `No errors found`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/server
git commit -m "feat: add notes server API with in-memory store"
```

---

### Task 9: useNotes composable

**Files:**
- Create: `apps/web/app/composables/useNotes.ts`
- Test: `apps/web/app/composables/useNotes.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/app/composables/useNotes.test.ts`. It reuses the real `listNotes`/`createNote` logic from Task 8 as the mocked endpoint handlers, so the actual business logic is exercised, not just HTTP plumbing:

```ts
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { createNote, listNotes } from '../../server/utils/notes-store'

vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

registerEndpoint('/api/notes', {
  method: 'GET',
  handler: () => listNotes(),
})

registerEndpoint('/api/notes', {
  method: 'POST',
  handler: () => createNote({ title: 'Read a book', tag: 'idea' }),
})

describe('useNotes', () => {
  it('fetches notes', async () => {
    const { useNotes } = await import('./useNotes')
    const { notes } = useNotes()
    await flushPromises()

    expect(notes.value.length).toBeGreaterThan(0)
    expect(notes.value.some(note => note.title === 'Buy milk')).toBe(true)
  })

  it('adds a note and shows a success toast', async () => {
    const { toast } = await import('vue-sonner')
    const { useNotes } = await import('./useNotes')
    const { addNote } = useNotes()

    const note = await addNote({ title: 'Read a book', tag: 'idea' })

    expect(note.title).toBe('Read a book')
    expect(toast.success).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
pnpm --filter @appstarter/web test
```

Expected: FAIL — `Cannot find module './useNotes'` (the file doesn't exist yet).

- [ ] **Step 3: Write `apps/web/app/composables/useNotes.ts`**

```ts
import { toast } from 'vue-sonner'
import type { Note } from '../../server/utils/notes-store'

export type { Note }

export function useNotes() {
  const route = useRoute()
  const tag = computed(() => (typeof route.query.tag === 'string' ? route.query.tag : undefined))

  const { data, status, error, refresh } = useFetch<Note[]>('/api/notes', {
    query: computed(() => (tag.value ? { tag: tag.value } : {})),
    default: () => [],
  })

  async function addNote(input: { title: string, tag?: string }) {
    try {
      const note = await $fetch<Note>('/api/notes', {
        method: 'POST',
        body: input,
      })
      await refresh()
      toast.success(`Added "${note.title}"`)
      return note
    }
    catch {
      toast.error('Failed to add note')
      throw new Error('Failed to add note')
    }
  }

  return { notes: data, status, error, addNote }
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
pnpm --filter @appstarter/web test
```

Expected: PASS — 2 passed.

- [ ] **Step 5: Run typecheck**

```bash
pnpm --filter @appstarter/web typecheck
```

Expected: `No errors found`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/app/composables
git commit -m "feat: add useNotes composable with tests"
```

---

### Task 10: NoteCard component

**Files:**
- Create: `apps/web/app/components/NoteCard.vue`
- Test: `apps/web/app/components/NoteCard.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/app/components/NoteCard.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NoteCard from './NoteCard.vue'

describe('NoteCard', () => {
  it('renders the note title and tag', () => {
    const wrapper = mount(NoteCard, {
      props: {
        note: {
          id: '1',
          title: 'Buy milk',
          tag: 'errand',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      },
    })

    expect(wrapper.text()).toContain('Buy milk')
    expect(wrapper.text()).toContain('errand')
  })

  it('omits the tag line when the note has no tag', () => {
    const wrapper = mount(NoteCard, {
      props: {
        note: {
          id: '2',
          title: 'Untagged note',
          tag: null,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      },
    })

    expect(wrapper.text()).toContain('Untagged note')
    expect(wrapper.find('[data-testid="note-tag"]').exists()).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
pnpm --filter @appstarter/web test
```

Expected: FAIL — `Failed to resolve import "./NoteCard.vue"`.

- [ ] **Step 3: Write `apps/web/app/components/NoteCard.vue`**

```vue
<script setup lang="ts">
import type { Note } from '../composables/useNotes'

defineProps<{ note: Note }>()
</script>

<template>
  <div class="rounded-lg border p-4">
    <p class="font-medium">
      {{ note.title }}
    </p>
    <p v-if="note.tag" data-testid="note-tag" class="text-muted-foreground text-xs">
      {{ note.tag }}
    </p>
  </div>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
pnpm --filter @appstarter/web test
```

Expected: PASS — 2 passed (plus the 2 from `useNotes.test.ts` — 4 total).

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/components/NoteCard.vue apps/web/app/components/NoteCard.test.ts
git commit -m "feat: add NoteCard component with tests"
```

---

### Task 11: Notes page

**Files:**
- Create: `apps/web/app/pages/notes/index.vue`

- [ ] **Step 1: Create `apps/web/app/pages/notes/index.vue`**

Demonstrates all three UI conventions: `NuxtLink` for the tag filter (query-param driven), toast-on-mutation via `useNotes().addNote`, and `Input`/`Button` from the UI kit:

```vue
<script setup lang="ts">
const { notes, status, addNote } = useNotes()
const route = useRoute()

const title = ref('')
const tags = ['work', 'errand', 'idea']

async function onSubmit() {
  if (!title.value.trim()) {
    return
  }
  const activeTag = typeof route.query.tag === 'string' ? route.query.tag : undefined
  await addNote({ title: title.value, tag: activeTag })
  title.value = ''
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-6 p-6">
    <h1 class="text-xl font-semibold">
      Notes
    </h1>

    <nav class="flex gap-3">
      <NuxtLink
        to="/notes"
        class="text-sm underline-offset-4"
        :class="!route.query.tag ? 'font-semibold underline' : 'text-muted-foreground hover:underline'"
      >
        All
      </NuxtLink>
      <NuxtLink
        v-for="t in tags"
        :key="t"
        :to="{ path: '/notes', query: { tag: t } }"
        class="text-sm underline-offset-4"
        :class="route.query.tag === t ? 'font-semibold underline' : 'text-muted-foreground hover:underline'"
      >
        {{ t }}
      </NuxtLink>
    </nav>

    <form class="flex gap-2" @submit.prevent="onSubmit">
      <Input v-model="title" placeholder="New note" class="flex-1" />
      <Button type="submit">
        Add
      </Button>
    </form>

    <p v-if="status === 'pending'" class="text-muted-foreground text-sm">
      Loading...
    </p>

    <div class="flex flex-col gap-2">
      <NoteCard v-for="note in notes" :key="note.id" :note="note" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm --filter @appstarter/web typecheck
```

Expected: `No errors found`.

- [ ] **Step 3: Manually verify in the browser**

```bash
pnpm dev
```

Open `http://localhost:3000/notes`. Verify: the two seeded notes render; clicking `work`/`errand`/`idea` filters the list and updates the URL query string; adding a note shows a toast and the new note appears in the list. Stop the dev server (Ctrl+C) when done.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/pages
git commit -m "feat: add notes page with tag filter and add-note form"
```

---

### Task 12: Link home page to /notes

**Files:**
- Modify: `apps/web/app/app.vue`

- [ ] **Step 1: Replace the plain `<Button>` with a `NuxtLink`-backed button**

In `apps/web/app/app.vue`, replace:

```vue
    <Button>
      Get started
    </Button>
```

with:

```vue
    <Button as-child>
      <NuxtLink to="/notes">
        View notes
      </NuxtLink>
    </Button>
```

(`as-child` makes the `Button`'s reka-ui `Primitive` render the child `NuxtLink` instead of a `<button>`, keeping the button's styles while producing a real link — this is the shadcn-vue pattern for link-styled-as-button, and satisfies the "always use links when navigating to different pages" convention.)

- [ ] **Step 2: Run typecheck**

```bash
pnpm --filter @appstarter/web typecheck
```

Expected: `No errors found`.

- [ ] **Step 3: Manually verify in the browser**

```bash
pnpm dev
```

Open `http://localhost:3000/`. Verify the "View notes" link navigates to `/notes`. Stop the dev server (Ctrl+C) when done.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/app.vue
git commit -m "feat: link home page to /notes"
```

---

### Task 13: Project conventions skill

**Files:**
- Create: `.agents/skills/project-conventions/SKILL.md`

- [ ] **Step 1: Create `.agents/skills/project-conventions/SKILL.md`**

```markdown
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

See the `notes` feature for a worked example of every convention above:
- `apps/web/server/utils/notes-store.ts`, `apps/web/server/api/notes.get.ts`, `apps/web/server/api/notes.post.ts`
- `apps/web/app/composables/useNotes.ts`
- `apps/web/app/components/NoteCard.vue`
- `apps/web/app/pages/notes/index.vue`
```

- [ ] **Step 2: Commit**

```bash
git add .agents/skills/project-conventions
git commit -m "docs: add project-conventions skill"
```

---

### Task 14: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full CI sequence locally**

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm -r build
```

Expected: all four steps pass with exit code 0. If any step fails, fix the underlying issue in the relevant task's files (do not skip or weaken the check) and re-run.

- [ ] **Step 2: Confirm git status is clean**

```bash
git status --short
```

Expected: no output (everything committed).

- [ ] **Step 3: Push and confirm CI passes on GitHub**

```bash
git push
gh run watch
```

Expected: the CI workflow run completes with all jobs green.
