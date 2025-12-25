<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm',
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
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    case 'planned':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'bought':
      return 'bg-green-600 text-white'
    case 'archived':
      return 'bg-slate-200 text-slate-700 border border-slate-300'
    default:
      return 'bg-slate-100 text-slate-800'
  }
})
</script>
