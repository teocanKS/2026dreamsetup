<template>
  <div class="relative" v-if="builds.length > 0">
    <select
      v-model="selectedBuild"
      @change="handleBuildChange"
      class="appearance-none bg-white/60 hover:bg-white/80 border border-slate-200/60 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:border-slate-400 transition-colors backdrop-blur-sm cursor-pointer shadow-sm"
    >
      <option v-for="build in builds" :key="build.build_id" :value="build.build_id">
        {{ build.name }}
      </option>
    </select>
    <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const { $supabase } = useNuxtApp()
const buildStore = useBuildStore()
const builds = ref<any[]>([])
const selectedBuild = ref<string | null>(null)

const loadBuilds = async () => {
  const { data } = await $supabase
    .from('v_build_dashboard')
    .select('*')

  if (data && data.length > 0) {
    builds.value = data
    if (!buildStore.selectedBuildId) {
      buildStore.selectBuild(data[0].build_id)
    }
    selectedBuild.value = buildStore.selectedBuildId
  }
}

const handleBuildChange = () => {
  if (selectedBuild.value) {
    buildStore.selectBuild(selectedBuild.value)
  }
}

watch(() => buildStore.selectedBuildId, (newId) => {
  selectedBuild.value = newId
})

onMounted(() => {
  loadBuilds()
})
</script>
