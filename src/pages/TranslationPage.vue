<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Editor as CoreEditor } from '@tiptap/core'
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'

const translationDirection = ref('ja-en')
const translated = ref('')

const debouncedFn = useDebounceFn((editor: CoreEditor) => {
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

const editor = useEditor({
  content: "<p>こんにちは</p>",
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    debouncedFn(editor)
  }
})
</script>

<template>
  <div class="p-6 w-full">
    <div class="layout-stack-4">
      <h1 class="text-medium">Translation</h1>
      <div>
        <div>Direction:</div>
        <form class="layout-stack-h-2">
          <input type="radio" name="translation-direction" id="ja-en" v-model="translationDirection" :value="'ja-en'" />
          <label for="ja-en">ja -> en</label>
          <input type="radio" name="translation-direction" id="en-ja" v-model="translationDirection" :value="'en-ja'" />
          <label for="en-ja">en -> ja</label>
        </form>
      </div>
      <div class="flex-row">
        <div class="f-1">
          <EditorContent
            :editor="editor"
          />
        </div>
        <div class="f-1">
          <p>{{ translated }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
