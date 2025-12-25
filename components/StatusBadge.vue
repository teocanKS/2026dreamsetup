<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm transition-colors',
      statusClass
    ]"
  >
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { statusMap } from '~/utils/helpers'

const props = defineProps<{
  status: string
}>()

const statusText = computed(() => statusMap[props.status] || props.status)

const statusClass = computed(() => {
  switch (props.status) {
    case 'active':
      return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-emerald-600/10'
    case 'planned':
      return 'bg-slate-100/80 text-slate-600 ring-1 ring-slate-400/10'
    case 'bought':
      return 'bg-blue-50/80 text-blue-700 ring-1 ring-blue-600/10'
    case 'archived':
      return 'bg-gray-50/80 text-gray-500 ring-1 ring-gray-400/10'
    default:
      return 'bg-slate-50/80 text-slate-600 ring-1 ring-slate-400/10'
  }
})
</script>
