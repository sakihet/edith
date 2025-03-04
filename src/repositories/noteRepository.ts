import { openDB } from "idb"
import { Note } from "../types/note"
import { DB_NAME, DB_VERSION } from "."

export interface NoteRepository {
  add: (note: Note) => Promise<IDBValidKey>
  clear: () => Promise<void>
  delete: (id: string) => Promise<void>
  get: (id: string) => Promise<Note>
  getAll: () => Promise<Note[]>
  put: (note: Note) => Promise<IDBValidKey>
}

const getStore = async () => {
  const db = await openDB(DB_NAME, DB_VERSION)
  return db.transaction('notes', 'readwrite').objectStore('notes')
}

export class NoteRepositoryImpl implements NoteRepository {
  async add (note: Note) {
    return (await getStore()).add(note)
  }
  async clear() {
    return (await getStore()).clear()
  }
  async delete(id: string) {
    return (await getStore()).delete(id)
  }
  async get(id: string) {
    return (await getStore()).get(id)
  }
  async getAll() {
    return (await getStore()).getAll()
  }
  async put(note:Note) {
    return (await getStore()).put(note)
  }
}
