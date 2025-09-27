<template>
    <transition-group
        name="toast" tag="div"
        class="fixed z-10 top-[16px] right-[16px] pointer-events-none max-w-[320px]"
    >
      <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center justify-between pointer-events-auto mb-4 pl-5 pr-4 py-3 border shadow-sm rounded-xs"
          :class="{
            'bg-emerald-100 border-emerald-700': toast.type === 'success',
            'bg-red-100 border-red-700': toast.type === 'error',
          }"
      >
        <div class="text-lg text-gray-800">{{ toast.message }}</div>
        <button class="ml-2 cursor-pointer rounded-xs p-1 hover:bg-gray-900/20" @click="removeToast(toast.id)">
          <CloseIcon
              width="20px"
              height="20px"
              class="fill-red-900"
          />
        </button>
      </div>
    </transition-group>
</template>

<script setup>
import {toasts, removeToast} from './toast.js'
import CloseIcon from "@/components/icons/CloseIcon.vue"
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
