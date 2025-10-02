import { generateText, useEditor } from "@tiptap/vue-3"
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import { BubbleMenu as BubbleMenuExt } from '@tiptap/extension-bubble-menu'
import BulletList from '@tiptap/extension-bullet-list'
import CharacterCount from '@tiptap/extension-character-count'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Document from "@tiptap/extension-document"
import Heading from '@tiptap/extension-heading'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from "@tiptap/extension-list-item"
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from "@tiptap/extension-paragraph"
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Underline from '@tiptap/extension-underline'
import Youtube from "@tiptap/extension-youtube"
import Text from '@tiptap/extension-text'
import { useDebounceFn } from '@vueuse/core'
import { Editor as TiptapEditor } from '@tiptap/core'

import Commands from './commands'
import suggestion from './suggestion'
import { Note } from "../types/note"
import { TaskCount } from '../extensions/task-count'
import { Store } from "../store"
import { detectLanguage } from "../utils"

const extensions = [
  Blockquote,
  Bold,
  BubbleMenuExt,
  BulletList,
  CharacterCount,
  Code,
  CodeBlock,
  Commands.configure({
    suggestion
  }),
  Document,
  Heading.configure({
    levels: [1, 2, 3],
  }),
  HorizontalRule,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Paragraph,
  Placeholder.configure({
    placeholder: "Write something, or press '/' for commands..."
  }),
  Strike,
  TaskCount,
  TaskItem.configure({
    nested: true
  }),
  TaskList,
  Text,
  Underline,
  Youtube,
]

export const generateTextCustom = (json: any) => generateText(json, extensions)

const debouncedFn = useDebounceFn((store: Store, note: Note, editor: TiptapEditor) => {
  store.put({
    id: note.id,
    content: editor.getJSON(),
    createdAt: note.createdAt,
    updatedAt: new Date().toISOString()
  })
}, 1000)

export function useEditorWrapper(note: Note, store: Store) {
  const editor = useEditor({
    extensions: extensions,
    content: note.content,
    onUpdate({ editor }) {
      debouncedFn(store, note, editor)
    },
    onDestroy() {
      // console.log('editor destroyed')
    },
    onCreate() {
      // editor.commands.focus()
      // editor.commands.setContent(note.content)
    },
    onSelectionUpdate({ editor }) {
      const { from, to } = editor.state.selection
      if (from === to) {
        return
      }
      const selectedText = editor.state.doc.textBetween(from, to)
      const language = detectLanguage(selectedText)
      store.selectedTextLanguage = language
    },
  })

  const focus = async () => {
    editor.value?.commands.focus()
  }

  return { editor, focus }
}
