import { Editor, Range, VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'

import CommandsList from './components/CommandsList.vue'

export interface SuggestionItem {
  title: string
  command: ({}) => {}
}

export default {
  items: ({ query }: { query: string }) => {
    return [
      {
        title: 'Heading 1',
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run()
        }
      },
      {
        title: 'Heading 2',
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run()
        }
      },
      {
        title: 'Heading 3',
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run()
        }
      },
      {
        title: 'Bullet List',
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run()
        }
      },
      {
        title: 'Ordered List',
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        }
      },
      {
        title: 'Task List',
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run()
        }
      },
      {
        title: 'Blockquote',
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleBlockquote().run()
        }
      },
      {
        title: 'Horizontal Rule',
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        }
      }
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10)
  },
  render: () => {
    let component: VueRenderer
    // @ts-ignore
    let popup

    return {
      // @ts-ignore
      onStart: props => {
        component = new VueRenderer(CommandsList, {
          props,
          editor: props.editor,
        })
        if (!props.clientRect) {
          return
        }
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element || undefined,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },
      // @ts-ignore
      onUpdate(props) {
        component.updateProps(props)
        if (!props.clientRect) {
          return
        }
        // @ts-ignore
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },
      // @ts-ignore
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          // @ts-ignore
          popup[0].hide()
          return true
        }
        return component.ref?.onKeyDown(props)
      },
      onExit() {
        // @ts-ignore
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}
