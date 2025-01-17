import { Editor, generateText } from "@tiptap/vue-3"
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import { BubbleMenu as BubbleMenuExt } from '@tiptap/extension-bubble-menu'
import BulletList from '@tiptap/extension-bullet-list'
import CharacterCount from '@tiptap/extension-character-count'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Heading from '@tiptap/extension-heading'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Strike from '@tiptap/extension-strike'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Underline from '@tiptap/extension-underline'
import Youtube from "@tiptap/extension-youtube"

import Commands from './commands'
import suggestion from './suggestion'
import { Note } from "./types/note"
import { TaskCount } from './extensions/task-count'
import { Store } from "./store"

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
  Heading.configure({
    levels: [1, 2, 3],
  }),
  HorizontalRule,
  Italic,
  Link,
  OrderedList,
  Placeholder.configure({
    placeholder: "Write something, or press '/' for commands..."
  }),
  StarterKit,
  Strike,
  TaskCount,
  TaskItem.configure({
    nested: true
  }),
  TaskList,
  Underline,
  Youtube,
]

export const generateTextCustom = (json: any) => generateText(json, extensions)

export const createEditor = (note: Note, store:Store) => new Editor({
  content: note.content,
  extensions: extensions,
  onUpdate({ editor }) {
    store.put({
      id: note.id,
      content: editor.getJSON(),
      createdAt: note.createdAt,
      updatedAt: new Date().toISOString()
    })
  }
})
