<template>
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgba(255,255,255,0.65)] border-b border-[rgba(0,0,0,0.03)] transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-12">
        <!-- Logo Area -->
        <div class="flex items-center gap-3 select-none">
          <div class="w-10 h-10 bg-white/80 shadow-glass border border-white/60 rounded-xl flex items-center justify-center">
            <Package class="w-5 h-5 text-slate-800" />
          </div>
          <h1 class="font-semibold text-slate-900 text-lg tracking-tight">2026 Setup</h1>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center gap-6">
          <NuxtLink
            to="/app/items"
            class="relative px-1 py-2 text-sm font-medium transition-colors duration-300"
            :class="route.path.includes('items') 
              ? 'text-accent-primary' 
              : 'text-slate-500 hover:text-slate-800'"
          >
            Parçalar
            <span 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-accent-primary rounded-full shadow-glow transition-transform duration-300"
              :class="route.path.includes('items') ? 'scale-x-100' : 'scale-x-0'"
            ></span>
          </NuxtLink>
          <NuxtLink
            to="/app/purchases"
            class="relative px-1 py-2 text-sm font-medium transition-colors duration-300"
            :class="route.path.includes('purchases') 
              ? 'text-accent-primary' 
              : 'text-slate-500 hover:text-slate-800'"
          >
            Alımlar
            <span 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-accent-primary rounded-full shadow-glow transition-transform duration-300"
              :class="route.path.includes('purchases') ? 'scale-x-100' : 'scale-x-0'"
            ></span>
          </NuxtLink>
        </div>
      </div>

      <!-- Right Side (Empty as requested) -->
      <div></div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Package } from 'lucide-vue-next'

const route = useRoute()
const buildStore = useBuildStore()
</script>
