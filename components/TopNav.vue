<template>
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgba(255,255,255,0.72)] border-b border-[rgba(0,0,0,0.04)] transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <!-- Logo Area -->
        <div class="flex items-center gap-3 group cursor-default">
          <div class="w-10 h-10 bg-white shadow-sm border border-slate-200/50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <Package class="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h1 class="font-semibold text-slate-900 text-base tracking-tight leading-tight">2026 Setup</h1>
            <p class="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Dashboard</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center gap-1 h-10 p-1 bg-slate-100/50 rounded-lg border border-slate-200/50 backdrop-blur-sm">
          <NuxtLink
            to="/app/items"
            class="px-5 h-full flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200"
            :class="route.path.includes('items') 
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/50' 
              : 'text-slate-500 hover:text-slate-700'"
          >
            Parçalar
          </NuxtLink>
          <NuxtLink
            to="/app/purchases"
            class="px-5 h-full flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200"
            :class="route.path.includes('purchases') 
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/50' 
              : 'text-slate-500 hover:text-slate-700'"
          >
            Alımlar
          </NuxtLink>
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-4">
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
