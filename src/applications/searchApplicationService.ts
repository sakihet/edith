import MiniSearch, { SearchOptions, SearchResult, Suggestion } from "minisearch"
import { Note } from "../types/note"
import { detectLanguage, getFirstItems, transformForSearch } from "../utils"
import { Language } from "../types/language"
import { generateTextCustom } from "../editor/editor"

// @ts-expect-error
const segmenterJa = new Intl.Segmenter('ja', { granularity: 'word' })

const SEARCH_RESULT_LIMIT = 100
const SEARCH_SUGGEST_LIMIT = 30

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
  discard(note: Note) {
    this.engine.remove(transformForSearch([note])[0])
  }
  has(id: string) {
    return this.engine.has(id)
  }
  removeAll() {
    this.engine.removeAll()
  }
  search(query: string, searchOptions?: SearchOptions) {
    return getFirstItems<SearchResult>(this.engine.search(query, searchOptions), SEARCH_RESULT_LIMIT)
  }
  suggest(query: string, searchOptions?: SearchOptions) {
    return getFirstItems<Suggestion>(this.engine.autoSuggest(query, searchOptions), SEARCH_SUGGEST_LIMIT)
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
