<template>
  <div class="animate-fade-in">
    <div v-if="error" class="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200">
      <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle class="w-8 h-8 text-slate-400" />
      </div>
      <h3 class="text-xl font-semibold text-slate-900 mb-2">Veri Yüklenemedi</h3>
      <p class="text-slate-600 max-w-md mx-auto">
        Veritabanı bağlantısı kurul

amadı. Supabase ayarlarını kontrol edin.
      </p>
    </div>

    <div v-else-if="loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      <p class="text-slate-600 mt-4">Yükleniyor...</p>
    </div>

    <div v-else-if="builds.length === 0" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-16 text-center border border-blue-100 animate-slide-up">
      <div class="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
        <Package class="w-10 h-10 text-blue-600" />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 mb-3">Henüz Kurulum Yok</h3>
      <p class="text-slate-600 mb-8 max-w-md mx-auto">İlk kurulumunuzu oluşturun ve parça takibine başlayın</p>
      <button
        @click="createDefaultBuild"
        :disabled="creating"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 inline-flex items-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
      >
        <Plus class="w-5 h-5" />
        {{ creating ? 'Oluşturuluyor...' : '2026 Setup Kurulumu Oluştur' }}
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(build, index) in builds"
        :key="build.build_id"
        class="bg-white rounded-2xl shadow-sm p-7 hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 transform animate-slide-up cursor-pointer group"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="flex items-start justify-between mb-5">
          <div>
            <h3 class="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{{ build.name }}</h3>
            <p class="text-sm text-slate-500 mt-1.5">Bütçe: {{ formatCurrency(build.budget || 0) }}</p>
          </div>
          <div
            :class="[
              'w-14 h-14 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110',
              build.spent_pct >= 90 ? 'bg-red-50' : build.spent_pct >= 70 ? 'bg-amber-50' : 'bg-emerald-50'
            ]"
          >
            <TrendingUp
              :class="[
                'w-7 h-7',
                build.spent_pct >= 90 ? 'text-red-600' : build.spent_pct >= 70 ? 'text-amber-600' : 'text-emerald-600'
              ]"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-slate-600 font-medium">Harcanan</span>
              <span class="font-bold text-slate-900">{{ formatCurrency(build.spent || 0) }}</span>
            </div>
            <div class="flex justify-between text-sm mb-3">
              <span class="text-slate-600 font-medium">Kalan</span>
              <span class="font-bold text-slate-900">{{ formatCurrency(build.remaining || 0) }}</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                :class="[
                  'h-2.5 rounded-full transition-all duration-700 ease-out',
                  build.spent_pct >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                  build.spent_pct >= 70 ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 
                  'bg-gradient-to-r from-emerald-500 to-emerald-600'
                ]"
                :style="{ width: `${Math.min(build.spent_pct || 0, 100)}%` }"
              ></div>
            </div>
            <p class="text-xs text-slate-500 mt-2 font-medium">{{ (build.spent_pct || 0).toFixed(1) }}% kullanıldı</p>
          </div>

          <div class="pt-4 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 font-medium">Parçalar</span>
              <span class="font-bold text-slate-900 text-lg">{{ build.items_bought || 0 }} / {{ build.items_total || 0 }}</span>
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
const buildStore = useBuildStore()
const builds = ref<any[]>([])
const loading = ref(true)
const creating = ref(false)
const error = ref(false)

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('tr-TR')} ₺`
}

const loadBuilds = async () => {
  loading.value = true
  error.value = false
  try {
    const { data, error: fetchError } = await buildsService.fetchBuilds($supabase)
    if (fetchError) {
      console.error('Build fetch error:', fetchError)
      error.value = true
    } else if (data) {
      builds.value = data
      if (data.length > 0 && !buildStore.selectedBuildId) {
        buildStore.selectBuild(data[0].build_id)
      }
    }
  } catch (e) {
    console.error('Build load exception:', e)
    error.value = true
  }
  loading.value = false
}

const createDefaultBuild = async () => {
  creating.value = true
  try {
    const { data, error: createError } = await buildsService.createBuild(
      $supabase,
      '2026 Setup',
      0
    )

    if (createError) {
      console.error('Build creation error:', createError)
    } else if (data) {
      await loadBuilds()
    }
  } catch (e) {
    console.error('Build creation exception:', e)
  }
  creating.value = false
}

onMounted(() => {
  loadBuilds()
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  animation-fill-mode: both;
}
</style>
