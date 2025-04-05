<script setup lang="ts">
import { onMounted } from 'vue'
import { store, commandMenuModifier } from './store'
import { useRoute } from 'vue-router'

const route = useRoute()

const closeDialog = () => {
  store.isOpenDialog = false
  if (route.params.noteId) {
    // TODO: focus editor
  }
}

onMounted(async () => {
  await store.init()
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeDialog()
    }
    if (e.key === commandMenuModifier) {
      store.pressingCommandMenuModifier = true
    }
    if (e.key === 'k' && store.pressingCommandMenuModifier) {
      if (store.isOpenDialog) {
        closeDialog()
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
