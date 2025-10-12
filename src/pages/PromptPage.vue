<script setup lang="ts">
import { ref } from 'vue'

type Prompt = {
  role: string
  content: string
}

const inputText = ref('')
const session = ref()
const rawResponse = ref('')
const prompts = ref<Prompt[]>([])

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
          content: 'You are a helpful and friendly assistant.'
        }
      ]
    })
  }
}

const promptModel = async () => {
  // @ts-ignore
  const stream = await session.value.promptStreaming(inputText.value)
  for await (const chunk of stream) {
    // console.log(chunk)
    rawResponse.value += chunk
  }
  // @ts-ignore
  prompts.value.push({
    role: 'assistant',
    content: rawResponse.value
  })
  rawResponse.value = ''
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  // @ts-ignore
  prompts.value.push({
    role: 'user',
    content: inputText.value
  })
  await updateSession()
  await promptModel()
}
</script>

<template>
  <div class="p-6 w-full">
    <div class="layout-stack-4 flex-column">
      <h1 class="text-medium">Prompt</h1>
      <div>
        <form @submit="handleSubmit">
          <div class="flex-row layout-stack-h-2">
            <textarea v-model="inputText" rows="3" class="p-1 w-full border-solid border-1 border-color-default"></textarea>
            <div>
              <button
                type="submit"
                class="pattern-button-base text-small"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="overflow-y-scroll" style="max-height: calc(100vh - 9rem);">
        <div v-for="c in prompts" class="text-small">
          <div>{{ c.role }}</div>
          <pre>{{ c.content }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
