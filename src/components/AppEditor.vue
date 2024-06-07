<script>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default {
  components: {
    EditorContent,
  },

  setup() {
    const editor = useEditor({
      content: '<p>hello, editor</p>',
      extensions: [
        StarterKit,
      ],
    })

    return {editor}
  },
}

</script>

<template>
  <EditorContent :editor="editor" />
</template>
