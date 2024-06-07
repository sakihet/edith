<script>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import BulletList from '@tiptap/extension-bullet-list'

export default {
  components: {
    EditorContent,
  },

  setup() {
    const editor = useEditor({
      content: '<p>hello, editor</p>',
      extensions: [
        BulletList,
        StarterKit,
      ],
    })

    return {editor}
  },
}

</script>

<template>
  <div class="layout-stack-4">
    <div>
      <button @click="editor.chain().focus().toggleBulletList().run()">toggle bullet list</button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>
