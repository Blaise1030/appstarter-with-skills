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
