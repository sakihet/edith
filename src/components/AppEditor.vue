<script setup lang="ts">
import { onMounted, inject, Ref, onUnmounted } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'

import { Note } from '../types/note';
import IconCode from './icons/IconCode.vue';
import IconFormatBold from './icons/IconFormatBold.vue';
import IconFormatItalic from './icons/IconFormatItalic.vue';
import IconFormatStrikethrough from './icons/IconFormatStrikethrough.vue';
import IconFormatUnderlined from './icons/IconFormatUnderlined.vue';
import { Language } from '../types/language';
import { useEditorWrapper } from '../editor/editor';
import { store } from '../store';
import { useBuiltInAi } from '../composables/useBuiltInAi';

const props = defineProps<{
  note: Note
}>()

const editorInstance = inject('editorInstance') as Ref<Editor | undefined>

const { editor, focus } = useEditorWrapper(props.note, store)

const { isTranslatorAvailable, isSummarizerAvailable, isProofreaderAvailable, translate, summarize } = useBuiltInAi()

onMounted(() => {
  focus()
  if (editorInstance) {
    editorInstance.value = editor.value
  }
})

onUnmounted(() => {
  if (editorInstance) {
    editorInstance.value = undefined
  }
})

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
  if (!editor?.value || !store.selectedTextLanguage) {
    return
  }
  const { from ,to } = editor.value.state.selection
  const selectedText = editor.value.state.doc.textBetween(from, to)
  const sourceLanguage = getSourceLanguageByDetectedLanguage(store.selectedTextLanguage)
  const targetLanguage = getTargetLanguageByDetectedLanguage(store.selectedTextLanguage)
  if (sourceLanguage && targetLanguage) {
    const result = await translate(selectedText, sourceLanguage, targetLanguage)
    editor.value.chain().focus().setTextSelection({ from, to })
    .insertContentAt(to, `\nTranslated: \n${result}`).run()
  } else {
    console.error('source or target language is undefined')
  }
}

const handleSummarize = async () => {
  if (!editor?.value) {
    return
  }
  const { from ,to } = editor.value.state.selection
  const selectedText = editor.value.state.doc.textBetween(from, to)
  const result = await summarize(selectedText, {
    context: "Summarize in the original language."
  })
  editor.value.chain().focus().setTextSelection({ from, to })
  .insertContentAt(to, `\nSummarized: \n${result}`).run()
}

const handleProofread = async () => {
  if (!editor?.value) {
    return
  }
  const { from ,to } = editor.value.state.selection
  const selectedText = editor.value.state.doc.textBetween(from, to)
  if (isProofreaderAvailable) {
    console.log('Proofreader is available')
    // @ts-ignore
    const proofreader = await Proofreader.create({
      // @ts-ignore
      monitor(m) {
        // @ts-ignore
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Progress: ${e.loaded} / ${e.total}`)
        })
      }
    })
    const proofreaded = await proofreader.proofread(selectedText, {
      'context': "Proofread in the original language",
    })
    editor.value.chain().focus().setTextSelection({ from, to })
    .insertContentAt(to, `\nProofreaded: \n${proofreaded.correctedInput}`).run()
  }
}
</script>

<template>
  <div class="layout-stack-2 flex-column">
    <BubbleMenu
      :editor="editor"
      v-if="editor"
      class="bg-primary drop-shadow p-1 flex-row layout-stack-h-1"
      style="line-height: 0;"
    >
      <div class="layout-stack-h-1">
        <button
          @click="editor?.chain().focus().toggleBold().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': editor?.isActive('bold')
          }"
          title="Bold"
        >
          <IconFormatBold />
        </button>
        <button
          @click="editor?.chain().focus().toggleItalic().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': editor?.isActive('italic')
          }"
          title="Italic"
        >
          <IconFormatItalic />
        </button>
        <button
          @click="editor?.chain().focus().toggleUnderline().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': editor?.isActive('underline')
          }"
          title="Underline"
        >
          <IconFormatUnderlined />
        </button>
        <button
          @click="editor?.chain().focus().toggleStrike().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': editor?.isActive('strike')
          }"
          title="Strikethrough"
        >
          <IconFormatStrikethrough />
        </button>
        <button
          @click="editor?.chain().focus().toggleCode().run()"
          :class="{
            'bg-primary border-none hover pointer': true,
            'text-selected': editor?.isActive('code')
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
            'text-selected': editor?.isActive('link'),
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
          Translate<span v-if="store.selectedTextLanguage"> to {{ store.selectedTextLanguage === Language.English ? 'ja' : 'en'}}</span>
        </button>
        <button
          v-if="isSummarizerAvailable"
          @click="handleSummarize"
          class="h-6 bg-primary border-none hover pointer px-2 py-1"
        >
          Summarize
        </button>
        <button
          v-if="isProofreaderAvailable"
          @click="handleProofread"
          class="h-6 bg-primary border-none hover pointer px-2 py-1"
        >
          Proofread
        </button>
      </div>
    </BubbleMenu>
    <div class="overflow-y-auto pattern-height-editor-content pattern-scrollbar-thick">
      <div class="layout-center px-6">
        <EditorContent
          v-if="editor"
          :editor="editor"
        />
      </div>
    </div>
  </div>
</template>
