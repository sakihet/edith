<script setup lang="ts">
import { v4 } from 'uuid'
import { useRouter } from 'vue-router'

import { version } from '../../package.json'
import IconEditSquare from '../components/IconEditSquare.vue'
import IconMoreHoriz from '../components/IconMoreHoriz.vue'
import NoteItem from '../components/NoteItem.vue'
import AppDialog from '../components/AppDialog.vue'
import { Note } from '../types/note'
import { commandMenuModifier, store } from '../store'

const router = useRouter()

const openDialog = async () => {
  store.isOpenDialog = true
}
const handleAdd = async () => {
  const now = new Date().toISOString()
  const note: Note = {
    id: v4(),
    content: {
      "type": "doc",
      "content": []
    },
    createdAt: now,
    updatedAt: now
  }
  await store.add(note)
  router.push(`/${note.id}`)
}
const handleClickSearch = () => {
  openDialog()
}
const handleSort = (sortKey: string) => {
  store.sort(sortKey)
}
const handleClear = async () => {
  if(window.confirm('Do you really want to delete all notes?')) {
    await store.clear()
    router.push(`/`)
  }
}
const handleDelete = (id: string) => {
  if(window.confirm('Do you really want to delete?')) {
    store.delete(id)
  }
}

const modifiler = commandMenuModifier === 'Meta' ? '⌘' : 'Ctrl'

</script>

<template>
  <div class="f-1 flex-row">
    <div class="pt-6 w-80 bg-secondary flex-column layout-stack-2">
      <div class="pl-6 pr-4 flex-row layout-stack-h-2">
        <RouterLink
          to="/"
          class="text-decoration-none f-1"
        >
          <div class="px-2 text-secondary hover">Index</div>
        </RouterLink>
        <div>
          <button
            type="button"
            title="Create a new note"
            class="pattern-button-icon"
            @click="handleAdd"
          >
            <IconEditSquare />
          </button>
        </div>
      </div>
      <div class="pl-6 pr-4">
        <button
          type="button"
          class="w-full px-2 border-none text-secondary flex-row pointer bg-transparent hover"
          @click="handleClickSearch"
        >
          <div class="f-1 text-left">
            Search
          </div>
          <div class="font-mono flex align-items-center">{{ modifiler }} + k</div>
        </button>
      </div>
      <div class="pl-6 pr-4 pt-2 text-secondary flex-row layout-stack-h-2">
        <div class="f-1 px-2 text-tertiary bold">Notes</div>
        <div class="text-tertiary h-6 text-center">{{ store.notes.length }}</div>
        <details
          class="pattern-dropdown pattern-hidden-child text-small"
        >
          <summary class="w-6 h-6 hover">
            <IconMoreHoriz />
          </summary>
          <div class="bg-primary drop-shadow">
            <ul class="list-style-none px-0 border-solid border-1 border-color-default py-2">
              <li>
                <button
                  @click="handleSort('updated')"
                  class="pattern-button-dropdown nowrap w-full"
                >
                  Sort by updated
                </button>
              </li>
              <li>
                <button
                  @click="handleSort('created')"
                  class="pattern-button-dropdown nowrap w-full"
                >
                  Sort by created
                </button>
              </li>
              <li>
                <button
                  @click="handleClear"
                  class="pattern-button-dropdown w-full"
                >
                  Clear
                </button>
              </li>
            </ul>
          </div>
        </details>
      </div>
      <div class="f-1 pl-6 pattern-height-note-list overflow-y-scroll pattern-scrollbar-thin">
        <ul class="text-medium text-secondary layout-stack-1 list-style-none px-0">
          <li
            v-for="note in store.notes"
            :key="note.id"
            class=""
          >
            <NoteItem
              :note="note"
              @delete-note="handleDelete(note.id)"
            />
          </li>
        </ul>
      </div>
      <div class="pl-6 pr-4 h-14 text-tertiary text-small font-mono">
        <span class="px-2">v {{ version }}</span>
      </div>
    </div>
    <router-view />
    <AppDialog v-if="store.isOpenDialog" />
  </div>
</template>
