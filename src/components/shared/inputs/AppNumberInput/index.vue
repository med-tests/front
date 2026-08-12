<template>
  <div class="relative">
    <input
      :id
      ref="input"
      v-model="value"
      autocomplete="off"
      class="default-input"
      data-test="app-number-input"
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
      data-test="app-number-input__clear-btn"
      title="Очистить"
      @click="clear"
    >
      <CloseIcon />
    </AppBtn>
  </div>
</template>

<script setup>
import CloseIcon from '@/components/icons/CloseIcon'
import { getRandomUid } from '@/helpers'
import { computed, useTemplateRef } from 'vue'
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
  isInvalid,
} = defineProps({
  modelValue: {
    type: [Number, String],
    default: '',
    validator (value) {
        return typeof value === 'number' || value === '' || value === '-'
    },
  },
  id: { type: String, default: () => getRandomUid() },
  placeholder: { type: String, default: 'Введите число' },
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

    const isCorrectValue = /^$|^-$|^-?\d+(\.\d*)?$/.test(newValue) || newValue === '' ||  newValue === '-'

    if (isCorrectValue) {
      let val
      if (newValue === '' || newValue === '-') {
        val = newValue
      }
      else {
        val = parseFloat(newValue)
      }
      emit('update:modelValue', val)
    }
    else {
      inputRef.value.value = modelValue
    }
  },
})

// очистка ввода
function clear () {
  value.value = ''
  inputRef.value.focus()
}
</script>