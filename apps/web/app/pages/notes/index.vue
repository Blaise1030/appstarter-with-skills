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
