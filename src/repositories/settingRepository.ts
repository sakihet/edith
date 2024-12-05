import { openDB } from "idb"
import { DB_NAME, DB_VERSION } from "."

export interface SettingRepository {
  get: (key: string) => Promise<{}>
  set: (key: string, val: any) => Promise<IDBValidKey>
  del: (key: string) => Promise<void>
  clear: () => Promise<void>
  keys: () => Promise<IDBValidKey[]>
}

const getStore = async () => {
  const db = await openDB(DB_NAME, DB_VERSION)
  return db.transaction('settings', 'readwrite').objectStore('settings')
}

export class SettingRepositoryImpl implements SettingRepository {
  async get (key: string) {
    return (await getStore()).get(key)
  }
  async set (key: string, val: any) {
    return (await getStore()).put(val, key)
  }
  async del (key: string) {
    return (await getStore()).delete(key)
  }
  async clear () {
    return (await getStore()).clear()
  }
  async keys () {
    return (await getStore()).getAllKeys()
  }
}
