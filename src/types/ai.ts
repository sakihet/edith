export type AiMode = 'translator' | 'summarizer' | 'proofreader' | 'writer' | 'rewriter' | 'prompt'
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
export type RewriterTone = 'more-formal' | 'as-is' | 'more-casual'
export type RewriterLength = 'shorter' | 'as-is' | 'longer'
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
