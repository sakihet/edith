import { computed, reactive } from "vue"
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

export interface Store {
  isLoaded: boolean,
  isOpenDialog: boolean,
  searchQuery: string,
  theme: Theme,
  currentNote: Note | undefined,
  notes: Array<Note>,
  recentlyVisited: Array<string>,
  pressingCommandMenuModifier: boolean,
  init: () => Promise<void>,
  add: (note: Note) => void,
  clear: () => void,
  delete: (id: string) => void,
  put: (note: Note) => void,
  sort: (sortKey: string) => void,
  updateRecentlyVisited: (id: string) => void,
}

const noteApplicationService = new NoteApplicationServiceImpl(
  new NoteRepositoryImpl()
)
const setttingApplicatinSerivce = new SettingApplicationServiceImpl(
  new SettingRepositoryImpl()
)

export const store: Store = reactive<Store>({
  isLoaded: false,
  isOpenDialog: false,
  searchQuery: "",
  theme: 'light',
  currentNote: undefined,
  notes: [],
  recentlyVisited: [],
  pressingCommandMenuModifier: false,
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
  },
  async delete(id: string) {
    await noteApplicationService.delete(id)
    this.notes = await noteApplicationService.getAll()
    this.sort('updated')
  },
  async put(note: Note) {
    await noteApplicationService.put(note)
    this.notes = await noteApplicationService.getAll()
    this.sort('updated')
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

export const notesResult = computed(() =>
  store.notes.filter(n =>
    generateTextCustom(n.content).includes(store.searchQuery)
  )
)
