import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Extension } from '@tiptap/core'

export const TaskCount = Extension.create({
  name: 'taskCount',

  addStorage() {
    return {
      tasks: () => [],
    }
  },

  onBeforeCreate() {
    this.storage.tasks = () => {
      const node = this.editor.state.doc
      if (node.content && node.content.toJSON()) {
        const taskLists = node.content.toJSON().filter((c: { type: string }) => c.type === 'taskList')
        const taskItems = taskLists.map((l: { content: any }) => l.content)
        return taskItems.flat()
      }
      return []
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('taskCount'),
        filterTransaction: (transaction, state) => {
          this.storage.tasks({ node: state.doc })
          this.storage.tasks({ node: transaction.doc })
          return true
        },
      }),
    ]
  },
})
