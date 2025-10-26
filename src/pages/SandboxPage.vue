<script setup lang="ts">
import { v4 } from 'uuid'
import IconClose from '../components/icons/IconClose.vue'
import IconCode from '../components/icons/IconCode.vue'
import IconEditSquare from '../components/icons/IconEditSquare.vue'
import IconFormatBold from '../components/icons/IconFormatBold.vue'
import IconFormatItalic from '../components/icons/IconFormatItalic.vue'
import IconFormatStrikethrough from '../components/icons/IconFormatStrikethrough.vue'
import IconFormatUnderlined from '../components/icons/IconFormatUnderlined.vue'
import IconMoreHoriz from '../components/icons/IconMoreHoriz.vue'
import IconSearch from '../components/icons/IconSearch.vue'
import IconDarkMode from '../components/icons/IconDarkMode.vue'
import IconLightMode from '../components/icons/IconLightMode.vue'
import NoteItem from '../components/NoteItem.vue'
import NoteList from '../components/NoteList.vue'
import { Note } from '../types/note'

const content1 = {
  "type": "doc",
  "content": [
    {
      "content": [
        {
          "text": "Note 1",
          "type": "text"
        }
      ],
      "type": "paragraph"
    }
  ]
}
const content2 = {
  "type": "doc",
  "content": [
    {
      "content": [
        {
          "text": "Note 2",
          "type": "text"
        }
      ],
      "type": "paragraph"
    }
  ]
}
const content3 = {
  "type": "doc",
  "content": [
    {
      "content": [
        {
          "text": "Note 3",
          "type": "text"
        }
      ],
      "type": "paragraph"
    }
  ]
}
const now = new Date().toISOString()
const notes: Array<Note> = [
  {
    id: v4(),
    content: content1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: v4(),
    content: content2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: v4(),
    content: content3,
    createdAt: now,
    updatedAt: now
  },
]
</script>

<template>
  <div class="p-6 layout-stack-8">
    <h1>Sandbox</h1>
    <div class="layout-stack-2">
      <div class="bold text-secondary">Recently visited</div>
      <div class="text-secondary">
        <ul class="list-style-none px-0 layout-stack-h-1">
          <li class="inline-block">
            <router-link to="/#" class="text-decoration-none text-secondary">
              <div class="w-48 p-3 border-solid border-1 border-primary border-color-default hover">
                <div class="layout-stack-1">
                  <div class="text-small">Note 1</div>
                  <div class="text-small text-tertiary text-right">2024/07/27</div>
                </div>
              </div>
            </router-link>
          </li>
          <li class="inline-block">
            <router-link to="/#" class="text-decoration-none text-secondary">
              <div class="w-48 p-3 border-solid border-1 border-primary border-color-default hover">
                <div class="layout-stack-1">
                  <div class="text-small">Note 2</div>
                  <div class="text-small text-tertiary text-right">2024/07/27</div>
                </div>
              </div>
            </router-link>
          </li>
          <li class="inline-block">
            <router-link to="/#" class="text-decoration-none text-secondary">
              <div class="w-48 p-3 border-solid border-1 border-primary border-color-default hover">
                <div class="layout-stack-1">
                  <div class="text-small">Note 3</div>
                  <div class="text-small text-tertiary text-right">2024/07/27</div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <h2>Components</h2>
    <h3>Icon</h3>
    <div class="">
      <IconClose />
      <IconEditSquare />
      <IconMoreHoriz />
      <IconSearch />
      <IconFormatBold />
      <IconFormatItalic />
      <IconFormatStrikethrough />
      <IconFormatUnderlined />
      <IconCode />
      <IconLightMode />
      <IconDarkMode />
    </div>
    <h3>Button</h3>
    <div class="layout-stack-2">
      <button
        type="button"
        class="pattern-button-base"
      >Button</button>
      <button
        type="button"
        class="pattern-button-icon"
      >
        <IconEditSquare />
      </button>
      <button
        type="button"
        class="pattern-button-icon"
      >
        <IconClose />
      </button>
      <button
        type="button"
        class="pattern-button-icon"
      >
        <IconMoreHoriz />
      </button>
      <button
        type="button"
        class="pattern-button-icon"
      >
        <IconSearch />
      </button>
    </div>
    <h3>Dropdown</h3>
    <div>
      <div class="flex-row layout-stack-h-1">
        <div class="text-secondary">Content</div>
        <details class="pattern-dropdown">
          <summary class="w-6 h-6">
            <div class="pattern-button-icon">
              <IconMoreHoriz />
            </div>
          </summary>
          <div class="bg-primary">
            <ul class="list-style-none px-0 border-solid border-1 border-color-default py-2">
              <li><div class="px-4 h-8 py-1 hover pointer">Item</div></li>
              <li><div class="px-4 h-8 py-1 hover pointer">Item</div></li>
              <li><div class="px-4 h-8 py-1 hover pointer">Item</div></li>
            </ul>
          </div>
        </details>
      </div>
    </div>
    <h3>BubbleMenu</h3>
    <div>
      <div
        class="h-8 px-1 inline-block border-solid border-1 border-color-default drop-shadow"
      >
        <select class="h-6 px-2 py-1 border-none">
          <option>Text</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Heading 3</option>
        </select>
        <button type="button" class="bg-primary border-none hover pointer line-height-0">
          <IconFormatBold />
        </button>
        <button type="button" class="bg-primary border-none hover pointer line-height-0">
          <IconFormatItalic />
        </button>
        <button type="button" class="bg-primary border-none hover pointer line-height-0">
          <IconFormatStrikethrough />
        </button>
      </div>
    </div>
    <div>
      <div class="h-8 px-2 inline-flex border-solid border-1 border-color-default">
        <div class="flex-column">
          <select class="m-auto h-6 px-2 border-none">
            <option>Text</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
            <option>Heading 3</option>
          </select>
        </div>
        <div class="h-6 flex-column px-1">
          <div class="h-4 m-auto layout-stack-h-1 block">
            <button type="button" class="bg-primary border-none hover pointer line-height-0">
              <IconFormatBold />
            </button>
            <button type="button" class="bg-primary border-none hover pointer line-height-0">
              <IconFormatItalic />
            </button>
            <button type="button" class="bg-primary border-none hover pointer line-height-0">
              <IconFormatStrikethrough />
            </button>
          </div>
        </div>
      </div>
    </div>
    <h3>NoteItem</h3>
    <div class="w-64">
      <NoteItem :note="notes[0]" />
    </div>
    <h3>NoteList</h3>
    <div class="w-64">
      <NoteList :notes="notes" />
    </div>
  </div>
</template>

<style scoped>
</style>
