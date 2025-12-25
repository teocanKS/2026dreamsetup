<template>
  <div class="animate-fade-in space-y-8">
    <div v-if="!buildStore.selectedBuildId" class="backdrop-blur-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300/30 rounded-2xl p-6 shadow-xl">
      <p class="text-amber-900 font-bold">⚠️ Önce bir kurulum seçin</p>
    </div>

    <div v-else>
      <div class="mb-8 backdrop-blur-2xl bg-gradient-to-br from-blue-600/90 to-indigo-700/90 rounded-3xl shadow-2xl p-10 border border-white/20 animate-slide-up">
        <div class="grid grid-cols-2 gap-10">
          <div>
            <p class="text-blue-100 font-black mb-4 text-sm uppercase tracking-widest">Toplam Harcama</p>
            <p class="text-6xl font-black text-white drop-shadow-lg">{{ formatCurrency(totals.total) }}</p>
          </div>
          <div>
            <p class="text-blue-100 font-black mb-4 text-sm uppercase tracking-widest">Alınan Parça</p>
            <p class="text-6xl font-black text-white drop-shadow-lg">{{ totals.count }}</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-32">
        <div class="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-600 border-t-transparent mb-5"></div>
        <p class="text-slate-700 font-semibold text-lg">Yükleniyor...</p>
      </div>

      <div v-else-if="purchases.length === 0" class="backdrop-blur-2xl bg-white/40 rounded-3xl p-24 text-center border border-white/60 shadow-2xl animate-slide-up">
        <div class="w-28 h-28 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-8 border border-white/40">
          <ShoppingCart class="w-14 h-14 text-slate-400" />
        </div>
        <h3 class="text-3xl font-bold text-slate-900 mb-4">Henüz Alım Yapılmamış</h3>
        <p class="text-slate-600 text-lg max-w-lg mx-auto">Parçalar satın alındıkça burada görünecek</p>
      </div>

      <div v-else class="backdrop-blur-2xl bg-white/50 rounded-3xl shadow-2xl overflow-hidden border border-white/60 animate-slide-up">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-slate-900 to-slate-800">
              <tr>
                <th class="px-8 py-6 text-left text-xs font-black text-white uppercase tracking-widest">Kategori</th>
                <th class="px-8 py-6 text-left text-xs font-black text-white uppercase tracking-widest">Marka</th>
                <th class="px-8 py-6 text-left text-xs font-black text-white uppercase tracking-widest">Model</th>
                <th class="px-8 py-6 text-left text-xs font-black text-white uppercase tracking-widest">Fiyat</th>
                <th class="px-8 py-6 text-left text-xs font-black text-white uppercase tracking-widest">Tarih</th>
                <th class="px-8 py-6 text-left text-xs font-black text-white uppercase tracking-widest">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200/50 backdrop-blur-xl bg-white/30">
              <tr v-for="purchase in purchases" :key="purchase.id" class="hover:bg-white/60 transition-all duration-300">
                <td class="px-8 py-6 whitespace-nowrap">
                  <span class="text-sm font-black text-blue-600 uppercase bg-blue-50/80 px-3 py-1.5 rounded-lg">
                    {{ purchase.part_items?.products?.category }}
                  </span>
                </td>
                <td class="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-900">
                  {{ purchase.part_items?.products?.brand }}
                </td>
                <td class="px-8 py-6 text-sm text-slate-700 font-medium">
                  {{ purchase.part_items?.products?.model }}
                </td>
                <td class="px-8 py-6 whitespace-nowrap text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {{ formatCurrency(purchase.purchase_price || 0) }}
                </td>
                <td class="px-8 py-6 whitespace-nowrap text-sm text-slate-600 font-semibold">
                  {{ formatDate(purchase.purchased_at) }}
                </td>
                <td class="px-8 py-6 whitespace-nowrap">
                  <button
                    @click="handleDelete(purchase.id)"
                    class="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    title="Alımı Sil"
                  >
                    <Trash2 class="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
                  </button>
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
import { ShoppingCart, Trash2 } from 'lucide-vue-next'
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
    console.error('Purchases error:', error)
  }
  if (data) {
    purchases.value = data
    totals.value = await purchasesService.calculateTotals(data)
  }
  loading.value = false
}

const handleDelete = async (purchaseId: string) => {
  if (!confirm('Bu alımı silmek istediğinizden emin misiniz? Parça durumu otomatik olarak "Aktif" konumuna dönecektir.')) {
    return
  }

  const { success, error } = await purchasesService.deletePurchase($supabase, purchaseId)
  if (success) {
    await loadPurchases()
  } else {
    console.error('Failed to delete purchase:', error)
    alert('Alım silinirken bir hata oluştu.')
  }
}

watch(() => buildStore.selectedBuildId, loadPurchases)

onMounted(loadPurchases)
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
}
</style>
