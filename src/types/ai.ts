export type AiMode = 'translator' | 'summarizer' | 'proofreader' | 'writer' | 'rewriter' | 'prompt'
export type SummaryType = 'key-points' | 'tldr' | 'teaser' | 'headline'
export type SummaryLength = 'short' | 'medium' | 'long'
export type SummaryFormat = 'markdown' | 'plain-text'
export type WriterTone = 'formal' | 'neutral' | 'casual'
export type WriterLength = 'short' | 'medium' | 'long'
export type RewriterTone = 'more-formal' | 'as-is' | 'more-casual'
export type RewriterLength = 'shorter' | 'as-is' | 'longer'
export type Prompt = {
  role: string
  content: string
}
