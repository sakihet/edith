<script setup lang="ts">
import { EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'

import { Note } from '../types/note';
import IconCode from './IconCode.vue';
import IconFormatBold from './IconFormatBold.vue';
import IconFormatItalic from './IconFormatItalic.vue';
import IconFormatStrikethrough from './IconFormatStrikethrough.vue';
import IconFormatUnderlined from './IconFormatUnderlined.vue';

const props = defineProps<{
  editor: Editor,
  note: Note
}>()
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
            'bg-primary border-none hover pointer px-2 py-1': true,
            'text-selected': props.editor?.isActive('code'),
          }"
          :disabled="!editor?.isActive('link')"
        >
          Unset Link
        </button>
        <button
          @click="editor?.chain().focus().clearNodes().run()"
          :class="{
            'bg-primary border-none hover pointer px-2 py-1': true,
          }"
        >
          Clear Format
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
