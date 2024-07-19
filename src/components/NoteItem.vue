<!-- WIP -->
<script setup lang="ts">
import { Note } from '../types/note'

const props = defineProps<{
  note: Note
}>()
</script>

<template>
  <router-link
    class="text-decoration-none text-secondary"
    :to="`/${props.note.id}`"
  >
    <div class="p-2 layout-stack-1 hover">
      <div class="h-8 flex-row">
        <div class="f-1 overflow-hidden">
          {{ props.note.content.content && props.note.content.content[0]?.content && props.note.content.content[0].content[0].text || "Empty"}}
        </div>
        <button
          type="button"
          class="pattern-button-base h-6 w-6"
        >x</button>
      </div>
      <div class="flex-row">
        <div class="f-1 text-small">
        </div>
        <div>
          <span class="text-secondary text-small" title="">
            {{ props.note.updatedAt.split('T')[0] }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>
