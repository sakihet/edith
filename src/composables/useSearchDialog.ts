import { onUnmounted, ref, watch } from "vue"
import { store, commandMenuModifier } from '../store'

const isOpenSearchDialog = ref<boolean>(false)

export const useSearchDialog = () => {
  const attachEventListeners = () => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  }
  const closeSearchDialog = () => {
    isOpenSearchDialog.value = false
  }
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSearchDialog()
    }
    if (e.key === commandMenuModifier) {
      store.pressingCommandMenuModifier = true
    }
    if (e.key === 'k' && store.pressingCommandMenuModifier) {
      if (isOpenSearchDialog.value) {
        closeSearchDialog()
      } else {
        openSearchDialog()
      }
    }
  }
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === commandMenuModifier) {
      store.pressingCommandMenuModifier = false
    }
  }
  const openSearchDialog = () => {
    isOpenSearchDialog.value = true
  }

  watch(() => store.isLoaded, (isLoaded) => {
    if (isLoaded) {
      attachEventListeners()
    }
  }, { immediate: true })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
  })

  return { isOpenSearchDialog, openSearchDialog, closeSearchDialog }
}
