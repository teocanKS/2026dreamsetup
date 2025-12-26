<template>
  <div class="animate-fade-in">
    <!-- No Build Selected State -->
    <div v-if="!buildStore.selectedBuildId" class="backdrop-blur-md bg-white/60 border border-amber-200/50 rounded-xl p-8 shadow-sm text-center max-w-lg mx-auto mt-20">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 mb-4 ring-1 ring-amber-100">
        <span class="text-xl">⚠️</span>
      </div>
      <h3 class="text-slate-900 font-medium text-lg mb-2">Kurulum seçilmedi</h3>
      <p class="text-slate-500 text-sm">Devam etmek için lütfen yukarıdan bir kurulum seçin.</p>
    </div>

    <div v-else>
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32">
        <div class="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mb-4"></div>
        <p class="text-slate-400 font-medium text-sm">Yükleniyor...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="items.length === 0" class="backdrop-blur-xl bg-white/40 rounded-2xl p-16 text-center border border-white/50 shadow-sm max-w-2xl mx-auto mt-10">
        <div class="w-20 h-20 bg-gradient-to-tr from-white to-white/0 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-white/60">
          <Box class="w-10 h-10 text-slate-300" />
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">Henüz parça yok</h3>
        <p class="text-slate-500 text-sm">Bu kuruluma henüz hiç parça eklenmemiş.</p>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="group relative bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 overflow-hidden hover:shadow-glass-hover hover:border-white/90 transition-all duration-300 hover:-translate-y-1"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Image Area -->
          <div class="relative h-64 flex items-center justify-center p-8 overflow-hidden">
            <!-- Subtle gradient backdrop -->
            <div class="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent opacity-50 transition-opacity group-hover:opacity-100"></div>
            
             <!-- Status Badge (Floating) -->
            <div class="absolute top-4 right-4 z-10 transition-transform duration-300 group-hover:scale-105">
              <StatusBadge :status="item.status" />
            </div>

            <img
              v-if="getProductImage(item.products?.category, item.products?.model)"
              :src="getProductImage(item.products?.category, item.products?.model)"
              :alt="item.products?.model"
              class="relative z-0 max-w-full max-h-full object-contain filter drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-105 group-hover:drop-shadow-lg"
              @error="handleImageError"
            />
            <div v-else class="flex flex-col items-center justify-center text-slate-300">
               <Box class="w-16 h-16 opacity-30" />
            </div>
          </div>

          <!-- Content Area -->
          <div class="p-6 pt-2 flex flex-col h-[180px]">
            <!-- Header -->
            <div class="mb-2">
              <div class="flex items-center gap-2 mb-3">
                 <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border border-accent-secondary/20 text-accent-secondary bg-accent-secondary/5">
                  {{ item.products?.category }}
                 </span>
              </div>
              
              <h3 class="text-base font-bold text-slate-900 leading-tight mb-1 group-hover:text-accent-primary transition-colors line-clamp-1">
                {{ item.products?.brand }}
              </h3>
              <p class="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 h-[2.8em]">{{ item.products?.model }}</p>
            </div>

            <!-- Footer: Price & Actions -->
            <div class="mt-auto pt-4 border-t border-slate-100/50 flex items-center justify-between">
              <div>
                <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Hedef</p>
                <p class="text-xl font-bold text-slate-800 tracking-tight lining-nums tabular-nums group-hover:text-accent-primary transition-colors">
                  {{ formatCurrency(item.target_price || 0) }}
                </p>
              </div>

              <div class="relative w-32">
                 <select
                  :value="item.status"
                  @change="updateStatus(item.id, ($event.target as HTMLSelectElement).value)"
                  class="w-full text-xs font-semibold border border-slate-200/60 rounded-lg pl-3 pr-8 py-2 bg-white/50 focus:bg-white focus:ring-1 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all text-slate-600 cursor-pointer hover:bg-white/80 appearance-none shadow-sm"
                >
                  <option value="planned">Planlanan</option>
                  <option value="active">Aktif</option>
                  <option value="bought">Alındı</option>
                  <option value="archived">Arşivlendi</option>
                </select>
                <!-- Custom arrow indicator -->
                 <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-slate-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Box } from 'lucide-vue-next'
import { itemsService } from '~/services/items'
import { formatCurrency, getProductImage } from '~/utils/helpers'

const { $supabase } = useNuxtApp()
const buildStore = useBuildStore()
const items = ref<any[]>([])
const loading = ref(true)

// Category order for sorting
const categoryOrder = ['gpu', 'cpu', 'motherboard', 'ram', 'ssd', 'cooling', 'psu', 'case', 'monitor', 'keyboard', 'switch', 'firewall']

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).style.display = 'none'
}

const loadItems = async () => {
  if (!buildStore.selectedBuildId) return

  loading.value = true
  const { data, error } = await itemsService.fetchItemsForBuild($supabase, buildStore.selectedBuildId)
  if (error) {
    console.error('Items error:', error)
  }
  if (data) {
    // Sort by category order
    items.value = data.sort((a, b) => {
      const categoryA = a.products?.category?.toLowerCase() || ''
      const categoryB = b.products?.category?.toLowerCase() || ''
      const indexA = categoryOrder.indexOf(categoryA)
      const indexB = categoryOrder.indexOf(categoryB)
      
      // If category not found in order array, put it at the end
      const orderA = indexA === -1 ? categoryOrder.length : indexA
      const orderB = indexB === -1 ? categoryOrder.length : indexB
      
      return orderA - orderB
    })
  }
  loading.value = false
}

const updateStatus = async (itemId: string, newStatus: string) => {
  await itemsService.updateItemStatus($supabase, itemId, newStatus, buildStore.selectedBuildId!)
  await loadItems()
}

watch(() => buildStore.selectedBuildId, loadItems)

onMounted(loadItems)
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.7s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: both;
}
</style>
