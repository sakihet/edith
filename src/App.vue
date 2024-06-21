<script setup lang="ts">
import { store } from './store'

store.init()
</script>

<template>
  <nav class="px-4 py-1 layout-stack-h-4 bg-secondary">
    <RouterLink to="/" class="text-decoration-none">Index</RouterLink>
    <RouterLink to="/about" class="text-decoration-none">About</RouterLink>
  </nav>
  <RouterView />
</template>
