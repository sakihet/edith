export type AiMode = 'ask' | 'translator' | 'summarizer' | 'proofreader' | 'writer' | 'rewriter' | 'prompt'
export type LanguageModelOptions = {
  topK?: number
  maxTopK?: number
  temperature?: number
  maxTemperature?: number
  initialPrompts: Prompt[]
  expectedOutputs?: Array<{ type: string, langueages: string[] }>
}
export type Prompt = {
  role: string
  content: string
}
export type ProofreaderOptions = {
  expectedInputLanguages?: string[]
  outputLanguage?: string
}
export type ProofreaderResult = {
  correctedInput: string
  corrections: string[]
}
export type RewriterFormat = 'markdown' | 'plain-text'
export type RewriterLength = 'shorter' | 'as-is' | 'longer'
export type RewriterOptions = {
  expectedInputLanguage?: string[]
  expectedContextLanguages?: string[]
  format?: RewriterFormat
  length?: RewriterLength
  outputLanguage?: string
  sharedContext?: string
  tone?: RewriterTone
}
export type RewriterTone = 'more-formal' | 'as-is' | 'more-casual'
export type SummaryType = 'key-points' | 'tldr' | 'teaser' | 'headline'
export type SummaryLength = 'short' | 'medium' | 'long'
export type SummaryFormat = 'markdown' | 'plain-text'
export type SummaryOptions = {
  context?: string
  sharedContext?: string
  type?: SummaryType
  length?: SummaryLength
  format?: SummaryFormat
  outputLanguage?: string
}
export type WriterOptions = {
  format?: WriterFormat
  length?: WriterLength
  sharedContext?: string
  tone?: WriterTone
  outputLanguage?: string
}
export type WriterFormat = 'markdown' | 'plain-text'
export type WriterLength = 'short' | 'medium' | 'long'
export type WriterTone = 'formal' | 'neutral' | 'casual'
