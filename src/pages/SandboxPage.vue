<script setup lang="ts">
import IconClose from '../components/IconClose.vue'
import IconEditSquare from '../components/IconEditSquare.vue'
import IconMoreHoriz from '../components/IconMoreHoriz.vue'
import IconSearch from '../components/IconSearch.vue'
</script>

<template>
  <div class="p-6 layout-stack-8">
    <h1>Sandbox</h1>
    <h2>Icon</h2>
    <div class="">
      <IconClose />
      <IconEditSquare />
      <IconMoreHoriz />
      <IconSearch />
    </div>
    <h2>Button</h2>
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
    <h2>Dropdown</h2>
    <div>
      <div class="flex-row layout-stack-h-1">
        <div class="text-secondary">Content</div>
        <details class="pattern-dropdown">
          <summary class="w-6 h-6">
            <div class="pattern-button-icon">
              <IconMoreHoriz />
            </div>
          </summary>
          <div>
            <ul class="list-style-none px-0 border-solid border-1 border-color-default py-2">
              <li><div class="px-4 h-8 py-1 hover pointer">Item</div></li>
              <li><div class="px-4 h-8 py-1 hover pointer">Item</div></li>
              <li><div class="px-4 h-8 py-1 hover pointer">Item</div></li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
