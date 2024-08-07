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
      class="bg-primary drop-shadow p-1"
      style="line-height: 0;"
    >
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
    </BubbleMenu>
    <div class="">
      <div class="layout-center">
        <div class="layout-stack-h-1">
          <button
            @click="editor?.chain().focus().unsetLink().run()"
            :disabled="!editor?.isActive('link')"
            :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('link') }"
          >
            unset link
          </button>
          <button
            @click="editor?.chain().focus().clearNodes().run()"
            class="pattern-button-base"
          >
            clear format
          </button>
        </div>
      </div>
    </div>
    <div class="overflow-y-scroll pattern-height-editor-content pattern-scrollbar-thick">
      <div class="layout-center">
        <EditorContent
          :editor="props.editor"
        />
      </div>
    </div>
  </div>
</template>
