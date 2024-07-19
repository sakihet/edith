<script setup lang="ts">
import { v4 } from 'uuid'
import IconClose from '../components/IconClose.vue'
import IconEditSquare from '../components/IconEditSquare.vue'
import IconMoreHoriz from '../components/IconMoreHoriz.vue'
import IconSearch from '../components/IconSearch.vue'
import NoteItem from '../components/NoteItem.vue'
import NoteList from '../components/NoteList.vue'
import { Note } from '../types/note'

const content1 = {
  "type": "doc",
  "content": [
    {
      "content": [
        {
          "text": "Note 1",
          "type": "text"
        }
      ],
      "type": "paragraph"
    }
  ]
}
const content2 = {
  "type": "doc",
  "content": [
    {
      "content": [
        {
          "text": "Note 2",
          "type": "text"
        }
      ],
      "type": "paragraph"
    }
  ]
}
const content3 = {
  "type": "doc",
  "content": [
    {
      "content": [
        {
          "text": "Note 3",
          "type": "text"
        }
      ],
      "type": "paragraph"
    }
  ]
}
const now = new Date().toISOString()
const notes: Array<Note> = [
  {
    id: v4(),
    content: content1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: v4(),
    content: content2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: v4(),
    content: content3,
    createdAt: now,
    updatedAt: now
  },
]
</script>

<template>
  <div class="p-6 layout-stack-8">
    <h1>Sandbox</h1>
    <h2>Icon</h2>
    <div class="">
      <IconClose />
      <IconEditSquare />
      <IconMoreHoriz />
      <IconSearch />
    </div>
    <h2>Button</h2>
    <div class="layout-stack-2">
      <button
        type="button"
        class="pattern-button-base"
      >Button</button>
      <button
        type="button"
        class="pattern-button-icon"
      >
        <IconEditSquare />
      </button>
      <button
        type="button"
        class="pattern-button-icon"
      >
        <IconClose />
      </button>
      <button
        type="button"
        class="pattern-button-icon"
      >
        <IconMoreHoriz />
      </button>
      <button
        type="button"
        class="pattern-button-icon"
      >
        <IconSearch />
      </button>
    </div>
    <h2>Dropdown</h2>
    <div>
      <div class="flex-row layout-stack-h-1">
        <div class="text-secondary">Content</div>
        <details class="pattern-dropdown">
          <summary class="w-6 h-6">
            <div class="pattern-button-icon">
              <IconMoreHoriz />
            </div>
          </summary>
          <div>
            <ul class="list-style-none px-0 border-solid border-1 border-color-default py-2">
              <li><div class="px-4 h-8 py-1 hover pointer">Item</div></li>
              <li><div class="px-4 h-8 py-1 hover pointer">Item</div></li>
              <li><div class="px-4 h-8 py-1 hover pointer">Item</div></li>
            </ul>
          </div>
        </details>
      </div>
    </div>
    <h2>NoteItem</h2>
    <div class="w-64">
      <NoteItem :note="notes[0]" />
    </div>
    <h2>NoteList</h2>
    <div class="w-64">
      <NoteList :notes="notes" />
    </div>
  </div>
</template>

<style scoped>
</style>
