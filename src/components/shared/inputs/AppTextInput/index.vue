<template>
  <div class="relative">
    <input
      :id
      ref="input"
      v-model="value"
      autocomplete="new-password"
      class="default-input"
      data-test="app-text-input"
      type="text"
      :class="{
        [defaultBorderClass]: !isInvalid && !disabled,
        [`${disabledBorderClass} ${disabledBgClass} outline-none`]: disabled && !isInvalid,
        [invalidBorderClass]: isInvalid,
        [clearBtnOffsetClass]: !hideCloseIcon && !disabled
      }"
      :disabled
      :placeholder="placeholder"
    >
    
    <AppBtn
      v-if="!hideCloseIcon && !disabled"
      not-bordered
      not-filling
      class="app-input__clear-btn"
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
import { input as inputClasses } from '@/assets/vars.js'

const {
  defaultBorderClass,
  invalidBorderClass,
  disabledBorderClass,
  disabledBgClass,
  clearBtnOffsetClass,
} = inputClasses
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

const inputRef = useTemplateRef('input')

// установка значения
const value = computed({
  get: () => modelValue,
  set: (newValue) => {
    if (disabled) {
      inputRef.value.value = modelValue
      return
    }
    emit('update:modelValue', newValue)
  },
})

// очистка ввода
function clear () {
  emit('update:modelValue', '')
  inputRef.value.focus()
}
</script>