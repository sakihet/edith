import { v4 } from 'uuid'
import { describe, expect, it } from 'vitest'

import { SearchApplicationService } from '../../src/applications/searchApplicationService'
import { japaneseCitiesWithDescriptions } from '../../src/data'
import { generateNoteContent } from "../../src/utils"
import { Note } from '../../src/types/note'

const service = new SearchApplicationService()

describe('search', () => {
  it('', () => {
    const now = new Date().toISOString()
    const note: Note = {
      id: v4(),
      content: generateNoteContent(japaneseCitiesWithDescriptions[0].description),
      createdAt: now,
      updatedAt: now
    }
    expect(service.search("Tokyo").length).toBe(0)
    service.addAll([note])
    expect(service.search("Tokyo").length).toBe(1)
  })
  it('', () => {
    const now = new Date().toISOString()
    const note: Note = {
      id: v4(),
      content: generateNoteContent(japaneseCitiesWithDescriptions[2].description),
      createdAt: now,
      updatedAt: now
    }
    expect(service.search("Osaka").length).toBe(0)
    service.addAll([note])
    expect(service.search("Osaka").length).toBe(1)
  })
})
