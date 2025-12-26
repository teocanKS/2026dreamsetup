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
      return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-glow-sm shadow-emerald-500/10'
    case 'planned':
      return 'bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-glow-sm shadow-amber-500/10'
    case 'bought':
      return 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20 shadow-glow-sm'
    case 'archived':
      return 'bg-slate-500/5 text-slate-500 border border-slate-500/20'
    default:
      return 'bg-slate-500/5 text-slate-600 border border-slate-500/20'
  }
})
</script>
