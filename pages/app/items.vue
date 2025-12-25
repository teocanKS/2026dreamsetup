<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Build Items</h2>
      <p class="text-gray-600 mt-1">Manage parts for your PC build</p>
    </div>

    <div v-if="!buildStore.selectedBuildId" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p class="text-yellow-800">Please select a build first</p>
    </div>

    <div v-else>
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
      </div>

      <div v-else-if="items.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <Box class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Items Yet</h3>
        <p class="text-gray-600">Add items to your build to get started</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Model</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Target Price</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ item.products?.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ item.products?.brand }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  {{ item.products?.model }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="item.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ item.target_price?.toFixed(2) || '0.00' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ item.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    :value="item.status"
                    @change="updateStatus(item.id, ($event.target as HTMLSelectElement).value)"
                    class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="bought">Bought</option>
                    <option value="archived">Archived</option>
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

const loadItems = async () => {
  if (!buildStore.selectedBuildId) return

  loading.value = true
  const { data } = await itemsService.fetchItemsForBuild($supabase, buildStore.selectedBuildId)
  if (data) {
    items.value = data
  }
  loading.value = false
}

const updateStatus = async (itemId: string, newStatus: string) => {
  await itemsService.updateItemStatus($supabase, itemId, newStatus)
  await loadItems()
}

watch(() => buildStore.selectedBuildId, () => {
  loadItems()
})

onMounted(() => {
  loadItems()
})
</script>
