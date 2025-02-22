import { describe, expect, it } from 'vitest'
import MiniSearch from 'minisearch'

import { notesJa } from '../src/data'

const segmenterJa = new Intl.Segmenter('ja', { granularity: 'word' })

const miniSearch = new MiniSearch({
  fields: ['content'],
  storeFields: ['content'],
  tokenize: (content) => Array.from(segmenterJa.segment(content), ({ segment }) => segment).filter(s => s.trim())
})

miniSearch.addAll(notesJa)

describe('search', () => {
  it('', () => {
    const results = miniSearch.search('ラーメン')
    expect(results.length).toBe(3)
  })
  it('', () => {
    const results = miniSearch.search('ラーーメン')
    expect(results.length).toBe(0)
  })
  it('', () => {
    const results = miniSearch.search('ラーーメン', { fuzzy: 0.1 })
    expect(results.length).toBe(3)
  })
  it('', () => {
    const results = miniSearch.search('都市')
    expect(results.length).toBe(21)
  })
  it('', () => {
    const results = miniSearch.search('自然')
    expect(results.length).toBe(15)
  })
  it('', () => {
    const results = miniSearch.search('テレビ')
    expect(results.length).toBe(0)
  })
  it('', () => {
    const results = miniSearch.search('テレビ', { prefix: true })
    expect(results.length).toBe(1)
  })
  it('', () => {
    const results = miniSearch.search('たこ焼き')
    expect(results.length).toBe(1)
  })
  it('', () => {
    const results = miniSearch.search('雪')
    expect(results.length).toBe(2)
  })
  it('', () => {
    const results = miniSearch.search('山', { fuzzy: 0.4 })
    expect(results.length).toBe(0)
  })
  it('', () => {
    const results = miniSearch.search('山', { fuzzy: 0.5 })
    expect(results.length).toBe(30)
  })
  it('', () => {
    const results = miniSearch.search('海')
    expect(results.length).toBe(2)
  })
  it('', () => {
    const results = miniSearch.search('海', { fuzzy: 0.4 })
    expect(results.length).toBe(2)
  })
  it('', () => {
    const json = miniSearch.toJSON()
    expect(json.documentCount).toBe(30)
    expect(json.index.length).toBeGreaterThan(400)
    expect(json.serializationVersion).toBe(2)
  })
})
