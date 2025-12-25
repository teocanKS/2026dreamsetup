<template>
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="font-bold text-slate-900 text-lg">2026 Setup</h1>
              <p class="text-xs text-slate-600">Kurulum Takip Sistemi</p>
            </div>
          </div>

          <div class="flex gap-2 ml-8">
            <NuxtLink
              to="/app/items"
              class="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
              :class="route.path.includes('items') 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-700 hover:bg-white/60'"
            >
              Parçalar
            </NuxtLink>
            <NuxtLink
              to="/app/purchases"
              class="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
              :class="route.path.includes('purchases') 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-700 hover:bg-white/60'"
            >
              Alımlar
            </NuxtLink>
          </div>
        </div>

        <BuildSelector v-if="buildStore" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Package } from 'lucide-vue-next'

const route = useRoute()
const buildStore = useBuildStore()
</script>
