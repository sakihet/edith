<script setup lang="ts">
import { v4 } from 'uuid'
import { onMounted, onUpdated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Editor } from '@tiptap/vue-3'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import { BubbleMenu as BubbleMenuExt } from '@tiptap/extension-bubble-menu'
import BulletList from '@tiptap/extension-bullet-list'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Heading from '@tiptap/extension-heading'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Strike from '@tiptap/extension-strike'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Underline from '@tiptap/extension-underline'

import AppEditor from '../components/AppEditor.vue'
import { Note } from '../types/note'
import { store } from '../store'
import Commands from '../commands'
import suggestion from '../suggestion'
import IconEditSquare from '../components/IconEditSquare.vue'
import NoteItem from '../components/NoteItem.vue'
import IconMoreHoriz from '../components/IconMoreHoriz.vue'
import { version } from '../../package.json'
import IconLightMode from '../components/IconLightMode.vue'
import IconDarkMode from '../components/IconDarkMode.vue'
import { applyTheme, setTheme } from '../utils'

const route = useRoute()
const router = useRouter()

let editor: Editor | null

const createEditor = (note: Note) => {
  return new Editor({
    content: note.content,
      extensions: [
        Blockquote,
        Bold,
        BubbleMenuExt,
        BulletList,
        Code,
        CodeBlock,
        Commands.configure({
          suggestion
        }),
        Heading.configure({
          levels: [1, 2, 3],
        }),
        HorizontalRule,
        Italic,
        Link,
        OrderedList,
        Placeholder.configure({
          placeholder: "Write something, or press '/' for commands..."
        }),
        StarterKit,
        Strike,
        TaskItem.configure({
          nested: true
        }),
        TaskList,
        Underline,
      ],
    onUpdate({ editor }) {
      store.put({
        id: note.id,
        content: editor.getJSON(),
        createdAt: note.createdAt,
        updatedAt: new Date().toISOString()
      })
    }
  })
}
onMounted(() => {
  if (route.params.noteId) {
    store.currentNote = store.notes.find(n => n.id === route.params.noteId)
    if (store.currentNote) {
      editor = createEditor(store.currentNote)
      editor.chain().focus().run()
    }
  }
})
onUpdated(() => {
})
watch (() => route.params.noteId, (noteIdAfter, noteIdBefore) => {
  if (noteIdBefore === undefined && noteIdAfter) {
    store.currentNote = store.notes.find(n => n.id === noteIdAfter)
    if (store.currentNote) {
      editor = createEditor(store.currentNote)
      editor.chain().focus().run()
    }
  } else if (noteIdAfter && noteIdBefore && (noteIdAfter !== noteIdBefore)) {
    editor?.destroy()
    store.currentNote = store.notes.find(n => n.id === noteIdAfter)
    if (store.currentNote) {
      editor = createEditor(store.currentNote)
      editor.chain().focus().run()
    }
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

const handleToggleMode = () => {
  if (store.theme === 'light') {
    store.theme = 'dark'
  } else {
    store.theme = 'light'
  }
  applyTheme(store.theme)
  setTheme(store.theme)
}
</script>

<template>
  <div class="f-1 flex-column overflow-hidden">
    <div class="f-1 flex-row overflow-hidden">
      <div class="p-6 w-80 bg-secondary flex-column">
        <div class="layout-stack-6 f-1">
          <div class="flex-row layout-stack-h-1">
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
          <div class="text-secondary flex-row layout-stack-h-1">
            <div class="f-1 px-2 text-tertiary bold">Notes</div>
            <div class="text-tertiary w-6 h-6 text-center">{{ store.notes.length }}</div>
            <details
              class="pattern-dropdown pattern-hidden-child"
            >
              <summary class="w-6 h-6 hover">
                <IconMoreHoriz />
              </summary>
              <div class="bg-primary drop-shadow">
                <ul class="list-style-none px-0 border-solid border-1 border-color-default py-2">
                  <li>
                    <button
                      @click="handleClear"
                      class="pattern-button-dropdown"
                    >
                      Clear
                    </button>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div class="pattern-height-note-list overflow-y-scroll pattern-scrollbar-thin">
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
        </div>
        <div class="text-tertiary text-small font-mono">v {{ version }}</div>
      </div>
      <div class="f-1 layout-stack-2 flex-column overflow-y-hidden">
        <div class="flex-row px-6 pt-6 layout-stack-h-1">
          <div class="f-1"></div>
          <div>
            <button
              class="pattern-button-icon"
              type="button"
              @click="handleToggleMode()"
            >
              <IconLightMode v-if="store.theme === 'light'"/>
              <IconDarkMode v-else />
            </button>
          </div>
          <details
            class="pattern-dropdown pattern-hidden-child"
          >
            <summary class="w-6 h-6 hover">
              <IconMoreHoriz />
            </summary>
            <div class="bg-primary drop-shadow">
              <ul class="list-style-none px-0 border-solid border-1 border-color-default py-2">
                <li>
                  <a
                    href="https://github.com/sakihet/edith"
                    target="_blank"
                    class="text-decoration-none"
                  >
                    <div class="h-8 px-4 py-1 hover">
                      GitHub
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </details>
        </div>
        <div class="f-1 flex-column">
          <AppEditor
            v-if="store.currentNote && editor"
            :editor="editor"
            :note="store.currentNote"
          />
          <div
            v-else
            class="text-secondary"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
