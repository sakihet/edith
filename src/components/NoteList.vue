<!-- WIP -->
<script setup lang="ts">
import NoteItem from '../components/NoteItem.vue'
import { Note } from '../types/note'

const props = defineProps<{
  notes: Array<Note>
}>()
</script>

<template>
  <ul class="list-style-none px-0">
    <li v-for="note in props.notes" :key="note.id">
      <NoteItem :note="note" />
    </li>
  </ul>
</template>
