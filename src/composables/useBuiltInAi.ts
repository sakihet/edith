import { ref } from "vue"
import { SummaryOptions } from "../types/ai"

declare global {
  interface Window {
    Proofreader: any
    Rewriter: any
    Summarizer: any
    Translator: any
    Writer: any
  }
  const Translator: {
    create(options: {
      sourceLanguage: string
      targetLanguage: string
      monitor?(monitor: any): void
    }): Promise<{
      translate(text: string): Promise<string>
    }>
  }
  const Summarizer: {
    create(options: SummaryOptions & {
      monitor?(monitor: any): void
    }): Promise<{
      summarize(text: string): Promise<string>
    }>
  }
}

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

  const translate = async (text: string, sourceLanguage: string, targetLanguage: string): Promise<string | undefined> => {
    if (isTranslatorAvailable) {
      const translator = await Translator.create({
        sourceLanguage,
        targetLanguage,
        monitor(m) {
          m.addEventListener('downloadprogress', (e: any) => {
            console.log(`Translator downloaded ${e.loaded * 100}%`)
          })
        }
      })
      const result = await translator.translate(text)
      return result
    }
  }
  const summarize = async (text: string, options: SummaryOptions): Promise<string | undefined> => {
    if (isSummarizerAvailable) {
      const summarizer = await Summarizer.create({
        ...options,
        monitor(m) {
          m.addEventListener('downloadprogress', (e: any) => {
            console.log(`Summarizer downloaded ${e.loaded * 100}%`)
          })
        }
      })
      const result = await summarizer.summarize(text)
      return result
    }
  }

  return {
    isOpenBuiltInAiPanel,
    openBuiltInAiPanel,
    closeBuiltInAiPanel,
    toggleBuiltInAiPanel,
    isProofreaderAvailable,
    isRewriterAvailable,
    isSummarizerAvailable,
    isTranslatorAvailable,
    isWriterAvailable,
    translate,
    summarize
  }
}
