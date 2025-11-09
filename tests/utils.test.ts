import { describe, expect, it } from "vitest";
import { detectLanguage, formatRelativeTime } from "../src/utils";
import { Language } from "../src/types/language";
import { notes, notesJa } from "../src/data";

describe('utils', () => {
  it('', () => {
    const result = detectLanguage("Hello")
    expect(result).toBe(Language.English)
  })
  it('', () => {
    const result = detectLanguage("こんにちは")
    expect(result).toBe(Language.Japanese)
  })
  it ('', ()=> {
    const result = detectLanguage("你好")
    expect(result).toBe(Language.Chinese)
  })
  it('', () => {
    const result = detectLanguage("ฅ")
    expect(result).toBe(Language.Unknown)
  })
  it('', () => {
    const result = detectLanguage(notes[0].content)
    expect(result).toBe(Language.English)
  })
  it('', () => {
    const result = detectLanguage(notesJa[0].content)
    expect(result).toBe(Language.Japanese)
  })
})

describe('formatRelativeTime', () => {
  it('should return "now" for a date that is less than a second ago', () => {
    const date = new Date()
    const result = formatRelativeTime(date.toISOString())
    expect(result).toBe('now')
  })

  it('should return "1 minute ago" for a date that is 1 minute ago', () => {
    const date = new Date(Date.now() - 60 * 1000)
    const result = formatRelativeTime(date.toISOString())
    expect(result).toBe('1 minute ago')
  })

  it('should return "2 hours ago" for a date that is 2 hours ago', () => {
    const date = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const result = formatRelativeTime(date.toISOString())
    expect(result).toBe('2 hours ago')
  })

  it('should return "3 days ago" for a date that is 3 days ago', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    const result = formatRelativeTime(date.toISOString())
    expect(result).toBe('3 days ago')
  })
})
