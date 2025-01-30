<script setup lang="ts">
import { onMounted } from 'vue'
import { store, commandMenuModifier } from './store'

onMounted(async () => {
  await store.init()
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      store.isOpenDialog = false
    }
    if (e.key === commandMenuModifier) {
      store.pressingCommandMenuModifier = true
    }
    if (e.key === 'k' && store.pressingCommandMenuModifier) {
      if (store.isOpenDialog) {
        store.isOpenDialog = false
      } else {
        store.isOpenDialog = true
      }
    }
  }
  document.onkeyup = (e: KeyboardEvent) => {
    if (e.key === commandMenuModifier) {
      store.pressingCommandMenuModifier = false
    }
  }
})
</script>

<template>
  <RouterView v-if="store.isLoaded" />
</template>
