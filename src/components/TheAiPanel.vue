<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'
import { nextTick, onMounted, onUnmounted, ref, Ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useRoute } from 'vue-router';

import { AiMode, Prompt, ProofreaderResult, RewriterLength, RewriterTone, SummaryFormat, SummaryLength, SummaryOptions, SummaryType, WriterLength, WriterTone } from '../types/ai';
import { useBuiltInAi } from '../composables/useBuiltInAi';
import { detectLanguage } from '../utils';
import { Language } from '../types/language';

const props = defineProps<{
  editor?: Ref<Editor | undefined>
  width?: number
}>()

const aiMode = ref<AiMode>('ask')

// ask
const isComposing = ref(false)
const askInput = ref('')
const askPrompts = ref<Prompt[]>([])
const handleAskSubmit = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  askPrompts.value.push({
    role: 'user',
    content: askInput.value
  })
  const result = await promptModel(askInput.value)
  askPrompts.value.push({
    role: 'assistant',
    content: result
  })
  askInput.value = ''
}
const handleAskKeyDown = async (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !isComposing.value) {
    e.preventDefault()
    if (askInput.value.trim() !== '') {
      await handleAskSubmit(e)
    }
  }
}
const handleAskCompositionStart = () => {
  isComposing.value = true
}
const handleAskCompositionEnd = () => {
  isComposing.value = false
}

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
const proofreaded = ref<ProofreaderResult | undefined>(undefined)
const isGeneratingByProofreader = ref(false)

// writer
const writerPrompt = ref('')
const writerContext = ref('')
const writerTone = ref<WriterTone>('neutral')
const writerLength = ref<WriterLength>('medium')
const writerResult = ref('')
const isGeneratingByWriter = ref(false)

// rewriter
const rewriterTone = ref<RewriterTone>('as-is')
const rewriterLength = ref<RewriterLength>('as-is')
const rewriterResult = ref('')
const isGeneratingByRewriter = ref(false)

// prompt
const promptInput = ref('')
const prompts = ref<Prompt[]>([])

const route = useRoute()
const { proofread, promptModel, promptNoteContext, rewrite, summarize, translate, updateSession, write } = useBuiltInAi()

const debouncedFn = useDebounceFn((editor: Editor) => {
  if (aiMode.value === 'translator') {
    handleTranslate(editor.getText())
  } else if (aiMode.value === 'summarizer') {
    handleSummarize(editor.getText())
  } else if (aiMode.value === 'proofreader') {
    proofread(editor.getText())
  }
}, 1000)

const handleTranslate = async (text: string) => {
  const [ source, target ] = translationDirection.value.split('-')
  const result = await translate(text, source, target)
  if (result) {
    translated.value = result
  }
}

const handleChangeLanguageDirection = () => {
  // @ts-ignore
  handleTranslate(props.editor.getText() || '')
}

const handleSummarize = async (text: string) => {
  isGeneratingSummary.value = true
  const language = detectLanguage(text)
  const options: SummaryOptions = {
    sharedContext: 'Always produce summaries in the same language as the input text.',
    type: summaryType.value,
    length: summaryLength.value,
    format: summaryFormat.value,
    outputLanguage: language === Language.English ? 'en' : 'ja',
  }
  const result = await summarize(text, options)
  if (result) {
    summarized.value = result
  }
  isGeneratingSummary.value = false
}

const handleProofread = async (text: string) => {
  isGeneratingByProofreader.value = true
  const result = await proofread(text, { expectedInputLanguages: ['en'], outputLanguage: 'en' })
  console.log('proofreader result in handler:', result)
  if (result?.correctedInput) {
    proofreaded.value = result
  }
  isGeneratingByProofreader.value = false
}

const handleWrite = async () => {
  isGeneratingByWriter.value = true
  const result = await write(writerPrompt.value, {
    format: 'plain-text',
    tone: writerTone.value,
    length: writerLength.value,
    outputLanguage: 'ja'
  }, { context: writerContext.value })
  if (result) {
    writerResult.value = result
  }
  isGeneratingByWriter.value = false
}

const handleRewrite = async () => {
  isGeneratingByRewriter.value = true
  const rewriterOptions = {
    tone: rewriterTone.value,
    length: rewriterLength.value,
    format: 'plain-text',
    outputLanguage: 'ja'
  }
  // @ts-ignore
  const result = await rewrite(props.editor?.getText() || '', rewriterOptions, { context: '' })
  if (result) {
    rewriterResult.value = result
  }
  isGeneratingByRewriter.value = false
  return result
}

