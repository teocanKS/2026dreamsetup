<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        @click.self="close"
      >
        <div class="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto transform transition-all">
          <div class="flex items-center justify-between p-6 border-b border-slate-100/50">
            <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
            <button
              @click="close"
              class="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
