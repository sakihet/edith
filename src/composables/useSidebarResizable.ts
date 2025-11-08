import { ref } from 'vue'

const STORAGE_KEY = 'sidebarWidth'
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
const sidebarWidth = ref<number>(getValue())

export const useSidebarResizable = () => {
  const isSidebarResizing = ref(false)
  const sidebarWidthMin = 160
  const sidebarWidthMax = 480

  const handleDblclick = (_e: MouseEvent) => {
    sidebarWidth.value = WIDTH_DEFAULT
    setValue(WIDTH_DEFAULT)
  }
  const handleMousedown = (_e: MouseEvent) => {
    isSidebarResizing.value = true
  }
  const handleMousemove = (event: MouseEvent) => {
    if (isSidebarResizing.value) {
      const clientX = event.clientX
      if (sidebarWidthMin <= clientX && clientX <= sidebarWidthMax) {
        sidebarWidth.value = event.clientX
      }
    }
  }
  const handleMouseup = (_e: MouseEvent) => {
    isSidebarResizing.value = false
    setValue(sidebarWidth.value)
  }

  return {
    sidebarWidth,
    handleDblclick,
    handleMousedown,
    handleMousemove,
    handleMouseup
  }
}
