import { openDB } from 'idb'

export const DB_NAME = 'edith'
export const DB_VERSION = 2

export const open = async () => {
  await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, _newVersion, _transaction) {
      if (oldVersion < 1) {
        db.createObjectStore('notes', { keyPath: 'id' })
      }
      if (oldVersion < 2) {
        db.createObjectStore('settings')
      }
    }
  })
}
