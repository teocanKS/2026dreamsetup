<template>
  <span
    :class="[
      'inline-flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-xl border',
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
      return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-300'
    case 'planned':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-300'
    case 'bought':
      return 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-400'
    case 'archived':
      return 'bg-slate-200/80 text-slate-700 border-slate-300'
    default:
      return 'bg-slate-100/80 text-slate-800 border-slate-200'
  }
})
</script>
