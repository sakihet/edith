import MiniSearch, { SearchOptions } from "minisearch"
import { Note } from "../types/note"
import { detectLanguage, transformForSearch } from "../utils"
import { Language } from "../types/language"
import { generateTextCustom } from "../editor"

const segmenterJa = new Intl.Segmenter('ja', { granularity: 'word' })

export class SearchApplicationService {
  engine: MiniSearch

  constructor() {
    this.engine = new MiniSearch({
      fields: ['content'],
      storeFields: ['content'],
      tokenize: (string: string, _fieldName) => this.tokenize(string)
    })
  }

  tokenize(string: string) {
    const language = detectLanguage(string)
    if (language === Language.Japanese) {
      return Array.from(segmenterJa.segment(string), ({ segment }) => segment)
    } else {
      return MiniSearch.getDefault('tokenize')(string)
    }
  }

  add(note: Note) {
    this.engine.add(transformForSearch([note]))
  }
  addAll(notes: Note[]) {
    this.engine.addAll(transformForSearch(notes))
  }
  count() {
    return this.engine.documentCount
  }
  discard(id: string) {
    this.engine.remove(id)
  }
  has(id: string) {
    return this.engine.has(id)
  }
  removeAll() {
    this.engine.removeAll()
  }
  search(query: string, searchOptions?: SearchOptions) {
    return this.engine.search(query, searchOptions)
  }
  suggest(query: string, searchOptions?: SearchOptions) {
    return this.engine.autoSuggest(query, searchOptions)
  }
  update(note: Note) {
    if (this.engine.has(note.id)) {
      this.engine.replace({
        id: note.id,
        content: generateTextCustom(note.content)
      })
    } else {
      this.engine.add({
        id: note.id,
        content: generateTextCustom(note.content)
      })
    }
  }
}
