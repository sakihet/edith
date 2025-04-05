<script setup lang="ts">
import { onUnmounted, onMounted, useTemplateRef } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { store } from '../store'
import { generateTextCustom } from '../editor/editor'

const search = useTemplateRef('search')

onMounted(() => {
  search.value?.focus()
})

onUnmounted(() => {
  store.searchQuery = ""
})

const debouncedFn = useDebounceFn(() => {
  store.search()
}, 500)

const onInput = (_e: Event) => {
  debouncedFn()
}

const onChangeRange = (_e: Event) => {
  store.search()
}

const onChangeSuggestions = (_e: Event) => {
  store.search()
}

const onSubmit = (e: Event) => {
  e.preventDefault()
  store.search()
}
</script>

<template>
  <div>
    <div class="pattern-mask" @click="store.isOpenDialog = false" />
    <dialog
      :open="store.isOpenDialog"
      class="layout-center w-256 border-solid border-1 border-color-default drop-shadow my-16"
    >
      <div class="p-8 layout-stack-4">
        <div>
          <form @submit="onSubmit" class="layout-stack-1">
            <div>
              <input
                type="text"
                class="h-8 border-solid border-1 border-color-default w-full px-2"
                placeholder="Search..."
                v-model="store.searchQuery"
                ref="search"
                @input="onInput"
              />
            </div>
            <div class="text-right text-secondary layout-stack-h-1">
              <label>
                <span class="text-small h-6">
                  Fuzzy:
                </span>
                <div class="inline-block">
                  <input
                    class="w-16 align-middle pattern-range"
                    type="range"
                    min="0"
                    max="0.3"
                    step="0.1"
                    value="0"
                    v-model="store.searchFuzziness"
                    @change="onChangeRange"
                  />
                </div>
              </label>
              <label>
                <span class="text-small h-6">
                  Enable suggestions
                </span>
                <div class="inline-block">
                  <input
                    class="align-middle"
                    type="checkbox"
                    v-model="store.enableSuggestions"
                    @change="onChangeSuggestions"
                  />
                </div>
              </label>
            </div>
          </form>
        </div>
        <div v-if="store.searchResults.length === 0">
          <div class="px-4 py-2 text-secondary">
            Not Found
          </div>
        </div>
        <div v-else class="max-h-160 overflow-y-scroll pattern-scrollbar-thin layout-stack-1">
          <div v-if="store.searchSuggestions.length >= 1" class="">
            <div class="py-1">
              <span class="text-small text-secondary">Suggestions ({{ store.searchSuggestions.length }})</span>
              <ul class="px-2 list-style-none layout-stack-1 text-secondary p-0 layout-stack-h-2">
                <li class="inline-block" v-for="suggestion in store.searchSuggestions" :key="suggestion.suggestion">
                  {{ suggestion.suggestion }}
                </li>
              </ul>
            </div>
            <hr class="border-color-default border-solid border-t-1" />
          </div>
          <span class="text-small text-secondary">Notes ({{ store.searchResults.length }})</span>
          <ul class="list-style-none layout-stack-1 p-0">
            <li v-for="note in store.searchResults" :key="note.id" class="">
              <router-link class="text-decoration-none text-secondary" :to="`/${note.id}`">
                <div class="layout-stack-1 px-4 py-2 hover">
                  <div class="h-6 overflow-hidden text-secondary">
                    {{ note.content.content && note.content.content[0]?.content && note.content.content[0].content[0].text || "Empty" }}
                  </div>
                  <div class="overflow-hidden text-tertiary text-small max-h-12">
                    {{ generateTextCustom(note.content) }}
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div>
          <div class="font-mono text-small text-secondary">
            <code>esc</code> to close
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>
