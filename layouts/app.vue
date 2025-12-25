<template>
  <div class="min-h-screen bg-slate-50 flex">
    <AppSidebar />
    
    <div class="flex-1 flex flex-col">
      <header class="bg-white border-b border-slate-200 px-8 py-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Setup Planlama</h1>
            <p class="text-sm text-slate-600 mt-0.5">2026 Kurulum Takip Sistemi</p>
          </div>
          <BuildSelector />
        </div>
      </header>

      <main class="flex-1 overflow-auto p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
