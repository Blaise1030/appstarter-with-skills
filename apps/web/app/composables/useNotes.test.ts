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
