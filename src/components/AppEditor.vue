<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'

const editor = useEditor({
  content: '<p>hello, editor</p>',
  extensions: [
    Bold,
    BulletList,
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
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>
