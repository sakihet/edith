import { ref } from "vue"

const isOpenSearchDialog = ref<boolean>(false)

export const useSearchDialog = () => {
  const openSearchDialog = () => {
    isOpenSearchDialog.value = true
  }

  const closeSearchDialog = () => {
    isOpenSearchDialog.value = false
  }

  return { isOpenSearchDialog, openSearchDialog, closeSearchDialog }
}