const updateHandler = ({ editor }: { editor: Editor }) => {
  debouncedFn(editor)
}

const handleChangeSummaryParams = () => {
  // @ts-ignore
  handleSummarize(props.editor.getText() || '')
}

const handleChangeAiMode = async () => {
  if (aiMode.value === 'ask') {
    await updateSession()
    // @ts-ignore
    await promptNoteContext(props.editor?.getText() || '')
    // @ts-ignore
    const content = props.editor?.getText() || ''
  } else if (aiMode.value === 'translator') {
    // @ts-ignore
    handleTranslate(props.editor?.getText() || '')
  } else if (aiMode.value === 'summarizer') {
    // @ts-ignore
    handleSummarize(props.editor?.getText() || '')
  } else if (aiMode.value === 'proofreader') {
    // @ts-ignore
    handleProofread(props.editor?.getText() || '')
  }
}

const handleClickGenerate = async (_e: Event) => {
  await handleWrite()
}

const handleClickInsert = async () => {
  // @ts-ignore
  const endPos = props.editor?.state.doc.content.size || 0
  // @ts-ignore
  props.editor?.chain().focus().insertContentAt(endPos, writerResult.value + '\n').run()
}

const handleClickRewriter = async () => {
  const result = await handleRewrite()
  rewriterResult.value = result as string
}

const handleClickReplace = async () => {
  // @ts-ignore
  props.editor?.chain().focus().setContent(rewriterResult.value).run() 
}

const handleSubmitPrompt = async (e: Event) => {
  e.preventDefault()
  prompts.value.push({
    role: 'user',
    content: promptInput.value
  })
  await updateSession()
  const result = await promptModel(promptInput.value)
  prompts.value.push({
    role: 'assistant',
    content: result || ''
  })
}

