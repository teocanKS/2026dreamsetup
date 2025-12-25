<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      badgeClass
    ]"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const badgeClass = computed(() => {
  switch (props.status) {
    case 'planned':
      return 'bg-gray-100 text-gray-800'
    case 'active':
      return 'bg-blue-100 text-blue-800'
    case 'bought':
      return 'bg-green-100 text-green-800'
    case 'archived':
      return 'bg-gray-100 text-gray-500'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})
</script>
