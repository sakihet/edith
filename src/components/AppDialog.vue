<script setup lang="ts">
import { onUnmounted, onMounted, useTemplateRef } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { store } from '../store'
import { generateTextCustom } from '../editor'

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
      class="layout-center w-128 border-solid border-1 border-color-default drop-shadow my-16"
    >
      <div class="p-8 layout-stack-4">
        <div>
          <form @submit="onSubmit">
            <input
              type="text"
              class="h-8 border-solid border-1 border-color-default w-full px-2"
              placeholder="Search..."
              v-model="store.searchQuery"
              ref="search"
              @input="onInput"
            />
          </form>
        </div>
        <div v-if="store.searchResults.length === 0">
          <div class="px-4 py-2 text-secondary">
            Not Found
          </div>
        </div>
        <div v-else>
          <ul class="list-style-none layout-stack-2 p-0">
            <li v-for="note in store.searchResults" :key="note.id" class="">
              <router-link class="text-decoration-none text-secondary" :to="`/${note.id}`">
                <div class="layout-stack-1 px-4 py-2 hover">
                  <div class="overflow-hidden text-secondary">
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
      </div>
    </dialog>
  </div>
</template>
