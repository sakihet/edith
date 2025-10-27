import { ref } from "vue"

const isOpenBuiltInAiPanel = ref<boolean>(false)

export const useBuiltInAi = () => {
  const closeBuiltInAiPanel = () => {
    isOpenBuiltInAiPanel.value = false
  }
  const openBuiltInAiPanel = () => {
    isOpenBuiltInAiPanel.value = true
  }
  const toggleBuiltInAiPanel = () => {
    isOpenBuiltInAiPanel.value = !isOpenBuiltInAiPanel.value
  }
  const isProofreaderAvailable = 'Proofreader' in self
  const isRewriterAvailable = 'Rewriter' in self
  const isSummarizerAvailable = 'Summarizer' in self
  const isTranslatorAvailable = 'Translator' in self
  const isWriterAvailable = 'Writer' in self

  return {
    isOpenBuiltInAiPanel,
    openBuiltInAiPanel,
    closeBuiltInAiPanel,
    toggleBuiltInAiPanel,
    isProofreaderAvailable,
    isRewriterAvailable,
    isSummarizerAvailable,
    isTranslatorAvailable,
    isWriterAvailable
  }
}
