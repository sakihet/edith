import { reactive } from "vue"
import { Suggestion } from "minisearch"

import { Note } from "../types/note"
import { open } from "../repositories"
import { NoteApplicationServiceImpl } from "../applications/noteApplicationService"
import { NoteRepositoryImpl } from "../repositories/noteRepository"
import { Theme } from "../types/theme"
import { applyTheme, getBrowser, getPlatform, getTheme} from "../utils"
import { SettingApplicationServiceImpl } from "../applications/settingApplicationService"
import { SettingRepositoryImpl } from "../repositories/settingRepository"
import { SearchApplicationService } from "../applications/searchApplicationService"

export const commandMenuModifier = getPlatform() === 'macOS' && ['Chrome', 'Safari'].includes(getBrowser()) ? 'Meta' : 'Control'

export interface Store {
  isIndexed: boolean,
  isLoaded: boolean,
  isOpenDialog: boolean,
  enableSuggestions: boolean,
  searchQuery: string,
  searchFuzziness: number,
  theme: Theme,
  currentNote: Note | undefined,
  notes: Array<Note>,
  recentlyVisited: Array<string>,
  pressingCommandMenuModifier: boolean,
  searchResults: Array<Note>,
  searchSuggestions: Array<Suggestion>,
  init: () => Promise<void>,
  add: (note: Note) => void,
  clear: () => void,
  delete: (id: string) => void,
  put: (note: Note) => void,
  search: () => void,
  sort: (sortKey: string) => void,
  updateRecentlyVisited: (id: string) => void,
}

const noteApplicationService = new NoteApplicationServiceImpl(
  new NoteRepositoryImpl()
)
const setttingApplicatinSerivce = new SettingApplicationServiceImpl(
  new SettingRepositoryImpl()
)

const searchApplicationService = new SearchApplicationService()

export const store: Store = reactive<Store>({
  isIndexed: false,
  isLoaded: false,
  isOpenDialog: false,
  enableSuggestions: false,
  searchQuery: "",
  searchFuzziness: 0,
  theme: 'light',
  currentNote: undefined,
  notes: [],
  recentlyVisited: [],
  pressingCommandMenuModifier: false,
  searchResults: [],
  searchSuggestions: [],
  async init() {
    await open()
    const results = await noteApplicationService.getAll()
    if (results) {
      this.notes = results
    }
    const recentlyVisited = await setttingApplicatinSerivce.get('recentlyVisited')
    if (recentlyVisited) {
      this.recentlyVisited = recentlyVisited
    }
    this.theme = getTheme()
    applyTheme(this.theme)
    this.isLoaded = true
    console.log('indexing started')
    const start = performance.now()
    searchApplicationService.addAll(results)
    const end = performance.now()
    const time = end - start
    this.isIndexed = true
    console.log('indexing completed', `${searchApplicationService.count()}docs`, `${time}ms`)
  },
  async add(note: Note) {
    await noteApplicationService.add(note)
    this.notes = await noteApplicationService.getAll()
    this.sort('updated')
    return
  },
  async clear() {
    await noteApplicationService.clear()
    this.notes = await noteApplicationService.getAll()
    searchApplicationService.removeAll()
  },
  async delete(id: string) {
    const note = await noteApplicationService.get(id)
    await noteApplicationService.delete(id)
    searchApplicationService.discard(note)
    this.notes = await noteApplicationService.getAll()
    this.sort('updated')
  },
  async put(note: Note) {
    await noteApplicationService.put(note)
    searchApplicationService.update(note)
    this.notes = await noteApplicationService.getAll()
    this.sort('updated')
  },
  search () {
    if (!store.enableSuggestions) {
      store.searchSuggestions = []
    }
    if (store.searchQuery === "") {
      store.searchResults = store.notes
      store.searchSuggestions = []
    } else {
      const start = performance.now()
      if (store.enableSuggestions) {
        const suggestions = searchApplicationService.suggest(store.searchQuery, { fuzzy: store.searchFuzziness })
        store.searchSuggestions = suggestions
      }
      const ids = searchApplicationService.search(store.searchQuery, { prefix: true, fuzzy: store.searchFuzziness }).map(x => x.id)
      const end = performance.now()
      const time = end - start
      console.log('search', `${time}ms`)
      store.searchResults = store.notes.filter(n => ids.includes(n.id))
    }
  },
  sort (sortKey: string) {
    if (sortKey === 'updated') {
      this.notes = this.notes.sort((a, b) => new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1)
    } else if (sortKey === 'created') {
      this.notes = this.notes.sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1)
    }
  },
  async updateRecentlyVisited(id: string) {
    const newRecentlyVisited = [...new Set([id, ...this.recentlyVisited])]
    await setttingApplicatinSerivce.set('recentlyVisited', newRecentlyVisited)
    this.recentlyVisited = newRecentlyVisited
  }
})
