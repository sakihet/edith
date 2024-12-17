import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: [
      "fake-indexeddb/auto",
      "./tests/setup.ts"
    ],
  },
})
