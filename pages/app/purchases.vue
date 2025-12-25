<template>
  <div class="animate-fade-in space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Alım Geçmişi</h1>
      <p class="text-slate-600 mt-1">Satın alınan tüm parçalar</p>
    </div>

    <div v-if="!buildStore.selectedBuildId" class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 animate-slide-up shadow-sm">
      <p class="text-amber-900 font-semibold">⚠️ Önce bir kurulum seçin</p>
    </div>

    <div v-else>
      <div class="mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white animate-slide-up">
        <div class="grid grid-cols-2 gap-8">
          <div>
            <p class="text-blue-100 font-semibold mb-3 text-sm uppercase tracking-wide">Toplam Harcama</p>
            <p class="text-5xl font-bold">{{ formatCurrency(totals.total) }}</p>
          </div>
          <div>
            <p class="text-blue-100 font-semibold mb-3 text-sm uppercase tracking-wide">Alınan Parça</p>
            <p class="text-5xl font-bold">{{ totals.count }}</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-32">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p class="text-slate-600 font-medium">Yükleniyor...</p>
      </div>

      <div v-else-if="purchases.length === 0" class="bg-white rounded-3xl p-20 text-center border border-slate-200 animate-slide-up shadow-lg">
        <div class="w-24 h-24 bg-slate-100 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
          <ShoppingCart class="w-12 h-12 text-slate-400" />
        </div>
        <h3 class="text-2xl font-bold text-slate-900 mb-3">Henüz Alım Yapılmamış</h3>
        <p class="text-slate-600 max-w-md mx-auto">Parçalar satın alındıkça burada görünecek</p>
      </div>

      <div v-else class="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200 animate-slide-up">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-slate-800 to-slate-900">
              <tr>
                <th class="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Kategori</th>
                <th class="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Marka</th>
                <th class="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Model</th>
                <th class="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Fiyat</th>
                <th class="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Tarih</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="purchase in purchases" :key="purchase.id" class="hover:bg-slate-50 transition-colors duration-200">
                <td class="px-6 py-5 whitespace-nowrap">
                  <span class="text-sm font-bold text-blue-600 uppercase">{{ purchase.part_items?.products?.category }}</span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-900">
                  {{ purchase.part_items?.products?.brand }}
                </td>
                <td class="px-6 py-5 text-sm text-slate-700">
                  {{ purchase.part_items?.products?.model }}
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-base font-bold text-slate-900">
                  {{ formatCurrency(purchase.purchase_price || 0) }}
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                  {{ formatDate(purchase.purchased_at) }}
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
import { ShoppingCart } from 'lucide-vue-next'
import { purchasesService } from '~/services/purchases'
import { formatCurrency, formatDate } from '~/utils/helpers'

const { $supabase } = useNuxtApp()
const buildStore = useBuildStore()
const purchases = ref<any[]>([])
const loading = ref(true)
const totals = ref({ total: 0, count: 0 })

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const loadPurchases = async () => {
  if (!buildStore.selectedBuildId) return

  loading.value = true
  const { data, error } = await purchasesService.fetchPurchasesForBuild($supabase, buildStore.selectedBuildId)
  if (error) {
    console.error('Purchases fetch error:', error)
  }
  if (data) {
    purchases.value = data
    totals.value = await purchasesService.calculateTotals(data)
  }
  loading.value = false
}

watch(() => buildStore.selectedBuildId, () => {
  loadPurchases()
})

onMounted(() => {
  loadPurchases()
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
}
</style>
