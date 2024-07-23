<script setup lang="ts">
import { v4 } from 'uuid'
import { onMounted, onUpdated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Editor } from '@tiptap/vue-3'
import Bold from '@tiptap/extension-bold'
import { BubbleMenu as BubbleMenuExt } from '@tiptap/extension-bubble-menu'
import BulletList from '@tiptap/extension-bullet-list'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Strike from '@tiptap/extension-strike'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'

import AppEditor from '../components/AppEditor.vue'
import { Note } from '../types/note'
import { store } from '../store'
import Commands from '../commands'
import suggestion from '../suggestion'
import IconEditSquare from '../components/IconEditSquare.vue'
import NoteItem from '../components/NoteItem.vue'

const route = useRoute()
const router = useRouter()

let editor: Editor | null

const createEditor = (content: any) => {
  return new Editor({
    content: content,
      extensions: [
        Bold,
        BubbleMenuExt,
        BulletList,
        Commands.configure({
          suggestion
        }),
        HorizontalRule,
        Italic,
        Link,
        OrderedList,
        Placeholder.configure({
          placeholder: "Write something..."
        }),
        StarterKit,
        Strike,
        TaskItem.configure({
          nested: true
        }),
        TaskList,
      ],
  })
}
onMounted(() => {
  if (route.params.noteId) {
    store.currentNote = store.notes.find(n => n.id === route.params.noteId)
    editor = createEditor(store.currentNote?.content)
    editor.chain().focus().run()
  }
})
onUpdated(() => {
})
watch (() => route.params.noteId, (noteIdAfter, noteIdBefore) => {
  if (noteIdBefore === undefined && noteIdAfter) {
    store.currentNote = store.notes.find(n => n.id === noteIdAfter)
    editor = createEditor(store.currentNote?.content)
    editor.chain().focus().run()
  } else if (noteIdAfter && noteIdBefore && (noteIdAfter !== noteIdBefore)) {
    editor?.destroy()
    store.currentNote = store.notes.find(n => n.id === noteIdAfter)
    editor = createEditor(store.currentNote?.content)
    editor.chain().focus().run()
  } else if (!noteIdAfter) {
    store.currentNote = undefined
    editor?.destroy()
  }
})
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
const handleClear = async () => {
  await store.clear()
  router.push(`/`)
}
const handleDelete = (id: string) => {
  store.delete(id)
}
</script>

<template>
  <div class="f-1 flex-column">
    <div class="f-1 flex-row">
      <div class="p-6 w-80 bg-secondary">
        <div class="layout-stack-4">
          <div class="flex-row layout-stack-h-1">
            <RouterLink
              to="/"
              class="text-decoration-none f-1"
            >
              <div class="px-2 text-secondary">Index</div>
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
          <div class="text-small text-secondary flex-row px-2">
            <div class="f-1">Notes</div>
            <div class="text-tertiary">3</div>
          </div>
          <div>
            <ul class="text-medium text-secondary layout-stack-1 list-style-none px-0">
              <li
                v-for="note in store.notes.sort((a, b) => new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1)"
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
          <div class="flex-row">
            <div class="f-1"></div>
            <button
              @click="handleClear"
              class="pattern-button-base"
            >Clear</button>
          </div>
        </div>
      </div>
      <div class="p-6 layout-center">
        <AppEditor
          v-if="store.currentNote && editor"
          :editor="editor"
          :note="store.currentNote"
        />
        <div
          v-else
          class="text-secondary"
        >Empty</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
