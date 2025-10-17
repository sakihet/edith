<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Editor as CoreEditor } from '@tiptap/core'
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'

type SummaryType = 'key-points' | 'tldr' | 'teaser' | 'headline'
type SummaryLength = 'short' | 'medium' | 'long'
type SummaryFormat = 'markdown' | 'plain-text'

const summaryType = ref<SummaryType>('key-points')
const summaryLength = ref<SummaryLength>('medium')
const summaryFormat = ref<SummaryFormat>('markdown')
const summarized = ref('')
const isGenerating = ref(false)

const debouncedFn = useDebounceFn((editor: CoreEditor) => {
  summarize(editor.getText())
}, 1000)

const summarize = async (text: string) => {
  isGenerating.value = true
  if ('Summarizer' in self) {
    const options = {
      sharedContext: 'Always produce summaries in the same language as the input text.',
      type: summaryType.value,
      length: summaryLength.value,
      format: summaryFormat.value,
    }
    // @ts-ignore
    const summarizer = await Summarizer.create(options)
    const result = await summarizer.summarize(text)
    summarized.value = result
    isGenerating.value = false
  }
}

const handleChange = () => {
  summarize(editor.value?.getText() || '')
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
      <h1 class="text-medium">Summarization</h1>
      <div class="flex-row">
        <div class="f-1">
          <EditorContent
            :editor="editor"
          />
        </div>
        <div class="f-1 layout-stack-2">
          <div>
            <label>
              Type
              <select v-model="summaryType" @change="handleChange">
                <option value="key-points">Key Points</option>
                <option value="tldr">TL;DR</option>
                <option value="teaser">Teaser</option>
                <option value="headline">Headline</option>
              </select>
            </label>
            <label>
              Length
              <select v-model="summaryLength" @change="handleChange">
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </label>
            <label>
              Format
              <select v-model="summaryFormat" @change="handleChange">
                <option value="markdown">Markdown</option>
                <option value="plain-text">Plain text</option>
              </select>
            </label>
          </div>
          <p v-if="!isGenerating">{{ summarized }}</p>
          <p v-else class="text-secondary">Generating...</p>
        </div>
      </div>
    </div>
  </div>
</template>
