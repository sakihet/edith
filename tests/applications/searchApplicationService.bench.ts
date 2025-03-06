import { bench, describe } from "vitest"
import { v4 } from "uuid"

import { Note } from "../../src/types/note"
import { japaneseCitiesWithDescriptions } from "../../src/data"
import { generateNoteContent } from "../../src/utils"
import { SearchApplicationService } from "../../src/applications/searchApplicationService"

const service = new SearchApplicationService()

const dataForBench: Note[] = japaneseCitiesWithDescriptions.map(n => {
  const now = new Date().toISOString()
  return {
    id: v4(),
    content: generateNoteContent(n.description),
    createdAt: now,
    updatedAt: now,
  }
})
service.addAll(dataForBench)

describe('searchApplicationService', () => {
  bench('search To', () => {
    service.search("To")
  })
  bench('search Tok', () => {
    service.search("Tok")
  })
  bench('search Toky', () => {
    service.search("Toky")
  })
  bench('search Tokyo', () => {
    service.search("Tokyo")
  })
})
describe('searchApplicationService', () => {
  bench('suggest To', () => {
    service.suggest("To")
  })
  bench('suggest Tok', () => {
    service.suggest("Tok")
  })
  bench('suggest Toky', () => {
    service.suggest("Toky")
  })
  bench('suggest Tokyo', () => {
    service.suggest("Tokyo")
  })
})
