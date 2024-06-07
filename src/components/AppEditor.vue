<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>hello, editor</p>',
  extensions: [
    Bold,
    BulletList,
    Link,
    StarterKit,
  ],
})
</script>

<template>
  <div class="layout-stack-4">
    <div>
      <button
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        toggle bullet list
      </button>
      <button
        @click="editor?.chain().focus().toggleBold().run()"
      >
        toggle bold
      </button>
      <button
        @click="editor?.chain().focus().unsetLink().run()"
        :disabled="!editor?.isActive('link')"
      >
        unset link
      </button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>
