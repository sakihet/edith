<script setup lang="ts">
import { onMounted } from 'vue'
import { store } from './store'

onMounted(async () => {
  await store.init()
})
</script>

<template>
  <RouterView v-if="store.isLoaded" />
</template>
