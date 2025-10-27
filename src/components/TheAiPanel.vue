<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'
import { nextTick, onMounted, onUnmounted, ref, Ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useRoute } from 'vue-router';

import { AiMode, Prompt, RewriterLength, RewriterTone, SummaryFormat, SummaryLength, SummaryType, WriterLength, WriterTone } from '../types/ai';
import { useBuiltInAi } from '../composables/useBuiltInAi';

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
const session = ref()
const rawResponse = ref('')
const prompts = ref<Prompt[]>([])

const route = useRoute()
const { isTranslatorAvailable, isSummarizerAvailable, isProofreaderAvailable, isWriterAvailable, isRewriterAvailable } = useBuiltInAi()

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
  if (isTranslatorAvailable) {
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
  if (isSummarizerAvailable) {
    const options = {
      sharedContext: 'Always produce summaries in the same language as the input text.',
      type: summaryType.value,
      length: summaryLength.value,
      format: summaryFormat.value,
      outputLanguage: 'ja',
    }
    // @ts-ignore
    const summarizer = await Summarizer.create(options)
    const result = await summarizer.summarize(text)
    summarized.value = result
    isGeneratingSummary.value = false
  }
}

const proofread = async (text: string) => {
  if (isProofreaderAvailable) {
    // @ts-ignore
    const proofreader = await Proofreader.create({})
    const result = await proofreader.proofread(text)
    console.log('result', result)
    proofreaded.value = result
  }
}

const write = async () => {
  if (isWriterAvailable) {
    isGeneratingByWriter.value = true
    const writerOptions = {
      tone: writerTone.value,
      format: 'plain-text',
      length: writerLength.value
    }
    // @ts-ignore
    const writer = await Writer.create(writerOptions)
    const result = await writer.write(writerPrompt.value, { context: writerContext.value })
    isGeneratingByWriter.value = false
    return result
  }
}

const rewrite = async () => {
  if (isRewriterAvailable) {
    isGeneratingByRewriter.value = true
    const rewriterOptions = {
      tone: rewriterTone.value,
      length: rewriterLength.value,
      format: 'plain-text',
      outputLanguage: 'ja'
    }
    // @ts-ignore
    const rewriter = await Rewriter.create(rewriterOptions)
    // @ts-ignore
    const result = await rewriter.rewrite(props.editor?.getText() || '')
    isGeneratingByRewriter.value = false
    return result
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

const handleClickGenerate = async (_e: Event) => {
  const result = await write()
  writerResult.value = result as string
}

const handleClickInsert = async () => {
  // @ts-ignore
  const endPos = props.editor?.state.doc.content.size || 0
  // @ts-ignore
  props.editor?.chain().focus().insertContentAt(endPos, writerResult.value + '\n').run()
}

const handleClickRewriter = async () => {
  const result = await rewrite()
  console.log('rewriter result:', result)
  rewriterResult.value = result as string
}

const handleClickReplace = async () => {
  // @ts-ignore
  props.editor?.chain().focus().setContent(rewriterResult.value).run() 
}

const updateSession = async () => {
  // @ts-ignore
  if (self.LanguageModel) {
    // @ts-ignore
    session.value = await LanguageModel.create({
      temperature: 1,
      topK: 3,
      initialPrompts: [
        {
          role: 'system',
          content: 'You are a helpful and friendly assistant.'
        }
      ]
    })
  }
}

const promptModel = async () => {
  // @ts-ignore
  const stream = await session.value.promptStreaming(promptInput.value)
  for await (const chunk of stream) {
    // console.log(chunk)
    rawResponse.value += chunk
  }
  // @ts-ignore
  prompts.value.push({
    role: 'assistant',
    content: rawResponse.value
  })
  rawResponse.value = ''
}

const handleSubmitPrompt = async (e: Event) => {
  e.preventDefault()
  console.log('submit prompt:', promptInput.value)
  // @ts-ignore
  prompts.value.push({
    role: 'user',
    content: promptInput.value
  })
  await updateSession()
  await promptModel()
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
      <div>
        <select
          class="border-solid border-1 border-color-default bg-primary text-secondary w-full px-1 py-1"
          v-model="aiMode"
          @change="handleChangeAiMode"
        >
          <option value="translator">Translator</option>
          <option value="summarizer">Summarizer</option>
          <option value="proofreader">Proofreader</option>
          <option value="writer">Writer</option>
          <option value="rewriter">Rewriter</option>
          <option value="prompt">Prompt</option>
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
      <!-- proofreader -->
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
