import { reactive } from "vue"
import MiniSearch from "minisearch"

import { Note } from "../types/note"
import { open } from "../repositories"
import { NoteApplicationServiceImpl } from "../applications/noteApplicationService"
import { NoteRepositoryImpl } from "../repositories/noteRepository"
import { Theme } from "../types/theme"
import { applyTheme, getBrowser, getPlatform, getTheme } from "../utils"
import { SettingApplicationServiceImpl } from "../applications/settingApplicationService"
import { SettingRepositoryImpl } from "../repositories/settingRepository"
import { generateTextCustom } from "../editor"

export const commandMenuModifier = getPlatform() === 'macOS' && ['Chrome', 'Safari'].includes(getBrowser()) ? 'Meta' : 'Control'

const miniSearch = new MiniSearch({
  fields: ['content'],
  storeFields: ['content']
})

export interface Store {
  isIndexed: boolean,
  isLoaded: boolean,
  isOpenDialog: boolean,
  searchQuery: string,
  theme: Theme,
  currentNote: Note | undefined,
  notes: Array<Note>,
  recentlyVisited: Array<string>,
  pressingCommandMenuModifier: boolean,
  searchResults: Array<Note>,
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
const transformForSearch = (notes: Note[]) => {
  return notes.map(({ id, content }) => ({
    id: id,
    content: generateTextCustom(content),
  }))
}

export const store: Store = reactive<Store>({
  isIndexed: false,
  isLoaded: false,
  isOpenDialog: false,
  searchQuery: "",
  theme: 'light',
  currentNote: undefined,
  notes: [],
  recentlyVisited: [],
  pressingCommandMenuModifier: false,
  searchResults: [],
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
    miniSearch.addAll(transformForSearch(results))
    const end = performance.now()
    const time = end - start
    this.isIndexed = true
    console.log('indexing completed', `${miniSearch.documentCount}docs`, `${time}ms`)
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
    miniSearch.removeAll()
  },
  async delete(id: string) {
    await noteApplicationService.delete(id)
    miniSearch.discard(id)
    this.notes = await noteApplicationService.getAll()
    this.sort('updated')
  },
  async put(note: Note) {
    await noteApplicationService.put(note)
    if (miniSearch.has(note.id)) {
      miniSearch.replace({
        id: note.id,
        content: generateTextCustom(note.content)
      })
    } else {
      miniSearch.add({
        id: note.id,
        content: generateTextCustom(note.content)
      })
    }
    this.notes = await noteApplicationService.getAll()
    this.sort('updated')
  },
  search () {
    if (store.searchQuery === "") {
      store.searchResults = store.notes
    } else {
      const start = performance.now()
      const ids = miniSearch.search(store.searchQuery, { prefix: true, fuzzy: 0.1 }).map(x => x.id)
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
