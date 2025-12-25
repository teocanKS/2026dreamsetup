<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Offers</h2>
        <p class="text-gray-600 mt-1">Manage vendor offers and pricing</p>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition inline-flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Add Offer
      </button>
    </div>

    <div v-if="!buildStore.selectedBuildId" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p class="text-yellow-800">Please select a build first</p>
    </div>

    <div v-else>
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
      </div>

      <div v-else-if="offers.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <Tag class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Offers Yet</h3>
        <p class="text-gray-600">Add offers to track pricing from different vendors</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Base Price</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Est. Range</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Flags</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="offer in offers" :key="offer.offer_id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ offer.vendor_name }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ offer.base_price?.toFixed(2) || '0.00' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <PriceRange
                    :min-price="offer.est_price_min"
                    :max-price="offer.est_price_max"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      offer.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ offer.in_stock ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex gap-1">
                    <span
                      v-if="offer.is_primary"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      Primary
                    </span>
                    <span
                      v-if="offer.is_estimated"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      Estimated
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    v-if="!offer.is_primary"
                    @click="setPrimary(offer.offer_id, offer.part_item_id)"
                    class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Set Primary
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Modal v-model="showAddModal" title="Add Offer">
      <form @submit.prevent="handleAddOffer" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Part Item</label>
          <select
            v-model="newOffer.part_item_id"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select item...</option>
            <option v-for="item in partItems" :key="item.id" :value="item.id">
              {{ item.products?.category }} - {{ item.products?.brand }} {{ item.products?.model }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
          <input
            v-model="newOffer.vendor_name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Kind</label>
          <input
            v-model="newOffer.kind"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            v-model="newOffer.url"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Base Price</label>
          <input
            v-model.number="newOffer.base_price"
            type="number"
            step="0.01"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input v-model="newOffer.in_stock" type="checkbox" class="rounded border-gray-300" />
            <span class="text-sm text-gray-700">In Stock</span>
          </label>

          <label class="flex items-center gap-2">
            <input v-model="newOffer.is_estimated" type="checkbox" class="rounded border-gray-300" />
            <span class="text-sm text-gray-700">Estimated</span>
          </label>

          <label class="flex items-center gap-2">
            <input v-model="includeDiscount" type="checkbox" class="rounded border-gray-300" />
            <span class="text-sm text-gray-700">Add Discount Range</span>
          </label>
        </div>

        <div v-if="includeDiscount" class="border-t pt-4 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Min Discount %</label>
              <input
                v-model.number="discountRange.min_percent"
                type="number"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Discount %</label>
              <input
                v-model.number="discountRange.max_percent"
                type="number"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confidence</label>
            <select
              v-model="discountRange.confidence"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <input
              v-model="discountRange.source"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Note</label>
          <textarea
            v-model="newOffer.note"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>

        <div class="flex gap-3 justify-end">
          <button
            type="button"
            @click="showAddModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50"
          >
            {{ submitting ? 'Adding...' : 'Add Offer' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Plus, Tag } from 'lucide-vue-next'
import { offersService } from '~/services/offers'
import { itemsService } from '~/services/items'

const { $supabase } = useNuxtApp()
const buildStore = useBuildStore()
const offers = ref<any[]>([])
const partItems = ref<any[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const submitting = ref(false)
const includeDiscount = ref(false)

const newOffer = ref({
  part_item_id: '',
  vendor_name: '',
  kind: '',
  url: '',
  base_price: 0,
  in_stock: true,
  is_estimated: false,
  note: ''
})

const discountRange = ref({
  min_percent: 0,
  max_percent: 0,
  confidence: 'medium',
  source: ''
})

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const loadOffers = async () => {
  if (!buildStore.selectedBuildId) return

  loading.value = true
  const { data } = await offersService.fetchOffersForBuild($supabase, buildStore.selectedBuildId)
  if (data) {
    offers.value = data
  }
  loading.value = false
}

const loadPartItems = async () => {
  if (!buildStore.selectedBuildId) return

  const { data } = await itemsService.fetchItemsForBuild($supabase, buildStore.selectedBuildId)
  if (data) {
    partItems.value = data
  }
}

const handleAddOffer = async () => {
  submitting.value = true

  const discount = includeDiscount.value ? discountRange.value : undefined

  await offersService.createOffer($supabase, newOffer.value, discount)

  submitting.value = false
  showAddModal.value = false

  newOffer.value = {
    part_item_id: '',
    vendor_name: '',
    kind: '',
    url: '',
    base_price: 0,
    in_stock: true,
    is_estimated: false,
    note: ''
  }

  discountRange.value = {
    min_percent: 0,
    max_percent: 0,
    confidence: 'medium',
    source: ''
  }

  includeDiscount.value = false

  await loadOffers()
}

const setPrimary = async (offerId: string, partItemId: string) => {
  await offersService.setPrimaryOffer($supabase, offerId, partItemId)
  await loadOffers()
}

watch(() => buildStore.selectedBuildId, () => {
  loadOffers()
  loadPartItems()
})

watch(showAddModal, (value) => {
  if (value) {
    loadPartItems()
  }
})

onMounted(() => {
  loadOffers()
})
</script>
