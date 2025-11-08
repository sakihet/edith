import { ref } from 'vue'

const STORAGE_KEY = 'aiPanelWidth'
const WIDTH_DEFAULT = 320

const getValue = (): number => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as number : WIDTH_DEFAULT
  } catch {
    return WIDTH_DEFAULT
  }
}
const setValue = (value: number) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}
const aiPanelWidth = ref<number>(getValue())

export const useAiPanelResizable = () => {
  const isAiPanelResizing = ref(false)
  const aiPanelWidthMin = 160
  const aiPanelWidthMax = 480
  const startX = ref(0)
  const startWidth = ref(0)

  const handleAiPanelResizableDblclick = (_e: MouseEvent) => {
    aiPanelWidth.value = WIDTH_DEFAULT
    setValue(WIDTH_DEFAULT)
  }
  const handleAiPanelResizableMousedown = (_e: MouseEvent) => {
    isAiPanelResizing.value = true
    startX.value = _e.clientX
    startWidth.value = aiPanelWidth.value
  }
  const handleAiPanelResizableMousemove = (event: MouseEvent) => {
    if (isAiPanelResizing.value) {
      const deltaX = event.clientX - startX.value
      const newWidth = startWidth.value - deltaX
      if (newWidth >= aiPanelWidthMin && newWidth <= aiPanelWidthMax) {
        aiPanelWidth.value = newWidth
      }
    }
  }
  const handleAiPanelResizableMouseup = (_e: MouseEvent) => {
    isAiPanelResizing.value = false
    setValue(aiPanelWidth.value)
  }

  return {
    aiPanelWidth,
    handleAiPanelResizableDblclick,
    handleAiPanelResizableMousedown,
    handleAiPanelResizableMousemove,
    handleAiPanelResizableMouseup
  }
}
