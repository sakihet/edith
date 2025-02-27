<script setup lang="ts">
import { v4 } from "uuid"

import { Note } from '../types/note'
import { japaneseCitiesWithDescriptions, japaneseCitiesWithDescriptionsJa } from '../data'
import { store } from "../store"
import { generateNoteContent } from "../utils"

const addNotes = (_e: Event) => {
  const dataForDebug: Note[] = japaneseCitiesWithDescriptions.map(n => {
    const now = new Date().toISOString()
    return {
      id: v4(),
      content: generateNoteContent(n.description),
      createdAt: now,
      updatedAt: now,
    }
  })
  dataForDebug.map(x => {
    store.add(x)
  })
}
const addNotesJa = (_e: Event) => {
  const dataForDebug: Note[] = japaneseCitiesWithDescriptionsJa.map(n => {
    const now = new Date().toISOString()
    return {
      id: v4(),
      content: generateNoteContent(n.description),
      createdAt: now,
      updatedAt: now,
    }
  })
  dataForDebug.map(x => {
    store.add(x)
  })
}
</script>

<template>
  <div class="p-6">
    <div class="layout-stack-4">
      <h1>Debug</h1>
      <div>
        <button type="button" @click="addNotes">Add notes</button>
      </div>
      <div>
        <button type="button" @click="addNotesJa">Add notes(ja)</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
