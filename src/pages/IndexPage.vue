<script setup lang="ts">
import AppEditor from '../components/AppEditor.vue'
</script>

<template>
  <div class="f-1 flex-column">
    <div class="f-1 flex-row">
      <div class="p-6 w-64 bg-secondary">
        <div class="layout-stack-4">
          <div class="flex-row">
            <div class="f-1"></div>
            <button
              type="button"
              title="Create a new note"
              class="pattern-button-base px-2 py-1"
            >+</button>
          </div>
          <div class="text-small text-secondary flex-row">
            <div class="f-1">Notes</div>
            <div class="text-tertiary">3</div>
          </div>
          <div>
            <ul class="text-medium text-secondary layout-stack-1 list-style-none pl-0">
              <li>
                <a href="#" class="text-decoration-none">
                  <div class="h-8 py-1">Note 1</div>
                </a>
              </li>
              <li>
                <a href="#" class="text-decoration-none">
                  <div class="h-8 py-1">Note 2</div>
                </a>
              </li>
              <li>
                <a href="#" class="text-decoration-none">
                  <div class="h-8 py-1">Note 3</div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="p-6 layout-center">
        <AppEditor />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
