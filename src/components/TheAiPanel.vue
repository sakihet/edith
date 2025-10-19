<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { Ref } from 'vue';

const props = defineProps<{
  editor?: Ref<Editor | undefined>
}>()
</script>

<template>
  <div class="w-80 bg-secondary">
    <div class="py-6 pl-4 pr-6 layout-stack-2">
      <div class="text-secondary">
        Built-in AI
      </div>
      <div v-if="!props.editor">
        <!-- <p class="text-tertiary">No editor</p> -->
      </div>
      <div v-else>
        <!-- <p class="text-tertiary">Editor is available</p> -->
        <select class="border-solid border-1 border-color-default bg-primary text-secondary w-full px-1 py-1">
          <option value="translator">Translator</option>
        </select>
      </div>
      <div v-if="props.editor">
        <!-- @vue-ignore -->
        {{ props.editor.getText() }}
      </div>
    </div>
  </div>
</template>
