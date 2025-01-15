import { describe, expect, it } from "vitest"
import { store } from "../../src/store"
import { v4 } from "uuid"
import { Note } from "../../src/types/note"

describe('store', () => {
  it('init', async () => {
    expect(store.isLoaded).toBe(false)
    expect(store.theme).toBe('light')
    expect(store.notes.length).toBe(0)
    await store.init()
    expect(store.isLoaded).toBe(true)
  })
  it('add', async () => {
    const now = new Date().toISOString()
    const n: Note = {
      id: v4(),
      content: {
        "type": "doc",
        "content": []
      },
      createdAt: now,
      updatedAt: now
    }
    await store.add(n)
    expect(store.notes.length).toBe(1)
  })
  it('clear', async () => {
    await store.clear()
    expect(store.notes.length).toBe(0)
  })
  it('delete', async () => {
    const now = new Date().toISOString()
    const n: Note = {
      id: v4(),
      content: {
        "type": "doc",
        "content": []
      },
      createdAt: now,
      updatedAt: now
    }
    await store.add(n)
    expect(store.notes.length).toBe(1)
    await store.delete(n.id)
    expect(store.notes.length).toBe(0)
  })
  it('put', async () => {
    const now = new Date().toISOString()
    const n: Note = {
      id: v4(),
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: "hello",
                type: "text"
              }
            ]
          }
        ]
      },
      createdAt: now,
      updatedAt: now
    }
    await store.add(n)
    expect(store.notes.length).toBe(1)
    const updatedParagraph = {
      type: "paragraph",
      content: [
        {
          text: "world",
          type: "text"
        }
      ]
    }
    const updated = {
      ...n,
      content: {
        type: "doc",
        content: [
          updatedParagraph
        ]
      }
    }
    await store.put(updated)
    expect(store.notes[0] && store.notes[0].content.content[0].content[0].text).toBe("world")
  })
})
