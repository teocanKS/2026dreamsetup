<template>
  <div class="animate-fade-in">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-900">Parça Listesi</h2>
      <p class="text-slate-600 mt-1">Kurulum parçalarınızı yönetin</p>
    </div>

    <div v-if="!buildStore.selectedBuildId" class="bg-amber-50 border border-amber-200 rounded-xl p-5 animate-slide-up">
      <p class="text-amber-900 font-medium">Önce bir kurulum seçin</p>
    </div>

    <div v-else>
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        <p class="text-slate-600 mt-4">Yükleniyor...</p>
      </div>

      <div v-else-if="items.length === 0" class="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200 animate-slide-up">
        <Box class="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-slate-900 mb-2">Henüz Parça Yok</h3>
        <p class="text-slate-600">Kuruluma parça ekledikçe burada görünecek</p>
      </div>

      <div v-else class="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 animate-slide-up">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Kategori</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Marka</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Model</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Durum</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Hedef Fiyat</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Öncelik</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-slate-900">{{ item.products?.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {{ item.products?.brand }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-700">
                  {{ item.products?.model }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="item.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                  {{ formatCurrency(item.target_price || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    ]"
                  >
                    {{ item.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    :value="item.status"
                    @change="updateStatus(item.id, ($event.target as HTMLSelectElement).value)"
                    class="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="planned">Planlanan</option>
                    <option value="active">Aktif</option>
                    <option value="bought">Alındı</option>
                    <option value="archived">Arşiv</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Box } from 'lucide-vue-next'
import { itemsService } from '~/services/items'

const { $supabase } = useNuxtApp()
const buildStore = useBuildStore()
const items = ref<any[]>([])
const loading = ref(true)

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('tr-TR')} ₺`
}

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
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}
</style>
