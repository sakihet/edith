import { reactive } from "vue";
import { Note } from "../types/note";

interface Store {
  notes: Array<Note>,
  init: () => void,
}

export const store: Store = reactive<Store>({
  notes: [],
  init: () => {
    console.log('init')
  }
})
