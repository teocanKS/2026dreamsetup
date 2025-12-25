<template>
  <div class="animate-fade-in space-y-6">
    <!-- No Build Selected -->
    <div v-if="!buildStore.selectedBuildId" class="backdrop-blur-md bg-white/60 border border-amber-200/50 rounded-xl p-8 shadow-sm text-center max-w-lg mx-auto mt-20">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 mb-4 ring-1 ring-amber-100">
        <span class="text-xl">⚠️</span>
      </div>
      <h3 class="text-slate-900 font-medium text-lg mb-2">Kurulum seçilmedi</h3>
      <p class="text-slate-500 text-sm">Alımları görmek için önce bir kurulum seçin.</p>
    </div>

    <div v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="backdrop-blur-xl bg-white/65 rounded-xl border border-white/60 p-6 flex flex-col justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:shadow-md">
           <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Toplam Harcama</p>
           <p class="text-3xl font-medium text-slate-900 tracking-tight">{{ formatCurrency(totals.total) }}</p>
        </div>
        <div class="backdrop-blur-xl bg-white/65 rounded-xl border border-white/60 p-6 flex flex-col justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:shadow-md">
           <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Alınan Parça</p>
           <p class="text-3xl font-medium text-slate-900 tracking-tight">{{ totals.count }} <span class="text-lg text-slate-400 font-normal">adet</span></p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-6 h-6 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mb-3"></div>
        <p class="text-slate-400 font-medium text-xs">Yükleniyor...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="purchases.length === 0" class="backdrop-blur-md bg-white/40 rounded-xl p-12 text-center border border-white/50 shadow-sm">
        <div class="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/60">
          <ShoppingCart class="w-6 h-6 text-slate-300" />
        </div>
        <h3 class="text-lg font-medium text-slate-900 mb-1">Henüz alım yapılmamış</h3>
        <p class="text-slate-500 text-sm">Parçalar satın alındıkça burada listelenecektir.</p>
      </div>

      <!-- Purchases Table/List -->
      <div v-else class="backdrop-blur-xl bg-white/50 rounded-2xl shadow-sm border border-white/60 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-slate-200/50 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th class="px-6 py-4 font-medium pl-8">Parça</th>
                <th class="px-6 py-4 font-medium">Kategori</th>
                <th class="px-6 py-4 font-medium">Tarih</th>
                <th class="px-6 py-4 font-medium text-right">Fiyat</th>
                <th class="px-6 py-4 font-medium text-center">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100/50">
              <tr v-for="purchase in purchases" :key="purchase.id" class="group hover:bg-white/40 transition-colors">
                <td class="px-6 py-4 pl-8">
                  <div class="flex flex-col">
                    <span class="font-medium text-slate-900 text-sm">{{ purchase.part_items?.products?.brand }}</span>
                    <span class="text-xs text-slate-500">{{ purchase.part_items?.products?.model }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100/50 px-2 py-1 rounded-md border border-slate-200/50">
                    {{ purchase.part_items?.products?.category }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">
                  {{ formatDate(purchase.purchased_at) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-sm font-medium text-slate-900 tabular-nums">
                    {{ formatCurrency(purchase.purchase_price || 0) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                   <button
                    @click="handleDelete(purchase.id)"
                    class="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    title="Alımı Sil"
                  >
                    <Trash2 class="w-4 h-4" />
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
