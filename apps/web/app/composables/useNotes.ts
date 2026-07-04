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
