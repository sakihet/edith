<script setup lang="ts">
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import Bold from '@tiptap/extension-bold'
import { BubbleMenu as BubbleMenuExt } from '@tiptap/extension-bubble-menu'
import BulletList from '@tiptap/extension-bullet-list'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Strike from '@tiptap/extension-strike'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'

import Commands from '../commands'
import suggestion from '../suggestion'

const editor = useEditor({
  content: '<p>hello, editor</p>',
  extensions: [
    Bold,
    BubbleMenuExt,
    BulletList,
    Commands.configure({
      suggestion
    }),
    HorizontalRule,
    Italic,
    Link,
    OrderedList,
    Placeholder.configure({
      placeholder: "Write something..."
    }),
    StarterKit,
    Strike,
    TaskItem.configure({
      nested: true
    }),
    TaskList,
  ],
})
</script>

<template>
  <div class="layout-stack-4">
    <BubbleMenu
      :editor="editor"
      v-if="editor"
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
    <EditorContent :editor="editor" class="" />
  </div>
</template>
