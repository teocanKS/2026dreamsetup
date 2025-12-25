<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AppSidebar />
    
    <div class="flex-1 flex flex-col">
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">2026 Setup Dashboard</h1>
          <BuildSelector />
        </div>
      </header>

      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

onMounted(() => {
  authStore.initialize()
})
</script>
