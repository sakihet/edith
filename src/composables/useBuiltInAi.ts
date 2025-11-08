import { ref } from "vue"

import { LanguageModelOptions, ProofreaderOptions, ProofreaderResult, RewriterOptions, SummaryOptions, WriterOptions } from "../types/ai"

declare global {
  interface Window {
    LanguageModel: any
    Proofreader: any
    Rewriter: any
    Summarizer: any
    Translator: any
    Writer: any
  }
  const LanguageModel: {
    create(options: LanguageModelOptions & {
      monitor?(monitor: any): void
    }): Promise<any>
  }
  const Proofreader: {
    create(options: ProofreaderOptions & {
      monitor?(monitor: any): void
    }): Promise<{
      proofread(text: string): Promise<ProofreaderResult>
    }>
  }
  const Rewriter: {
    create(options: RewriterOptions & {
      monitor?(monitor: any): void
    }): Promise<{
      rewrite(text: string, { context }: { context: string }): Promise<string>
    }>
  }
  const Summarizer: {
    create(options: SummaryOptions & {
      monitor?(monitor: any): void
    }): Promise<{
      summarize(text: string): Promise<string>
    }>
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
  const Writer: {
    create(options: WriterOptions & {
      monitor?(monitor: any): void
    }): Promise<{
      write(text: string, { context }: { context: string }): Promise<string>
    }>
  }
}

const STORAGE_KEY = 'isOpenBuiltInAiPanel'

const getValue = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as boolean : false
  } catch {
    return false
  }
}
const setValue = (value: boolean) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

const isOpenBuiltInAiPanel = ref<boolean>(getValue())

const session = ref()

export const useBuiltInAi = () => {
  const closeBuiltInAiPanel = () => {
    isOpenBuiltInAiPanel.value = false
    setValue(false)
  }
  const openBuiltInAiPanel = () => {
    isOpenBuiltInAiPanel.value = true
    setValue(true)
  }
  const toggleBuiltInAiPanel = () => {
    isOpenBuiltInAiPanel.value = !isOpenBuiltInAiPanel.value
    setValue(isOpenBuiltInAiPanel.value)
  }
  const isLanguageModelAvailable = 'LanguageModel' in self
  const isProofreaderAvailable = 'Proofreader' in self
  const isRewriterAvailable = 'Rewriter' in self
  const isSummarizerAvailable = 'Summarizer' in self
  const isTranslatorAvailable = 'Translator' in self
  const isWriterAvailable = 'Writer' in self

  // LanguageModel
  const updateSession = async () => {
    if (isLanguageModelAvailable) {
      session.value = await LanguageModel.create({
        temperature: 1,
        topK: 3,
        initialPrompts: [
          {
            role: 'system',
            content: 'You are a helpful and friendly assistant.'
          }
        ],
        expectedOutputs: [{
          type: 'text', langueages: ['en', 'ja']
        }],
        monitor(m) {
          m.addEventListener('downloadprogress', (e: any) => {
            console.log(`LanguageModel downloaded ${e.loaded * 100}%`)
          })
        }
      })
    }
  }
  const promptModel = async (promptInput: string): Promise<string> => {
    const stream = await session.value.promptStreaming(promptInput)
    let rawResponse = ''
    for await (const chunk of stream) {
      rawResponse += chunk
    }
    return rawResponse
  }
  const promptNoteContext = async (context: string): Promise<void> => {
    await session.value.prompt(`Provide your answer in plain text only. Do not use any markdown formatting.\nPlease answer the following question based on the notes below:\n${context}`)
  }

  const proofread = async (text: string, options: ProofreaderOptions = {}): Promise<ProofreaderResult | undefined> => {
    if (isProofreaderAvailable) {
      const proofreader = await Proofreader.create({
        ...options,
        monitor(m) {
          m.addEventListener('downloadprogress', (e: any) => {
            console.log(`Proofreader downloaded ${e.loaded * 100}%`)
          })
        }
      })
      const result = await proofreader.proofread(text)
      console.log('proofreader result:', result)
      return result
    }
  }
  const rewrite = async (text: string, options: RewriterOptions, context: { context: string }): Promise<string | undefined> => {
    if (isRewriterAvailable) {
      const rewriter = await Rewriter.create({
        ...options,
        monitor(m) {
          m.addEventListener('downloadprogress', (e: any) => {
            console.log(`Rewriter downloaded ${e.loaded * 100}%`)
          })
        }
      })
      const result = await rewriter.rewrite(text, context)
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
  const write = async (text: string, options: WriterOptions, context: { context: string }): Promise<string | undefined> => {
    if (isWriterAvailable) {
      const writer = await Writer.create({
        ...options,
        monitor(m) {
          m.addEventListener('downloadprogress', (e: any) => {
            console.log(`Writer downloaded ${e.loaded * 100}%`)
          })
        }
      })
      const result = await writer.write(text, context)
      return result
    }
  }

  return {
    isOpenBuiltInAiPanel,
    openBuiltInAiPanel,
    closeBuiltInAiPanel,
    toggleBuiltInAiPanel,
    isLanguageModelAvailable,
    isProofreaderAvailable,
    isRewriterAvailable,
    isSummarizerAvailable,
    isTranslatorAvailable,
    isWriterAvailable,
    proofread,
    promptModel,
    promptNoteContext,
    rewrite,
    summarize,
    translate,
    updateSession,
    write,
  }
}
