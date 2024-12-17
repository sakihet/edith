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
})
