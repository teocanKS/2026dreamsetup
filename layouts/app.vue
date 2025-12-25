<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex">
    <AppSidebar />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-auto p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
