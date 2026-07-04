import { describe, expect, it } from 'vitest'
import { createNote, listNotes } from './notes-store'

describe('notes-store', () => {
  it('lists all notes by default', () => {
    expect(listNotes().length).toBeGreaterThanOrEqual(2)
  })

  it('filters notes by tag', () => {
    const filtered = listNotes('errand')
    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every(note => note.tag === 'errand')).toBe(true)
  })

  it('creates a note with a trimmed title and tag', () => {
    const note = createNote({ title: '  Read a book  ', tag: ' idea ' })

    expect(note.title).toBe('Read a book')
    expect(note.tag).toBe('idea')
    expect(note.id).toBeTruthy()
    expect(listNotes()).toContainEqual(note)
  })

  it('defaults tag to null when omitted', () => {
    const note = createNote({ title: 'Untagged' })

    expect(note.tag).toBeNull()
  })

  it('throws when title is empty or whitespace-only', () => {
    expect(() => createNote({ title: '' })).toThrow('title is required')
    expect(() => createNote({ title: '   ' })).toThrow('title is required')
  })
})
