<template>
  <TransitionGroup
    class="fixed z-10 top-[16px] right-[16px] pointer-events-none max-w-[320px]"
    name="toast"
    tag="div"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="flex items-center justify-between pointer-events-auto mb-4 pl-4 pr-6 py-7 border shadow-sm rounded-xs relative"
      :class="{
        'bg-emerald-100 border-emerald-700': toast.type === 'success',
        'bg-red-100 border-red-700': toast.type === 'error',
      }"
    >
      <VBtn
        not-bordered
        not-filling
        class="ml-2 absolute"
        style="top: 4px; right: 5px;"
        type="error"
        @click="removeToast(toast.id)"
      >
        <CloseIcon
          class="fill-gray-600 hover:fill-gray-900"
          height="20px"
          width="20px"
        />
      </VBtn>

      <div
        class="text-lg font-medium"
        :class="{
          'text-red-950': toast.type === 'error',
          'text-emerald-950': toast.type === 'success',
        }"
      >
        {{ toast.message }}
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup>
import {toasts, removeToast} from './toast.js'
import CloseIcon from '@/components/icons/CloseIcon.vue'
</script>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 180ms ease;
}
</style>
