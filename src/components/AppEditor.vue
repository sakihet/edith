<script setup lang="ts">
import { EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'

import { store } from '../store'
import { Note } from '../types/note';

const props = defineProps<{
  editor: Editor,
  note: Note
}>()

const handleInput = () => {
  if (props.editor) {
    store.put({
      id: props.note.id,
      content: props.editor.getJSON(),
      createdAt: props.note.createdAt,
      updatedAt: new Date().toISOString()
    })
  }
}
</script>

<template>
  <div class="layout-stack-4">
    <BubbleMenu
      :editor="props.editor"
      v-if="props.editor"
      class="border-solid border-1 border-color-default bg-primary"
    >
      <button
        @click="editor?.chain().focus().toggleBold().run()"
        class="px-2 border-none bg-primary"
      >
        bold
      </button>
      <button
        @click="editor?.chain().focus().toggleItalic().run()"
        class="px-2 border-none bg-primary"
      >
        italic
      </button>
      <button
        @click="editor?.chain().focus().toggleStrike().run()"
        class="px-2 border-none bg-primary"
      >
        strike
      </button>
    </BubbleMenu>
    <div class="layout-stack-h-1">
      <button
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('bulletList') }"
      >
        toggle bullet list
      </button>
      <button
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('orderedList') }"
      >
        toggle ordered list
      </button>
      <button
        @click="editor?.chain().focus().toggleTaskList().run()"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('taskList') }"
      >
        toggle task list
      </button>
      <button
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('bold') }"
      >
        toggle bold
      </button>
      <button
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('italic') }"
      >
        toggle italic
      </button>
      <button
        @click="editor?.chain().focus().toggleStrike().run()"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('strike') }"
      >
        toggle strike
      </button>
      <button
        @click="editor?.chain().focus().unsetLink().run()"
        :disabled="!editor?.isActive('link')"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('link') }"
      >
        unset link
      </button>
      <button
        @click="editor?.chain().focus().setHorizontalRule().run()"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('horizontalRule') }"
      >
        horizontal rule
      </button>
    </div>
    <EditorContent
      :editor="props.editor"
      @input="handleInput"
    />
  </div>
</template>
