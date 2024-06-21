import { reactive } from "vue"
import { Note } from "../types/note"
import { open } from "../repositories"

interface Store {
  notes: Array<Note>,
  init: () => void,
}

export const store: Store = reactive<Store>({
  notes: [],
  init: async () => {
    console.log('init')
    await open()
  }
})
