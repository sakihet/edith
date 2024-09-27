import { reactive } from "vue"
import { Note } from "../types/note"
import { open } from "../repositories"
import { NoteApplicationServiceImpl } from "../applications/noteApplicationService"
import { NoteRepositoryImpl } from "../repositories/noteRepository"
import { Theme } from "../types/theme"
import { applyTheme, getTheme } from "../utils"

interface Store {
  isLoaded: boolean,
  theme: Theme,
  currentNote: Note | undefined,
  notes: Array<Note>,
  init: () => Promise<void>,
  add: (note: Note) => void,
  clear: () => void,
  delete: (id: string) => void,
  put: (note: Note) => void,
}

const noteApplicationService = new NoteApplicationServiceImpl(
  new NoteRepositoryImpl()
)

export const store: Store = reactive<Store>({
  isLoaded: false,
  theme: 'light',
  currentNote: undefined,
  notes: [],
  async init() {
    console.log('init')
    await open()
    const results = await noteApplicationService.getAll()
    if (results) {
      this.notes = results
    }
    this.theme = getTheme()
    applyTheme(this.theme)
    this.isLoaded = true
  },
  async add(note: Note) {
    await noteApplicationService.add(note)
    this.notes = await noteApplicationService.getAll()
    return
  },
  async clear() {
    await noteApplicationService.clear()
    this.notes = await noteApplicationService.getAll()
  },
  async delete(id: string) {
    await noteApplicationService.delete(id)
    this.notes = await noteApplicationService.getAll()
  },
  async put(note: Note) {
    await noteApplicationService.put(note)
    this.notes = await noteApplicationService.getAll()
  }
})
