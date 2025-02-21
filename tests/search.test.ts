import { v4 } from 'uuid'
import { describe, expect, it } from 'vitest'
import MiniSearch from 'minisearch'

import { notes } from '../src/data'

const miniSearch = new MiniSearch({
  fields: ['content'],
  storeFields: ['content']
})

miniSearch.addAll(notes)

describe('search', () => {
  it('', () => {
    const results = miniSearch.search('ramen')
    expect(results.length).toBe(4)
  })
  it('', () => {
    const results = miniSearch.search('raamen', { fuzzy: 0.2 })
    expect(results.length).toBe(4)
  })
  it('', () => {
    const results = miniSearch.search('raaamen', { fuzzy: 0.2 })
    expect(results.length).toBe(0)
  })
  it('', () => {
    const results = miniSearch.search('raaaamen', { fuzzy: 0.4 })
    expect(results.length).toBe(4)
  })
  it('', () => {
    const results = miniSearch.search('seafood')
    expect(results.length).toBe(2)
  })
  it('', () => {
    const results = miniSearch.search('ramen seafood')
    expect(results.length).toBe(5)
  })
  it('', () => {
    const results = miniSearch.search('sea')
    expect(results.length).toBe(4)
  })
  it('', () => {
    const results = miniSearch.search('sea', { prefix: true })
    expect(results.length).toBe(5)
  })
  it('', () => {
    const results = miniSearch.search('temple')
    expect(results.length).toBe(2)
  })
  it('', () => {
    const results = miniSearch.search('temples')
    expect(results.length).toBe(5)
  })
  it('', () => {
    const results = miniSearch.search('temple', { fuzzy: 0.2 })
     expect(results.length).toBe(6)
  })
  it('', () => {
    const results = miniSearch.search('temp', { prefix: true })
     expect(results.length).toBe(6)
  })
  it('', () => {
    const results = miniSearch.search('castle')
    expect(results.length).toBe(8)
  })
  it('', () => {
    const results = miniSearch.search('snow')
    expect(results.length).toBe(1)
  })
  it('', () => {
    const before = miniSearch.search('naha')
    expect(before.length).toBe(0)
    const newNote = {
      id: v4(),
      content: `Naha is the capital city of Okinawa Prefecture, Japan, and is known for its unique blend of Japanese and Okinawan cultures. It is a vibrant city with a rich history, beautiful beaches, and a bustling shopping street called Kokusai Street. Naha is also home to the historic Shurijo Castle, a UNESCO World Heritage Site.`
    }
    miniSearch.add(newNote)
    const after = miniSearch.search('naha')
    expect(after.length).toBe(1)
  })
  it('', () => {
    const before = miniSearch.search('sapporo')
    expect(before.length).toBe(1)
    const id = before[0].id
    miniSearch.discard(id)
    const after = miniSearch.search('sapporo')
    expect(after.length).toBe(0)
  })
  it('', () => {
    const json = miniSearch.toJSON()
    expect(json.documentCount).toBe(30)
    expect(json.index.length).toBeGreaterThan(500)
    expect(json.serializationVersion).toBe(2)
  })
  it('', () => {
    const before = miniSearch.search('shinjuku')
    expect(before.length).toBe(0)
    const id = notes[0].id
    const updated = {id: id, content: `Tokyo, Japan's bustling capital, is a mesmerizing blend of ultramodern skyscrapers and traditional temples. It's a city where neon-lit nightlife districts like Shibuya coexist with serene gardens and historic sites such as the Imperial Palace.  Shinjuku, a major commercial and administrative center, is also home to the Tokyo Metropolitan Government Building and offers stunning panoramic views of the city. Tokyo is also a global culinary hotspot, offering everything from Michelin-starred restaurants to tiny ramen shops, making it a truly captivating and diverse metropolis.`}
    miniSearch.replace(updated)
    const after = miniSearch.search('shinjuku')
    expect(after.length).toBe(1)
  })
})
