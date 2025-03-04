import { NoteRepository } from "../repositories/noteRepository"
import { Note } from "../types/note"

export interface NoteApplicationService {
  add: (note: Note) => Promise<IDBValidKey>
  clear: () => Promise<void>
  delete: (id: string) => Promise<void>
  get: (id: string) => Promise<Note>
  getAll: () => Promise<Note[]>
  put: (note: Note) => Promise<IDBValidKey>
}

export class NoteApplicationServiceImpl implements NoteApplicationService {
  noteRepository: NoteRepository

  constructor (
    noteRepository: NoteRepository
  ) {
    this.noteRepository = noteRepository
  }

  async add (note: Note): Promise<IDBValidKey> {
    return await this.noteRepository.add(note)
  }
  async clear (): Promise<void> {
    return await this.noteRepository.clear()
  }
  async delete (id: string): Promise<void> {
    return await this.noteRepository.delete(id)
  }
  async get (id: string): Promise<Note> {
    return await this.noteRepository.get(id)
  }
  async getAll (): Promise<Note[]> {
    return await this.noteRepository.getAll()
  }
  async put (note: Note): Promise<IDBValidKey> {
    return await this.noteRepository.put(note)
  }
}
