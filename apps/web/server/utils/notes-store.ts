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
