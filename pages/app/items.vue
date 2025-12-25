<template>
  <div class="animate-fade-in space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Kurulum Parçaları</h1>
        <p class="text-slate-600 mt-1">2026 Setup için tüm donanım bileşenleri</p>
      </div>
      <BuildSelector />
    </div>

    <div v-if="!buildStore.selectedBuildId" class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 animate-slide-up shadow-sm">
      <p class="text-amber-900 font-semibold">⚠️ Önce bir kurulum seçin</p>
    </div>

    <div v-else>
      <div v-if="loading" class="text-center py-32">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p class="text-slate-600 font-medium">Parçalar yükleniyor...</p>
      </div>

      <div v-else-if="items.length === 0" class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-20 text-center border border-slate-200 animate-slide-up shadow-lg">
        <div class="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
          <Box class="w-12 h-12 text-slate-400" />
        </div>
        <h3 class="text-2xl font-bold text-slate-900 mb-3">Henüz Parça Eklenmemiş</h3>
        <p class="text-slate-600 max-w-md mx-auto">Kuruluma parça ekledikçe burada görünecek</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200 overflow-hidden group hover:-translate-y-2 transform animate-slide-up"
          :style="{ animationDelay: `${index * 80}ms` }"
        >
          <div class="relative h-56 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
            <img
              v-if="getProductImage(item.products?.model)"
              :src="getProductImage(item.products?.model)"
              :alt="item.products?.model"
              class="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
              @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Box class="w-16 h-16 text-slate-300" />
            </div>
            <div class="absolute top-4 right-4">
              <StatusBadge :status="item.status" />
            </div>
          </div>

          <div class="p-6">
            <div class="mb-4">
              <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{{ item.products?.category }}</p>
              <h3 class="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                {{ item.products?.brand }}
              </h3>
              <p class="text-sm text-slate-600 line-clamp-2">{{ item.products?.model }}</p>
            </div>

            <div class="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <div>
                <p class="text-xs text-slate-500 font-medium mb-1">Hedef Fiyat</p>
                <p class="text-xl font-bold text-slate-900">{{ formatCurrency(item.target_price || 0) }}</p>
              </div>
              <div>
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide',
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  ]"
                >
                  {{ item.priority }}
                </span>
              </div>
            </div>

            <select
              :value="item.status"
              @change="updateStatus(item.id, ($event.target as HTMLSelectElement).value)"
              class="w-full text-sm font-semibold border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-slate-300 cursor-pointer"
            >
              <option value="planned">Planlanan</option>
              <option value="active">Aktif</option>
              <option value="bought">Alındı</option>
              <option value="archived">Arşivlendi</option>
            </select>

            <p v-if="item.note" class="mt-4 text-sm text-slate-500 italic">{{ item.note }}</p>
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

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const loadItems = async () => {
  if (!buildStore.selectedBuildId) return

  loading.value = true
  const { data, error } = await itemsService.fetchItemsForBuild($supabase, buildStore.selectedBuildId)
  if (error) {
    console.error('Items fetch error:', error)
  }
  if (data) {
    items.value = data
  }
  loading.value = false
}

const updateStatus = async (itemId: string, newStatus: string) => {
  const { error } = await itemsService.updateItemStatus($supabase, itemId, newStatus)
  if (error) {
    console.error('Status update error:', error)
  }
  await loadItems()
}

watch(() => buildStore.selectedBuildId, () => {
  loadItems()
})

onMounted(() => {
  loadItems()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.7s ease-out;
  animation-fill-mode: both;
}
</style>
