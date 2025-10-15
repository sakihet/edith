<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Extension } from '@tiptap/core'
import { ref } from 'vue'
import Placeholder from '@tiptap/extension-placeholder'

const session = ref()
const completionText = ref('')
const state = ref<'Init' | 'Generating' | 'Generated' | 'Updated'>('Init')
const placeholderInit = 'Press Tab to generate completion, Tab again to apply, Esc to cancel'
const placeholderText = ref(placeholderInit)

const updateSession = async () => {
  // @ts-ignore
  if (self.LanguageModel) {
    // @ts-ignore
    session.value = await LanguageModel.create({
      temperature: 1,
      topK: 3,
      initialPrompts: [
        {
          role: 'system',
          content: 'You are a helpful and friendly assistant. Generate a continuation of the text, output only the new part.'
        }
      ]
    })
  }
}

const promptModel = async (text: string): Promise<string> => {
  // @ts-ignore
  const stream = await session.value.prompt(text)
  let rawResponse: string = ''
  for await (const chunk of stream) {
    rawResponse += chunk
  }
  // @ts-ignore
  return rawResponse
}

const generateCompletion = async (text: string): Promise<string> => {
  await updateSession()
  const result = await promptModel(text)
  return result
}

const TabCompletion = Extension.create({
  name: 'tabCompletion',

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (state.value === 'Init') {
          state.value = 'Generating'
          placeholderText.value = 'Generating...'
          // re-render
          this.editor.view.dispatch(this.editor.state.tr);

          (async () => {
            try {
              const text = this.editor.getText()
              const generated = await generateCompletion(text)
              if (generated) {
                completionText.value = generated
              }
              state.value = 'Generated'
              placeholderText.value = completionText.value
              // re-render
              this.editor.view.dispatch(this.editor.state.tr)
            } catch (e) {
              console.error(e)
            }
          })()
        } else if (state.value === 'Generated') {
          editor.value?.commands.insertContent(completionText.value)
          state.value = 'Updated'
          placeholderText.value = placeholderInit
          state.value = 'Init'
        }
        return true
      },
      Escape: () => {
        if (state.value === 'Generated') {
          state.value = 'Init'
          placeholderText.value = placeholderInit
          // re-render
          this.editor.view.dispatch(this.editor.state.tr)
        }
        return true
      }
    }
  }
})

const editor = useEditor({
  content: "<p>あるところにネコとネズミがいました。</p>",
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: () => placeholderText.value
    }),
    TabCompletion
  ],
})
</script>

<template>
  <div class="p-6 w-full">
    <div class="layout-stack-4">
      <h1 class="text-medium">Text Completion</h1>
      <div class="flex-row">
        <div class="f-1">
          <EditorContent
            :editor="editor"
          />
        </div>
      </div>
    </div>
  </div>
</template>
