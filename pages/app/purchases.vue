<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Purchases</h2>
      <p class="text-gray-600 mt-1">Track your purchased items</p>
    </div>

    <div v-if="!buildStore.selectedBuildId" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p class="text-yellow-800">Please select a build first</p>
    </div>

    <div v-else>
      <div class="mb-6 bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Spent</p>
            <p class="text-3xl font-bold text-gray-900">₺{{ totals.total.toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Items</p>
            <p class="text-3xl font-bold text-gray-900">{{ totals.count }}</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
      </div>

      <div v-else-if="purchases.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <ShoppingCart class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Purchases Yet</h3>
        <p class="text-gray-600">Purchases will appear here when items are marked as bought</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Model</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Purchased</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="purchase in purchases" :key="purchase.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ purchase.part_items?.products?.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ purchase.part_items?.products?.brand }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  {{ purchase.part_items?.products?.model }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₺{{ purchase.purchase_price?.toFixed(2) || '0' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(purchase.purchased_at).toLocaleDateString() }}
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

const loadPurchases = async () => {
  if (!buildStore.selectedBuildId) return

  loading.value = true
  const { data } = await purchasesService.fetchPurchasesForBuild($supabase, buildStore.selectedBuildId)
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
