<script setup lang="ts">
import { onMounted } from 'vue'
import { store, commandMenuModifier } from './store'
import { useRoute } from 'vue-router'
import { useSearchDialog } from './composables/useSearchDialog'

const route = useRoute()
const { isOpenSearchDialog, closeSearchDialog, openSearchDialog } = useSearchDialog()

const closeDialog = () => {
  closeSearchDialog()
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
      if (isOpenSearchDialog.value) {
        closeDialog()
      } else {
        openSearchDialog()
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
