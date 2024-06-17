<script setup lang="ts">
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import Bold from '@tiptap/extension-bold'
import { BubbleMenu as BubbleMenuExt } from '@tiptap/extension-bubble-menu'
import BulletList from '@tiptap/extension-bullet-list'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>hello, editor</p>',
  extensions: [
    Bold,
    BubbleMenuExt,
    BulletList,
    Link,
    StarterKit,
  ],
})
</script>

<template>
  <div class="layout-stack-4">
    <div>
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
      </BubbleMenu>
    </div>
    <div class="layout-stack-h-1">
      <button
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('bulletList') }"
      >
        toggle bullet list
      </button>
      <button
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'pattern-button-base': true, 'pattern-button-selected': editor?.isActive('bold') }"
      >
        toggle bold
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
    <EditorContent :editor="editor" class=""/>
  </div>
</template>
