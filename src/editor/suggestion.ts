import { computePosition, flip, shift } from '@floating-ui/dom'
import { Editor, Range, VueRenderer, posToDOMRect } from '@tiptap/vue-3'

import CommandsList from '../components/CommandsList.vue'

// @ts-ignore
const updatePosition = (editor, element) => {
  const virtualElement = {
    getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
}

export interface SuggestionItem {
  title: string
  command: () => {}
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
        title: 'Code Block',
        command: ({ editor, range }: { editor: Editor, range: Range}) => {
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
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
    let component: any

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
        component.element.style.position = 'absolute'
        document.body.appendChild(component.element)
        updatePosition(props.editor, component.element)
      },
      // @ts-ignore
      onUpdate(props) {
        component.updateProps(props)
        if (!props.clientRect) {
          return
        }
        updatePosition(props.editor, component.element)
      },
      // @ts-ignore
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          component.destroy()
          component.element.remove()

          return true
        }
        return component.ref?.onKeyDown(props)
      },
      onExit() {
        component.destroy()
        component.element.remove()
      },
    }
  },
}
