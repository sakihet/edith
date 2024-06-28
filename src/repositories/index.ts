import { openDB } from 'idb'

export const DB_NAME = 'e1'
export const DB_VERSION = 1

export const open = async () => {
  await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, _oldVersion, _newVersion, _transaction) {
      db.createObjectStore('notes', { keyPath: 'id' })
    }
  })
}
