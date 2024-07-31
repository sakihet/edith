<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  command: {
    type: Function,
    required: true
  },
})

const selectItem = (index: number) => {
  const item = props.items[index]
  if (item) {
    props.command(item)
  }
}

const selectedIndex = ref(0)

const upHandler = () => {
  selectedIndex.value = selectedIndex.value > 0 ? (selectedIndex.value - 1) : (props.items.length - 1)
}

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

const enterHandler = () => {
  selectItem(selectedIndex.value)
}

const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }
  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }
  if (event.key === 'Enter') {
    enterHandler()
    return true
  }
  return false
}

defineExpose({
  onKeyDown
})
</script>

<template>
  <div class="flex-column bg-primary">
    <ul v-if="items.length" class="list-style-none px-0">
      <li
        v-for="(item, index) in props.items"
        :class="{
          'pattern-selected': index === selectedIndex,
          'pattern-button-base': true
        }"
        :key="index"
        @click="selectItem(index)"
      >
        {{
          // @ts-ignore
          item.title
        }}
      </li>
    </ul>
    <div v-else>
      No result
    </div>
  </div>
</template>
