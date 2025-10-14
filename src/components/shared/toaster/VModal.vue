<template>
  <teleport
    v-if="isOpened"
    to="body"
  >
    <div class="absolute flex items-center justify-center top-0 bottom-0 left-0 right-0 bg-black/70 p-10">
      <div class="p-4 bg-white/95">
        <CloseIcon
          v-if="!hideClose"
          class="mb-3 ml-auto cursor-pointer"
          style="width: 24px; height: 24px;}"
          @click="close"
        />
        <h5
          v-if="title"
          class="mb-4 text-center text-xl font-medium"
        >
          {{ title }}
        </h5>
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script setup>
import CloseIcon from '@/components/icons/CloseIcon.vue'
import { ref } from 'vue'

defineProps({
  hideClose: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['onClose'])

defineExpose({ show })

const isOpened = ref(false)

function show() {
  isOpened.value = true
}

function close() {
  isOpened.value = false
  emit('onClose')
}

</script>