onMounted(async () => {
  // @ts-ignore
  props.editor?.on('update', updateHandler)
  // @ts-ignore
  if (aiMode.value === 'translator') {
    // @ts-ignore
    await handleTranslate(props.editor?.getText() || '')
  } else if (aiMode.value === 'ask') {
    await updateSession()
    // @ts-ignore
    await promptNoteContext(props.editor?.getText() || '')
  }
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
    if (aiMode.value === 'translator') {
      // @ts-ignore
      await handleTranslate(props.editor.getText() || '')
    }
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
  <div class="bg-secondary" :style="{ width: props.width + 'px' }">
    <div class="py-6 pl-4 pr-6 layout-stack-2">
      <div class="text-secondary">
        Built-in AI
      </div>
      <div>
        <select
          class="border-solid border-1 border-color-default bg-primary text-secondary w-full px-1 py-1"
          v-model="aiMode"
          @change="handleChangeAiMode"
        >
          <option value="ask">Ask</option>
          <option value="translator">Translator</option>
          <option value="summarizer">Summarizer</option>
          <option value="proofreader">Proofreader</option>
          <option value="writer">Writer</option>
          <option value="rewriter">Rewriter</option>
          <option value="prompt">Prompt</option>
        </select>
      </div>
      <!-- ask -->
      <div v-if="aiMode === 'ask'" class="layout-stack-2">
        <div>
          <form
            class="layout-stack-1"
            @submit="handleAskSubmit"
            :disable="askInput.length === 0"
          >
            <textarea
              type="text"
              v-model="askInput"
              class="border-solid border-1 border-color-default bg-primary text-secondary p-1 w-full text-small pattern-scrollbar-thick resize-vertical field-sizing-content"
              @keydown="handleAskKeyDown"
              @compositionstart="handleAskCompositionStart"
              @compositionend="handleAskCompositionEnd"
            />
          </form>
        </div>
        <div
          class="overflow-y-scroll pattern-scrollbar-thin layout-stack-2 pr-2"
          :style="{ height: 'calc(100vh - 12rem)' }"
        >
          <div
            v-for="p in askPrompts"
            class="text-small text-secondary"
          >
            <div>
              <p :class="{ 'text-right': p.role === 'user' }">{{ p.content }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- translator -->
      <div>
        <form class="layout-stack-h-2" v-if="aiMode === 'translator'">
          <input
            type="radio"
            name="translation-direction"
            id="ja-en"
            v-model="translationDirection"
            :value="'ja-en'"
            @change="handleChangeLanguageDirection"
          />
          <label for="ja-en" class="font-mono">ja → en</label>
          <input
            type="radio"
            name="translation-direction"
            id="en-ja"
            v-model="translationDirection"
            :value="'en-ja'"
            @change="handleChangeLanguageDirection"
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
      <!-- proofreader -->
      <div v-if="props.editor && aiMode === 'proofreader'" class="layout-stack-2">
        <div v-if="isGeneratingByProofreader" class="text-secondary">Generating proofreaded text...</div>
        <div v-else>
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
      <!-- writer -->
      <div v-if="props.editor && aiMode === 'writer'" class="layout-stack-2">
        <form
          class="layout-stack-2"
        >
          <label
            for="writer-prompt"
            class="block text-secondary text-small"
          >
            Prompt:
          </label>
          <textarea
            id="writer-prompt"
            class="w-full h-14 p-2 border-solid border-1 border-color-default bg-primary text-secondary"
            v-model="writerPrompt"
          ></textarea>
          <label
            for="writer-context"
            class="block text-secondary text-small"
          >
            Context:
          </label>
          <input
            type="text"
            id="writer-context"
            class="w-full h-6 px-2 border-solid border-1 border-color-default bg-primary text-secondary"
            v-model="writerContext"
          />
          <div class="flex-row">
            <select v-model="writerTone" class="f-1 border-solid border-1 border-color-default bg-primary text-secondary text-moderate">
              <option value="formal">Formal</option>
              <option value="neutral">Neutral</option>
              <option value="casual">Casual</option>
            </select>
            <select v-model="writerLength" class="f-1 border-solid border-1 border-color-default bg-primary text-secondary text-moderate">
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
          <div class="flex-row">
            <button
              class="f-1 pattern-button-base w-full h-6 text-small"
              type="button"
              @click="handleClickGenerate"
            >
              Generate
            </button>
            <button
              class="f-1 pattern-button-base w-full h-6 text-small"
              type="button"
              @click="handleClickInsert"
            >
              Insert
            </button>
          </div>
        </form>
        <div class="text-secondary text-moderate">
          <p v-if="isGeneratingByWriter" class="text-secondary">Generating...</p>
          <p v-else class="text-moderate">
            {{ writerResult }}
          </p>
        </div>
      </div>
      <!-- rewriter -->
      <div v-if="props.editor && aiMode === 'rewriter'" class="layout-stack-2">
        <div>
          <form class="flex-column layout-stack-2">
            <div class="flex-row">
              <select v-model="rewriterTone" class="f-1 border-solid border-1 border-color-default bg-primary text-secondary text-moderate">
                <option value="more-formal">More formal</option>
                <option value="as-is">As is</option>
                <option value="more-casual">More casual</option>
              </select>
              <select v-model="rewriterLength" class="f-1 border-solid border-1 border-color-default bg-primary text-secondary text-moderate">
                <option value="shorter">Shorter</option>
                <option value="as-is">As is</option>
                <option value="longer">Longer</option>
              </select>
            </div>
            <div class="flex-row">
              <button
                type="button"
                @click="handleClickRewriter"
                class="f-1 pattern-button-base w-full h-6 text-small"
              >
                Rewrite
              </button>
              <button
                type="button"
                @click="handleClickReplace"
                class="f-1 pattern-button-base w-full h-6 text-small"
              >
                Replace
              </button>
            </div>
          </form>
        </div>
        <div>
          <p v-if="isGeneratingByRewriter" class="text-secondary">Generating...</p>
          <p v-else class="text-moderate">
            {{ rewriterResult }}
          </p>
        </div>
      </div>
      <!-- prompt -->
      <div v-if="props.editor && aiMode === 'prompt'" class="layout-stack-2">
        <div>
          <form @submit="handleSubmitPrompt" class="flex-column layout-stack-2">
            <textarea v-model="promptInput" class="p-1 border-solid border-1 border-color-default bg-primary text-secondary" rows="3" />
            <button type="submit" class="w-full border-solid border-1 border-color-default text-secondary text-moderate">Submit</button>
          </form>
        </div>
        <div
          class="overflow-y-scroll pattern-scrollbar-thin"
          style="max-height: calc(100vh - 12rem);"
        >
          <div v-for="p in prompts" class="text-small text-secondary layout-stack-1">
            <div class="">{{ p.role }}</div>
            <pre class="p-1">{{ p.content }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
