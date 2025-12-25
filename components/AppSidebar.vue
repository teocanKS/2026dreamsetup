<template>
  <aside class="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col shadow-xl">
    <div class="p-6 border-b border-slate-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Package class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="font-bold text-white">2026 Setup</h2>
          <p class="text-xs text-slate-400">Kurulum Yöneticisi</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-3 py-4">
      <NuxtLink
        to="/app"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 mb-1 group"
        active-class="bg-blue-600 text-white hover:bg-blue-600"
      >
        <LayoutDashboard class="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span class="font-medium">Panel</span>
      </NuxtLink>

      <div class="mt-6">
        <div class="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          İşlemler
        </div>

        <NuxtLink
          to="/app/items"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 mb-1 group"
          active-class="bg-blue-600 text-white hover:bg-blue-600"
        >
          <Box class="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span class="font-medium">Parçalar</span>
        </NuxtLink>

        <NuxtLink
          to="/app/offers"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 mb-1 group"
          active-class="bg-blue-600 text-white hover:bg-blue-600"
        >
          <Tag class="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span class="font-medium">Teklifler</span>
        </NuxtLink>

        <NuxtLink
          to="/app/purchases"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 mb-1 group"
          active-class="bg-blue-600 text-white hover:bg-blue-600"
        >
          <ShoppingCart class="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span class="font-medium">Alımlar</span>
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, Box, Tag, ShoppingCart, Package } from 'lucide-vue-next'
</script>
