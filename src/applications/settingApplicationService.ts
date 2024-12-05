import { SettingRepository } from "../repositories/settingRepository";

export interface SettingApplicationService {
  get: (key: string) => Promise<{}>
  set: (key: string, val: any) => Promise<IDBValidKey>
  del: (key: string) => Promise<void>
  clear: () => Promise<void>
  keys: () => Promise<IDBValidKey[]>
}

export class SettingApplicationServiceImpl implements SettingApplicationService {
  settingRepository: SettingRepository

  constructor (
    settingRepository: SettingRepository
  ) {
    this.settingRepository = settingRepository
  }

  async get(key: string): Promise<any> {
    return await this.settingRepository.get(key)
  }
  async set(key: string, val: any) {
    return await this.settingRepository.set(key, val)
  }
  async del (key: string) {
    return await this.settingRepository.del(key)
  }
  async clear () {
    return await this.settingRepository.clear()
  }
  async keys () {
    return await this.settingRepository.keys()
  }
}
