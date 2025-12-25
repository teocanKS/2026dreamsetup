<template>
  <div class="text-sm">
    <span v-if="minPrice && maxPrice" class="font-medium text-gray-900">
      ${{ minPrice.toFixed(2) }} - ${{ maxPrice.toFixed(2) }}
    </span>
    <span v-else-if="minPrice" class="font-medium text-gray-900">
      ${{ minPrice.toFixed(2) }}
    </span>
    <span v-else class="text-gray-500">
      No estimate
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  minPrice?: number
  maxPrice?: number
}>()
</script>
