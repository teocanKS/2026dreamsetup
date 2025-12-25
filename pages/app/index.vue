<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
      <p class="text-gray-600 mt-1">Overview of your PC builds</p>
    </div>

    <div v-if="!authStore.hasSession && authStore.initialized" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Session Required</h3>
      <p class="text-gray-600 max-w-md mx-auto mb-2">
        This app has no login UI. Create a Supabase session once (magic link sign-in) and refresh.
      </p>
      <p class="text-sm text-gray-500">See /auth for details</p>
    </div>

    <div v-else-if="error" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Access Not Configured</h3>
      <p class="text-gray-600 max-w-md mx-auto">
        Database access is not authorized. Configure Row Level Security policies to access build data.
      </p>
    </div>

    <div v-else-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
    </div>

    <div v-else-if="builds.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Builds Yet</h3>
      <p class="text-gray-600 mb-6">Create your first build to get started</p>
      <button
        @click="createDefaultBuild"
        :disabled="creating"
        class="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition inline-flex items-center gap-2 disabled:opacity-50"
      >
        <Plus class="w-5 h-5" />
        {{ creating ? 'Creating...' : 'Create "2026 Setup" Build' }}
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="build in builds"
        :key="build.build_id"
        class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ build.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">Budget: ${{ build.budget?.toFixed(2) || '0.00' }}</p>
          </div>
          <div
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center',
              build.spent_pct >= 90 ? 'bg-red-100' : build.spent_pct >= 70 ? 'bg-yellow-100' : 'bg-green-100'
            ]"
          >
            <TrendingUp
              :class="[
                'w-6 h-6',
                build.spent_pct >= 90 ? 'text-red-600' : build.spent_pct >= 70 ? 'text-yellow-600' : 'text-green-600'
              ]"
            />
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">Spent</span>
              <span class="font-medium text-gray-900">${{ build.spent?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">Remaining</span>
              <span class="font-medium text-gray-900">${{ build.remaining?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="[
                  'h-2 rounded-full transition-all',
                  build.spent_pct >= 90 ? 'bg-red-600' : build.spent_pct >= 70 ? 'bg-yellow-600' : 'bg-green-600'
                ]"
                :style="{ width: `${Math.min(build.spent_pct || 0, 100)}%` }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ build.spent_pct?.toFixed(1) || '0.0' }}% spent</p>
          </div>

          <div class="pt-3 border-t border-gray-200">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Items</span>
              <span class="font-medium text-gray-900">{{ build.items_bought || 0 }} / {{ build.items_total || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package, Plus, TrendingUp, AlertCircle } from 'lucide-vue-next'
import { buildsService } from '~/services/builds'

const { $supabase } = useNuxtApp()
const authStore = useAuthStore()
const buildStore = useBuildStore()
const builds = ref<any[]>([])
const loading = ref(true)
const creating = ref(false)
const error = ref(false)

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const loadBuilds = async () => {
  if (!authStore.hasSession) {
    loading.value = false
    return
  }

  loading.value = true
  error.value = false
  try {
    const { data, error: fetchError } = await buildsService.fetchBuilds($supabase)
    if (fetchError) {
      error.value = true
    } else if (data) {
      builds.value = data
      if (data.length > 0 && !buildStore.selectedBuildId) {
        buildStore.selectBuild(data[0].build_id)
      }
    }
  } catch (e) {
    error.value = true
  }
  loading.value = false
}

const createDefaultBuild = async () => {
  creating.value = true
  try {
    const userId = authStore.user?.id || ''
    const { data } = await buildsService.createBuild(
      $supabase,
      '2026 Setup',
      0,
      userId
    )

    if (data) {
      await loadBuilds()
    }
  } catch (e) {
    error.value = true
  }
  creating.value = false
}

onMounted(async () => {
  await authStore.initialize()
  await loadBuilds()
})
</script>
