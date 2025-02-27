<script setup lang="ts">
import { v4 } from "uuid"

import { Note } from '../types/note'
import { notes } from '../data'
import { store } from "../store"
import { generateNoteContent } from "../utils"

const onClick = (_e: Event) => {
  const dataForDebug: Note[] = notes.map(n => {
    const now = new Date().toISOString()
    return {
      id: v4(),
      content: generateNoteContent(n.content),
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
        <button type="button" @click="onClick">Add data</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
