import { expect, test } from "vitest"
import { store } from "../../src/store"

test('store', () => {
  expect(store.isLoaded).toBe(false)
  expect(store.theme).toBe('light')
  expect(store.notes.length).toBe(0)
})
