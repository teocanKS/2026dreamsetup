<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
    <div class="p-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <Package class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="font-bold text-gray-900">2026 Setup</h2>
          <p class="text-xs text-gray-500">Build Manager</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-3">
      <NuxtLink
        to="/app"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition mb-1"
        active-class="bg-primary-50 text-primary-700 hover:bg-primary-50"
      >
        <LayoutDashboard class="w-5 h-5" />
        <span class="font-medium">Dashboard</span>
      </NuxtLink>

      <div class="mt-4">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Operations
        </div>

        <NuxtLink
          to="/app/items"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition mb-1"
          active-class="bg-primary-50 text-primary-700 hover:bg-primary-50"
        >
          <Box class="w-5 h-5" />
          <span class="font-medium">Build Items</span>
        </NuxtLink>

        <NuxtLink
          to="/app/offers"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition mb-1"
          active-class="bg-primary-50 text-primary-700 hover:bg-primary-50"
        >
          <Tag class="w-5 h-5" />
          <span class="font-medium">Offers</span>
        </NuxtLink>

        <NuxtLink
          to="/app/purchases"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition mb-1"
          active-class="bg-primary-50 text-primary-700 hover:bg-primary-50"
        >
          <ShoppingCart class="w-5 h-5" />
          <span class="font-medium">Purchases</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="p-3 border-t border-gray-200">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
      >
        <LogOut class="w-5 h-5" />
        <span class="font-medium">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, Box, Tag, ShoppingCart, LogOut, Package } from 'lucide-vue-next'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>
