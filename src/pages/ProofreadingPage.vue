<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Editor as CoreEditor } from '@tiptap/core'
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'

const proofreaded = ref({})

const debouncedFn = useDebounceFn((editor: CoreEditor) => {
  proofread(editor.getText())
}, 1000)

const proofread = async (text: string) => {
  if ('Proofreader' in self) {
    // @ts-ignore
    const proofreader = await Proofreader.create({})
    const result = await proofreader.proofread(text)
    console.log('result', result)
    proofreaded.value = result
  }
}

const editor = useEditor({
  content: "<p>This are a radnom text with a few classic common, and typicla typso and grammar issus. the Proofreader API hopefuly finds them all. Knocking at wood and crossed.</p>",
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    debouncedFn(editor)
  }
})
</script>

<template>
  <div class="p-6 w-full">
    <div class="layout-stack-4">
      <h1 class="text-medium">Proofreading</h1>
      <div>
      </div>
      <div class="flex-row">
        <div class="f-1">
          <EditorContent
            :editor="editor"
          />
        </div>
        <div class="f-1 layout-stack-2">
          <p>Corrected:</p>
          <div>
            <p>
              <!-- @vue-ignore -->
              {{ proofreaded.correctedInput }}
            </p>
          </div>
          <hr />
          <p>Corrections:</p>
          <p>
            <!-- @vue-ignore -->
            {{ proofreaded.corrections.map(c => c.correction).join(',') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
