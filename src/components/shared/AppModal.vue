<template>
  <Teleport
    v-if="isOpened"
    to="body"
  >
    <div class="absolute flex items-center justify-center top-0 bottom-0 left-0 right-0 bg-black/70 p-10">
      <div 
        class="p-5 bg-white/95 rounded-sm max-h-full flex flex-col"
        :class="{
          'max-w-[850px] w-full h-full': cardMode
        }"
      >
        <!--  header  -->
        <div class="w-full">
          <CloseIcon
            v-if="!hideClose"
            class="ml-auto cursor-pointer fill-gray-600 hover:fill-gray-900"
            style="width: 24px; height: 24px;}"
            @click="close"
          />
          <h5
            v-if="title"
            class="mb-3 text-center text-xl font-medium text-gray-700"
          >
            {{ title }}
          </h5>
        </div>

        
        <!--  content  -->
        <div class="grow overflow-y-auto">
          <slot />
        </div>

        <!--  footer  -->
        <slot name="footer">
          <div class="pt-3 mt-auto flex justify-end flex-row gap-x-4">
            <AppBtn
              v-if="!hideCancel"
              :is-loading="isLoading"
              @click="close"
            >
              <div class="px-2">
                {{ cancelText }}
              </div>
            </AppBtn>

            <AppBtn
              v-if="!hideOk"
              type="success"
              :is-loading="isLoading"
              @click="emit('ok')"
            >
              <div class="px-2">
                {{ okText }}
              </div>
            </AppBtn>
          </div>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import CloseIcon from '@/components/icons/CloseIcon'
import { ref } from 'vue'

const { isLoading } = defineProps({
  hideClose: {
    type: Boolean,
    default: false,
  },
  hideCancel: {
    type: Boolean,
    default: false,
  },
  hideOk: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  okText: {
    type: String,
    default: 'Сохранить',
  },
  cancelText: {
    type: String,
    default: 'Отменить',
  },
  cardMode: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['onClose', 'ok'])

defineExpose({ show, close })

const isOpened = ref(false)

function show() {
  isOpened.value = true
}

function close() {
  if (isLoading) {
    return
  }
  isOpened.value = false
  emit('onClose')
}

</script>
