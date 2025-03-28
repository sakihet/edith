<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Editor } from '@tiptap/vue-3'

import AppEditor from '../components/AppEditor.vue'
import { store } from '../store'
import IconLightMode from '../components/IconLightMode.vue'
import IconDarkMode from '../components/IconDarkMode.vue'
import IconMoreHoriz from '../components/IconMoreHoriz.vue'
import { applyTheme, setTheme } from '../utils'
import RecentlyVisited from '../components/RecentlyVisited.vue'
import { createEditor } from '../editor'

const route = useRoute()

let editor: Editor | null

onMounted(() => {
  if (route.params.noteId) {
    store.currentNote = store.notes.find(n => n.id === route.params.noteId)
    if (store.currentNote) {
      editor = createEditor(store.currentNote, store)
      editor.chain().focus().run()
    }
  }
})

const closeDialog = () => {
  store.isOpenDialog = false
}

watch (() => route.params.noteId, (noteIdAfter, noteIdBefore) => {
  closeDialog()
  if (noteIdBefore === undefined && noteIdAfter) {
    store.currentNote = store.notes.find(n => n.id === noteIdAfter)
    if (store.currentNote?.id) {
      store.updateRecentlyVisited(store.currentNote?.id)
    }
    if (store.currentNote) {
      editor = createEditor(store.currentNote, store)
      editor.chain().focus().run()
    }
  } else if (noteIdAfter && noteIdBefore && (noteIdAfter !== noteIdBefore)) {
    editor?.destroy()
    store.currentNote = store.notes.find(n => n.id === noteIdAfter)
    if (store.currentNote?.id) {
      store.updateRecentlyVisited(store.currentNote?.id)
    }
    if (store.currentNote) {
      editor = createEditor(store.currentNote, store)
      editor.chain().focus().run()
    }
  } else if (!noteIdAfter) {
    store.currentNote = undefined
    editor?.destroy()
  }
})

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
      <div class="f-1 layout-stack-2 flex-column overflow-y-hidden">
        <div class="flex-row px-6 pt-6 layout-stack-h-2">
          <div class="f-1">
          </div>
          <div>
            <span class="text-tertiary text-small">
              characters: {{ editor?.storage.characterCount.characters() || 0 }},
            </span>
            <span class="text-tertiary text-small">
              words: {{ editor?.storage.characterCount.words() || 0 }},
            </span>
            <span class="text-tertiary text-small">
              tasks: {{ editor?.storage.taskCount.tasks().filter((t: any) => t.attrs.checked === true).length }} / {{ editor?.storage.taskCount.tasks().length }}
            </span>
          </div>
          <div class="flex-row layout-stack-h-2">
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
          >
            <div class="layout-center-wide px-6">
              <RecentlyVisited
                :notes="store.recentlyVisited.map(id => store.notes.find(n => n.id === id)).filter(n => !!n)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
