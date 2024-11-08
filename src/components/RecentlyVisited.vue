<script setup lang="ts">
import { Note } from '../types/note';

const props = defineProps<{
  notes: Array<Note>
}>()
</script>

<template>
  <div class="layout-stack-4">
    <div class="bold text-secondary">Recently visited</div>
    <div class="text-secondary" v-if="props.notes.length >= 1">
      <ul class="list-style-none px-0 pattern-horizontal-scroll pattern-scrollbar-thin">
        <li
          v-for="note in props.notes"
          :key="note.id"
          class="inline-block py-1"
        >
          <router-link
            :to="`/${note.id}`"
            class="text-decoration-none text-secondary"
          >
            <div class="w-48 p-3 border-solid border-1 border-primary border-color-default hover">
              <div class="layout-stack-1">
                <div class="text-small">{{ note.content.content && note.content.content[0]?.content && note.content.content[0].content[0].text || "Empty"}}
                </div>
                <div class="text-small text-tertiary text-right">{{ note.updatedAt.split('T')[0] }}</div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
