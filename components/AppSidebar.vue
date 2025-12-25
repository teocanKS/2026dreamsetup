<template>
  <aside class="w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col shadow-2xl">
    <div class="p-8 border-b border-slate-700/50">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Package class="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 class="font-bold text-white text-lg">2026 Setup</h2>
          <p class="text-xs text-slate-400">Kurulum Takip</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-4 py-6">
      <NuxtLink
        to="/app/items"
        class="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-700/40 hover:text-white transition-all duration-300 mb-2 group"
        active-class="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-blue-600"
      >
        <Box class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span class="font-semibold">Parçalar</span>
      </NuxtLink>

      <NuxtLink
        to="/app/offers"
        class="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-700/40 hover:text-white transition-all duration-300 mb-2 group"
        active-class="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-blue-600"
      >
        <Tag class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span class="font-semibold">Teklifler</span>
      </NuxtLink>

      <NuxtLink
        to="/app/purchases"
        class="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-700/40 hover:text-white transition-all duration-300 mb-2 group"
        active-class="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-blue-600"
      >
        <ShoppingCart class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span class="font-semibold">Alımlar</span>
      </NuxtLink>
    </nav>

    <div class="p-6 border-t border-slate-700/50">
      <div class="text-xs text-slate-500 text-center">
        <p class="font-medium">2026 Dream Setup</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Box, Tag, ShoppingCart, Package } from 'lucide-vue-next'
</script>
