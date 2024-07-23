<!-- WIP -->
<script setup lang="ts">
import IconMoreHoriz from '../components/IconMoreHoriz.vue'
import { Note } from '../types/note'

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  (e: 'deleteNote'): void
}>()

const handleClickDetails = (e: Event) => {
  e.stopPropagation()
}

const handleDelete = (e: Event) => {
  e.stopPropagation()
  e.preventDefault()
  emit('deleteNote')
}
</script>

<template>
  <router-link
    class="text-decoration-none text-secondary"
    :to="`/${props.note.id}`"
  >
    <div class="p-2 layout-stack-1 hover pattern-hiding-child">
      <div class="h-8 flex-row">
        <div class="f-1 overflow-hidden">
          {{ props.note.content.content && props.note.content.content[0]?.content && props.note.content.content[0].content[0].text || "Empty"}}
        </div>
        <details
          class="pattern-dropdown pattern-hidden-child"
          @click="handleClickDetails"
        >
          <summary class="w-6 h-6">
            <IconMoreHoriz />
          </summary>
          <div class="bg-primary drop-shadow">
            <ul class="list-style-none px-0 border-solid border-1 border-color-default py-2">
              <li>
                <button
                  @click="handleDelete"
                  class="pattern-button-dropdown"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </details>
      </div>
      <div class="flex-row">
        <div class="f-1 text-small">
        </div>
        <div>
          <span
            class="text-secondary text-small"
            :title="props.note.updatedAt.split('T')[0]"
          >
            {{ props.note.updatedAt.split('T')[0] }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>
