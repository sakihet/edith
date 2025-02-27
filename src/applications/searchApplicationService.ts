import MiniSearch, { SearchOptions } from "minisearch"
import { Note } from "../types/note"
import { transformForSearch } from "../utils"

export class SearchApplicationService {
  engine: MiniSearch

  constructor() {
    this.engine = new MiniSearch({
      fields: ['content'],
      storeFields: ['content']
    })
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
        content: note.content
      })
    } else {
      this.engine.add({
        id: note.id,
        content: note.content
      })
    }
  }
}
