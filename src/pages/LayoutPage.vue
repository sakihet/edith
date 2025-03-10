<!-- TODO -->
<script setup lang="ts">
</script>

<template>
  <div class="f-1 flex-row">
    <div class="w-64 bg-secondary">
      <div class="px-4 pt-4 pb-2 flex-row">
        <div class="f-1">
          <h1 class="text-medium">Edith</h1>
        </div>
        <div>
          <button class="w-6 h-6">○</button>
        </div>
      </div>
      <div class="flex-column">
        <div class="layout-stack-1">
          <div class="px-4 flex-row">
            <div class="f-1">
              <button class="h-6 px-2 w-full text-left flex-row border-1 border-solid border-color-default text-medium gap-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <line x1="6" y1="20" x2="18" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <div class="h-full font-thin text-small grid place-items-center">
                  Index
                </div>
              </button>
            </div>
          </div>
          <div class="px-4 flex-row">
            <div class="f-1">
              <button class="h-6 px-2 w-full text-left flex-row border-1 border-solid border-color-default text-medium gap-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
                  <line x1="16" y1="16" x2="22" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <div class="h-full font-thin text-small grid place-items-center">
                  Search
                </div>
              </button>
            </div>
          </div>
        </div>
        <div class="h-8 text-small text-secondary px-4 py-1">Notes</div>
        <ul
          class="overflow-y-scroll pattern-scrollbar-thin list-style-none p-0 text-secondary layout-stack-1"
          style="height: calc(100vh - 10rem)"
        >
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
          <li>
            <div class="h-12 px-4">item</div>
          </li>
        </ul>
        <div class="h-8 px-4 py-2 text-secondary text-small font-mono">
          <a href="" class="text-secondary">About</a>
        </div>
      </div>
    </div>
    <div class="p-4">
      <p class="text-secondary">Content</p>
    </div>
  </div>
</template>

<style scoped>
</style>
