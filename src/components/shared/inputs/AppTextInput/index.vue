<template>
  <div class="relative">
    <input
      :id
      :ref="`input-${id}`"
      v-model="value"
      autocomplete="new-password"
      class="default-input"
      data-test="app-text-input"
      type="text"
      :class="{
        'border-gray-600': !isInvalid && !disabled,
        'border-gray-400 bg-gray-200 outline-none': disabled && !isInvalid,
        'border-red-700': isInvalid,
        'pr-[30px]': !hideCloseIcon && !disabled
      }"
      :disabled
      :placeholder="placeholder"
    >
    
    <AppBtn
      v-if="!hideCloseIcon && !disabled"
      not-bordered
      not-filling
      class="absolute w-[24px] h-[24px] top-[50%] right-[5px] translate-y-[-50%]"
      data-test="app-text-input__clear-btn"
      title="Очистить"
      @click="clear"
    >
      <CloseIcon />
    </AppBtn>
  </div>
</template>

<script setup>
import CloseIcon from '@/components/icons/CloseIcon.vue'
import { computed, useTemplateRef } from 'vue'
import { getRandomUid } from '@/helpers/index.js'

const {
  modelValue,
  disabled,
  id,
} = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, default: () => getRandomUid() },
  placeholder: { type: String, default: 'Введите значение' },
  disabled: { type: Boolean, default: false },
  hideCloseIcon: { type: Boolean, default: false },
  isInvalid: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:modelValue',
])

// установка значения
const value = computed({
  get: () => modelValue,
  set: (newValue) => {
    if (!disabled) emit('update:modelValue', newValue)
  },
})

const inputRef = useTemplateRef(`input-${id}`)
function clear () {
  value.value = ''
  inputRef.value.focus()
}
</script>