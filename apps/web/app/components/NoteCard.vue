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
