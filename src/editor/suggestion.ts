import { computePosition, flip, shift } from '@floating-ui/dom'
import { VueRenderer, posToDOMRect } from '@tiptap/vue-3'
import { Editor, Range } from '@tiptap/core'

import CommandsList from '../components/CommandsList.vue'
import { useBuiltInAi } from '../composables/useBuiltInAi'

const { promptModel, updateSession } = useBuiltInAi()

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

const MAX_SUGGESTIONS = 20

export interface SuggestionItem {
  title: string
  command: (props: { editor: Editor, range: Range }) => void
}

export default {
  char: '/',
  command: ({ editor, range, props }: { editor: Editor, range: Range, props: any }) => {
    props.command({ editor, range })
  },
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
      },
      {
        title: 'AI Continue writing',
        command: async ({ editor, range }: { editor: Editor, range: Range }) => {
          const context = editor.state.doc.textBetween(Math.max(0, range.from - 1000), range.from)
          editor.chain().focus().deleteRange(range).insertContent('AI is thinking...').run()

          try {
            await updateSession()
            const prompt = `Continue writing the following text naturally. Respond only with the continuation text.

Text:
${context}`
            const response = await promptModel(prompt)
            editor.chain().focus().deleteRange({ from: range.from, to: range.from + 'AI is thinking...'.length }).insertContent(response).run()
          } catch (e) {
            console.error(e)
            editor.chain().focus().deleteRange({ from: range.from, to: range.from + 'AI is thinking...'.length }).insertContent('Failed to generate text.').run()
          }
        }
      },
      {
        title: 'AI Extract tasks',
        command: async ({ editor, range }: { editor: Editor, range: Range }) => {
          const context = editor.state.doc.textBetween(0, editor.state.doc.content.size)
          editor.chain().focus().deleteRange(range).insertContent('Extracting tasks...').run()

          try {
            await updateSession()
            const prompt = `Extract tasks from the following text and format them as a simple list (one task per line). 
      Do not add any bullets or numbers.
      If no tasks are found, say "No tasks found".
      Important: Respond in the same language as the source text.

      Text:
      ${context}`
            const response = await promptModel(prompt)
            
            // Clean up the response and split into lines
            const tasks = response.split('\n')
              .map(line => line.replace(/^\[ \]\s*/, '').trim()) // Remove any existing [ ] if AI added it
              .filter(line => line.length > 0 && line !== 'No tasks found')

            const chain = editor.chain().focus().deleteRange({ from: range.from, to: range.from + 'Extracting tasks...'.length })

            if (tasks.length > 0) {
              chain.insertContent({
                type: 'taskList',
                content: tasks.map(task => ({
                  type: 'taskItem',
                  attrs: { checked: false },
                  content: [{
                    type: 'paragraph',
                    content: [{ type: 'text', text: task }]
                  }]
                }))
              })
            } else {
              chain.insertContent('No tasks found.')
            }
            
            chain.run()
          } catch (e) {
            console.error(e)
            editor.chain().focus().deleteRange({ from: range.from, to: range.from + 'Extracting tasks...'.length }).insertContent('Failed to extract tasks.').run()
          }
        }
      },
      {
        title: 'AI Detox',
        command: async ({ editor, range }: { editor: Editor, range: Range }) => {
          const context = editor.state.doc.textBetween(Math.max(0, range.from - 1000), range.from)
          editor.chain().focus().deleteRange(range).insertContent('AI is detoxifying...').run()

          try {
            await updateSession()
            const prompt = `Identify any toxic, aggressive, or overly critical expressions in the following text and rephrase them to be constructive, professional, and respectful while maintaining the original intent. Respond only with the rephrased text.
      Important: Respond in the same language as the source text.

      Text:
      ${context}`
            const response = await promptModel(prompt)
            editor.chain().focus().deleteRange({ from: range.from, to: range.from + 'AI is detoxifying...'.length }).insertContent(response).run()
          } catch (e) {
            console.error(e)
            editor.chain().focus().deleteRange({ from: range.from, to: range.from + 'AI is detoxifying...'.length }).insertContent('Failed to detoxify text.').run()
          }
        }
      },
      {
        title: 'AI ASCII Art',
        command: async ({ editor, range }: { editor: Editor, range: Range }) => {
          const context = editor.state.doc.textBetween(Math.max(0, range.from - 100), range.from).trim()
          editor.chain().focus().deleteRange(range).insertContent('AI is drawing...').run()

          try {
            await updateSession()
            const topic = context || 'a simple cat'
            const prompt = `Generate a simple ASCII art representing "${topic}". 
      Use only standard ASCII characters. 
      Respond only with the raw ASCII art, no extra text or markdown code blocks.`
            
            const response = await promptModel(prompt)
            
            // Remove the loading text and insert as a code block
            editor.chain()
              .focus()
              .deleteRange({ from: range.from, to: range.from + 'AI is drawing...'.length })
              .insertContent([
                {
                  type: 'codeBlock',
                  content: [{ type: 'text', text: response.trim() }]
                },
                {
                  type: 'paragraph'
                }
              ])
              .run()
          } catch (e) {
            console.error(e)
            editor.chain().focus().deleteRange({ from: range.from, to: range.from + 'AI is drawing...'.length }).insertContent('Failed to draw ASCII art.').run()
          }
        }
      },
      {
        title: 'AI Brainstorm',
        command: async ({ editor, range }: { editor: Editor, range: Range }) => {
          const context = editor.state.doc.textBetween(Math.max(0, range.from - 500), range.from).trim()
          editor.chain().focus().deleteRange(range).insertContent('AI is brainstorming...').run()

          try {
            await updateSession()
            const prompt = `Generate 5 creative, unexpected ideas or provocative questions related to the following topic to help with brainstorming. 
      Format them as a bulleted list.
      Important: Respond in the same language as the source text.

      Topic:
      ${context || 'Please provide a topic first.'}`
            
            const response = await promptModel(prompt)
            editor.chain().focus().deleteRange({ from: range.from, to: range.from + 'AI is brainstorming...'.length }).insertContent(response).run()
          } catch (e) {
            console.error(e)
            editor.chain().focus().deleteRange({ from: range.from, to: range.from + 'AI is brainstorming...'.length }).insertContent('Failed to brainstorm.').run()
          }
        }
      },

    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, MAX_SUGGESTIONS)
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
