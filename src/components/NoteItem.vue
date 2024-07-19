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
    :to="`/url`"
  >
    <div class="p-2 layout-stack-1 hover">
      <div class="h-8 flex-row">
        <div class="f-1 overflow-hidden">
          Title
        </div>
        <button
          type="button"
          class="pattern-button-base h-6 w-6"
        >x</button>
      </div>
      <div class="flex-row">
        <div class="f-1 text-small">
          Content
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
