<template>
  <div class="animate-fade-in">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-900">Alım Geçmişi</h2>
      <p class="text-slate-600 mt-1">Satın alınan parçalarınızı takip edin</p>
    </div>

    <div v-if="!buildStore.selectedBuildId" class="bg-amber-50 border border-amber-200 rounded-xl p-5 animate-slide-up">
      <p class="text-amber-900 font-medium">Önce bir kurulum seçin</p>
    </div>

    <div v-else>
      <div class="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-8 border border-blue-100 animate-slide-up">
        <div class="grid grid-cols-2 gap-8">
          <div>
            <p class="text-sm text-slate-600 font-medium mb-2">Toplam Harcama</p>
            <p class="text-4xl font-bold text-slate-900">{{ formatCurrency(totals.total) }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600 font-medium mb-2">Toplam Parça</p>
            <p class="text-4xl font-bold text-slate-900">{{ totals.count }}</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        <p class="text-slate-600 mt-4">Yükleniyor...</p>
      </div>

      <div v-else-if="purchases.length === 0" class="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200 animate-slide-up">
        <ShoppingCart class="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-slate-900 mb-2">Henüz Alım Yok</h3>
        <p class="text-slate-600">Parçalar satın alındıkça burada görünecek</p>
      </div>

      <div v-else class="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 animate-slide-up">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Kategori</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Marka</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Model</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Fiyat</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tarih</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="purchase in purchases" :key="purchase.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-slate-900">{{ purchase.part_items?.products?.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {{ purchase.part_items?.products?.brand }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-700">
                  {{ purchase.part_items?.products?.model }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                  {{ formatCurrency(purchase.purchase_price || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
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

const { $supabase } = useNuxtApp()
const buildStore = useBuildStore()
const purchases = ref<any[]>([])
const loading = ref(true)
const totals = ref({ total: 0, count: 0 })

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('tr-TR')} ₺`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

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
