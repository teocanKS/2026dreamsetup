<template>
  <div class="min-h-screen bg-[#F5F5F7] font-sans selection:bg-slate-200 selection:text-slate-900">
    <TopNav />
    <main class="pt-28 pb-12 px-6">
      <div class="max-w-7xl mx-auto">
        <slot />
        <!-- Logic Keeper: Hidden BuildSelector to ensure build init -->
        <div class="hidden">
           <BuildSelector />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
