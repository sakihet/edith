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
})
onUpdated(() => {
})
watch (() => route.params.noteId, (noteIdAfter, noteIdBefore) => {
  if (noteIdBefore === undefined && noteIdAfter) {
    store.currentNote = store.notes.find(n => n.id === noteIdAfter)
    editor = createEditor(store.currentNote?.content)
  } else if (noteIdAfter && noteIdBefore && (noteIdAfter !== noteIdBefore)) {
    editor?.destroy()
    store.currentNote = store.notes.find(n => n.id === noteIdAfter)
    editor = createEditor(store.currentNote?.content)
  } else if (!noteIdAfter) {
    store.currentNote = undefined
    editor?.destroy()
  }
})
const handleAdd = () => {
  const note: Note = {
    id: v4(),
    content: {
      "type": "doc",
      "content": []
    }
  }
  store.add(note)
  router.push(`/${note.id}`)
  // TODO: focus
}
const handleClear = () => {
  store.clear()
}
const handleDelete = (id: string) => {
  store.delete(id)
}
</script>

<template>
  <div class="f-1 flex-column">
    <div class="f-1 flex-row">
      <div class="p-6 w-64 bg-secondary">
        <div class="layout-stack-4">
          <div class="flex-row">
            <div class="f-1"></div>
            <button
              type="button"
              title="Create a new note"
              class="pattern-button-base px-2 py-1"
              @click="handleAdd"
            >+</button>
          </div>
          <div class="flex-row">
            <div class="f-1"></div>
            <button
              @click="handleClear"
              class="pattern-button-base"
            >Clear</button>
          </div>
          <div class="text-small text-secondary flex-row">
            <div class="f-1">Notes</div>
            <div class="text-tertiary">3</div>
          </div>
          <div>
            <ul class="text-medium text-secondary layout-stack-1 list-style-none px-0">
              <li
                v-for="note in store.notes"
                :key="note.id"
              >
                <router-link
                  href="#"
                  class="text-decoration-none"
                  :to="`/${note.id}`"
                >
                  <div class="h-8 py-1 flex-row">
                    <div class="f-1">
                      {{ note.content.content && note.content.content[0]?.content && note.content.content[0].content[0].text || "Empty"}}
                    </div>
                    <button
                      type="button"
                      class="pattern-button-base"
                      @click="handleDelete(note.id)"
                    >x</button>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="p-6 layout-center">
        <AppEditor
          v-if="editor"
          :editor="editor"
          :noteId="route.params.noteId as string"
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
