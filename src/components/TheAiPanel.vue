<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'
import { nextTick, onMounted, onUnmounted, ref, Ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

import { AiMode } from '../types/aiMode';
import { useRoute } from 'vue-router';

const props = defineProps<{
  editor?: Ref<Editor | undefined>
}>()

const aiMode = ref<AiMode>('translator')
const translated = ref('')
const translationDirection = ref('ja-en')
const route = useRoute()

const debouncedFn = useDebounceFn((editor: Editor) => {
  translate(editor.getText())
}, 1000)

const translate = async (text: string) => {
  const [ source, target ] = translationDirection.value.split('-')
  if ('Translator' in self) {
    // @ts-ignore
    const translator = await Translator.create({
      sourceLanguage: source,
      targetLanguage: target,
    })
    const result = await translator.translate(text)
    translated.value = result
  }
}

const updateHandler = ({ editor }: { editor: Editor }) => {
  debouncedFn(editor)
}

onMounted(async () => {
  // @ts-ignore
  props.editor?.on('update', updateHandler)
  // @ts-ignore
  await translate(props.editor?.getText() || '')
})

watch (() => route.params.noteId, async (noteIdAfter, noteIdBefore) => {
  if (noteIdBefore === undefined && noteIdAfter) {
    await nextTick()
    // @ts-ignore
    props.editor?.on('update', updateHandler)
  } else if (noteIdAfter && noteIdBefore && (noteIdAfter !== noteIdBefore)) {
    translated.value = ''
    await nextTick()
    // @ts-ignore
    props.editor?.on('update', updateHandler)
    // @ts-ignore
    await translate(props.editor.getText() || '')
  } else if (!noteIdAfter) {
    translated.value = ''
  }
})

onUnmounted(() => {
  // @ts-ignore
  props.editor?.off('update', updateHandler)
})
</script>

<template>
  <div class="w-80 bg-secondary">
    <div class="py-6 pl-4 pr-6 layout-stack-2">
      <div class="text-secondary">
        Built-in AI
      </div>
      <div v-if="!props.editor">
      </div>
      <div v-else>
        <select
          class="border-solid border-1 border-color-default bg-primary text-secondary w-full px-1 py-1"
          v-model="aiMode"
        >
          <option value="translator">Translator</option>
        </select>
      </div>
      <div>
        <form class="layout-stack-h-2">
          <input
            type="radio"
            name="translation-direction"
            id="ja-en"
            v-model="translationDirection"
            :value="'ja-en'"
          />
          <label for="ja-en" class="font-mono">ja → en</label>
          <input
            type="radio"
            name="translation-direction"
            id="en-ja"
            v-model="translationDirection"
            :value="'en-ja'"
          />
          <label for="en-ja" class="font-mono">en → ja</label>
        </form>
      </div>
      <div v-if="props.editor">
        {{ translated }}
      </div>
    </div>
  </div>
</template>
