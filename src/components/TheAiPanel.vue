<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'
import { nextTick, onMounted, onUnmounted, ref, Ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

import { AiMode } from '../types/aiMode';
import { useRoute } from 'vue-router';

type SummaryType = 'key-points' | 'tldr' | 'teaser' | 'headline'
type SummaryLength = 'short' | 'medium' | 'long'
type SummaryFormat = 'markdown' | 'plain-text'

const props = defineProps<{
  editor?: Ref<Editor | undefined>
}>()

const aiMode = ref<AiMode>('translator')

// translation
const translated = ref('')
const translationDirection = ref('ja-en')

// summarization
const summarized = ref('')
const summaryType = ref<SummaryType>('key-points')
const summaryLength = ref<SummaryLength>('medium')
const summaryFormat = ref<SummaryFormat>('markdown')
const isGeneratingSummary = ref(false)

// proofreading
const proofreaded = ref({})

const route = useRoute()

const debouncedFn = useDebounceFn((editor: Editor) => {
  if (aiMode.value === 'translator') {
    translate(editor.getText())
  } else if (aiMode.value === 'summarizer') {
    summarize(editor.getText())
  } else if (aiMode.value === 'proofreader') {
    proofread(editor.getText())
  }
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

const summarize = async (text: string) => {
  isGeneratingSummary.value = true
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
    isGeneratingSummary.value = false
  }
}

const proofread = async (text: string) => {
  if ('Proofreader' in self) {
    // @ts-ignore
    const proofreader = await Proofreader.create({})
    const result = await proofreader.proofread(text)
    console.log('result', result)
    proofreaded.value = result
  }
}

const updateHandler = ({ editor }: { editor: Editor }) => {
  debouncedFn(editor)
}

const handleChangeSummaryParams = () => {
  // @ts-ignore
  summarize(props.editor.getText() || '')
}

const handleChangeAiMode = () => {
  if (aiMode.value === 'translator') {
    // console.log('translator selected')
    // @ts-ignore
    translate(props.editor?.getText() || '')
  } else if (aiMode.value === 'summarizer') {
    // console.log('summarizer selected')
    // @ts-ignore
    summarize(props.editor?.getText() || '')
  } else if (aiMode.value === 'proofreader') {
    // console.log('proofreader selected')
    // @ts-ignore
    proofread(props.editor?.getText() || '')
  }
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
          @change="handleChangeAiMode"
        >
          <option value="translator">Translator</option>
          <option value="summarizer">Summarizer</option>
          <option value="proofreader">Proofreader</option>
        </select>
      </div>
      <div>
        <form class="layout-stack-h-2" v-if="aiMode === 'translator'">
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
      <div v-if="props.editor && aiMode === 'translator'">
        {{ translated }}
      </div>
      <div v-if="props.editor && aiMode === 'summarizer'">
        <div class="layout-stack-1">
          <label class="block text-secondary text-small">
            Type
            <select
              v-model="summaryType"
              @change="handleChangeSummaryParams"
              class="border-solid border-1 border-color-default bg-primary text-secondary text-small"
            >
              <option value="key-points">Key Points</option>
              <option value="tldr">TL;DR</option>
              <option value="teaser">Teaser</option>
              <option value="headline">Headline</option>
            </select>
          </label>
          <label class="block text-secondary text-small">
            Length
            <select
              v-model="summaryLength"
              @change="handleChangeSummaryParams"
              class="border-solid border-1 border-color-default bg-primary text-secondary text-small"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </label>
          <label class="block text-secondary text-small">
            Format
            <select
              v-model="summaryFormat"
              @change="handleChangeSummaryParams"
              class="border-solid border-1 border-color-default bg-primary text-secondary text-small"
            >
              <option value="markdown">Markdown</option>
              <option value="plain-text">Plain text</option>
            </select>
          </label>
        </div>
      </div>
      <div v-if="props.editor && aiMode === 'summarizer'">
        <div v-if="isGeneratingSummary" class="text-secondary">Generating summary...</div>
        <div v-else>
          {{ summarized }}
        </div>
      </div>
      <div v-if="props.editor && aiMode === 'proofreader'" class="layout-stack-2">
        <div>
          <!-- @vue-ignore -->
          {{ proofreaded.correctedInput }}
        </div>
        <!-- @vue-ignore -->
        <div class="text-secondary" v-if="proofreaded?.corrections?.length > 0">
          <p>Corrections:</p>
          <p>
            <!-- @vue-ignore -->
            {{ proofreaded.corrections.map(c => c.correction).join(', ') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
