<script setup lang="ts">
import { EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'

import { Note } from '../types/note';
import IconCode from './IconCode.vue';
import IconFormatBold from './IconFormatBold.vue';
import IconFormatItalic from './IconFormatItalic.vue';
import IconFormatStrikethrough from './IconFormatStrikethrough.vue';
import IconFormatUnderlined from './IconFormatUnderlined.vue';
import { detectLanguage } from '../utils';
import { Language } from '../types/language';

const props = defineProps<{
  editor: Editor,
  note: Note
}>()

const isTranslatorAvailable = 'Translator' in self
const isSummarizerAvailable = 'Summarizer' in self

const getSourceLanguageByDetectedLanguage = (detectLanguage: Language) => {
  switch (detectLanguage) {
    case Language.Japanese:
      return 'ja'
    case Language.English:
      return 'en'
  }
}

const getTargetLanguageByDetectedLanguage = (detectLanguage: Language) => {
  switch (detectLanguage) {
    case Language.Japanese:
      return 'en'
    case Language.English:
      return 'ja'
  }
}

const handleTranslate = async () => {
  const { from ,to } = props.editor.state.selection
  const selectedText = props.editor.state.doc.textBetween(from, to)
  const language = detectLanguage(selectedText)
  if (isTranslatorAvailable) {
    console.log('Translator is available')
    // @ts-ignore
    const availability = await Translator.availability({
      sourceLanguage: getSourceLanguageByDetectedLanguage(language),
      targetLanguage: getTargetLanguageByDetectedLanguage(language),
    })
    console.log(availability)
    // @ts-ignore
    const translator = await Translator.create({
      sourceLanguage: getSourceLanguageByDetectedLanguage(language),
      targetLanguage: getTargetLanguageByDetectedLanguage(language),
      // @ts-ignore
      monitor(m) {
        // @ts-ignore
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Progress: ${e.loaded} / ${e.total}`)
        })
      }
    })
    const translated = await translator.translate(selectedText)
    props.editor?.chain().focus().setTextSelection({ from, to })
    .insertContentAt(to, `\nTranslated: ${translated}`).run()
  }
}

const handleSummarize = async () => {
  const { from ,to } = props.editor.state.selection
  const selectedText = props.editor.state.doc.textBetween(from, to)
  if (isSummarizerAvailable) {
    console.log('Summarizer is available')
    // @ts-ignore
    const summarizer = await Summarizer.create({
      // @ts-ignore
      monitor(m) {
        // @ts-ignore
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Progress: ${e.loaded} / ${e.total}`)
        })
      }
    })
    const summarized = await summarizer.summarize(selectedText, {
      'context': "Summarize in the original language",
    })
    props.editor?.chain().focus().setTextSelection({ from, to })
    .insertContentAt(to, `\nSummarized: ${summarized}`).run()
  }
}
</script>

<template>
  <div class="layout-stack-2 flex-column">
    <BubbleMenu
      :editor="props.editor"
      v-if="props.editor"
      class="bg-primary drop-shadow p-1 flex-row layout-stack-h-1"
      style="line-height: 0;"
    >
      <div class="layout-stack-h-1">
        <button
          @click="editor?.chain().focus().toggleBold().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': props.editor?.isActive('bold')
          }"
          title="Bold"
        >
          <IconFormatBold />
        </button>
        <button
          @click="editor?.chain().focus().toggleItalic().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': props.editor?.isActive('italic')
          }"
          title="Italic"
        >
          <IconFormatItalic />
        </button>
        <button
          @click="editor?.chain().focus().toggleUnderline().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': props.editor?.isActive('underline')
          }"
          title="Underline"
        >
          <IconFormatUnderlined />
        </button>
        <button
          @click="editor?.chain().focus().toggleStrike().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': props.editor?.isActive('strike')
          }"
          title="Strikethrough"
        >
          <IconFormatStrikethrough />
        </button>
        <button
          @click="editor?.chain().focus().toggleCode().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': props.editor?.isActive('code')
          }"
          title="Code"
        >
          <IconCode />
        </button>
      </div>
      <div>
        <button
          @click="editor?.chain().focus().unsetLink().run()"
          :class="{
            'h-6 bg-primary border-none hover pointer px-2 py-1': true,
            'text-selected': props.editor?.isActive('code'),
          }"
          :disabled="!editor?.isActive('link')"
        >
          Unset Link
        </button>
        <button
          @click="editor?.chain().focus().clearNodes().run()"
          :class="{
            'h-6 bg-primary border-none hover pointer px-2 py-1': true,
          }"
        >
          Clear Format
        </button>
        <button
          v-if="isTranslatorAvailable"
          @click="handleTranslate"
          class="h-6 bg-primary border-none hover pointer px-2 py-1"
        >
          Translate
        </button>
        <button
          v-if="isSummarizerAvailable"
          @click="handleSummarize"
          class="h-6 bg-primary border-none hover pointer px-2 py-1"
        >
          Summarize
        </button>
      </div>
    </BubbleMenu>
    <div class="overflow-y-auto pattern-height-editor-content pattern-scrollbar-thick">
      <div class="layout-center px-6">
        <EditorContent
          :editor="props.editor"
        />
      </div>
    </div>
  </div>
</template>
