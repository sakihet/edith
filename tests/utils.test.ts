import { describe, expect, it } from "vitest";
import { detectLanguage } from "../src/utils";
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
