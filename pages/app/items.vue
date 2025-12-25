<template>
  <div class="animate-fade-in">
    <div v-if="!buildStore.selectedBuildId" class="backdrop-blur-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300/30 rounded-2xl p-6 shadow-xl">
      <p class="text-amber-900 font-bold">⚠️ Önce bir kurulum seçin</p>
    </div>

    <div v-else>
      <div v-if="loading" class="text-center py-32">
        <div class="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-600 border-t-transparent mb-5"></div>
        <p class="text-slate-700 font-semibold text-lg">Parçalar yükleniyor...</p>
      </div>

      <div v-else-if="items.length === 0" class="backdrop-blur-2xl bg-white/40 rounded-3xl p-24 text-center border border-white/60 shadow-2xl">
        <div class="w-28 h-28 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-8 border border-white/40">
          <Box class="w-14 h-14 text-slate-400" />
        </div>
        <h3 class="text-3xl font-bold text-slate-900 mb-4">Henüz Parça Eklenmemiş</h3>
        <p class="text-slate-600 text-lg max-w-lg mx-auto">Kuruluma parça ekled ikçe burada görünecek</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="group backdrop-blur-2xl bg-white/50 rounded-3xl border border-white/60 overflow-hidden hover:shadow-2xl hover:bg-white/70 transition-all duration-500 hover:-translate-y-2 transform animate-slide-up"
          :style="{ animationDelay: `${index * 60}ms` }"
        >
          <div class="relative h-64 bg-gradient-to-br from-slate-100/80 to-slate-50/60 overflow-hidden border-b border-white/40">
            <img
              v-if="getProductImage(item.products?.category, item.products?.model)"
              :src="getProductImage(item.products?.category, item.products?.model)"
              :alt="item.products?.model"
              class="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Box class="w-20 h-20 text-slate-300" />
            </div>
            <div class="absolute top-4 right-4">
              <StatusBadge :status="item.status" />
            </div>
          </div>

          <div class="p-7">
            <div class="mb-5">
              <p class="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 bg-blue-50/80 inline-block px-3 py-1 rounded-lg">
                {{ item.products?.category }}
              </p>
              <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                {{ item.products?.brand }}
              </h3>
              <p class="text-sm text-slate-600 line-clamp-2 leading-relaxed">{{ item.products?.model }}</p>
            </div>

            <div class="flex items-center justify-between mb-5 pb-5 border-b border-slate-200/60">
              <div>
                <p class="text-xs text-slate-500 font-bold uppercase tracking-wide mb-2">Hedef Fiyat</p>
                <p class="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {{ formatCurrency(item.target_price || 0) }}
                </p>
              </div>
            </div>

            <select
              :value="item.status"
              @change="updateStatus(item.id, ($event.target as HTMLSelectElement).value)"
              class="w-full text-sm font-bold border-2 border-slate-300/60 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all backdrop-blur-xl bg-white/60 hover:bg-white/80 cursor-pointer shadow-sm"
            >
              <option value="planned">Planlanan</option>
              <option value="active">Aktif</option>
              <option value="bought">Alındı</option>
              <option value="archived">Arşivlendi</option>
            </select>
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
