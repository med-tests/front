<template>
  <div class="relative">
    <input
      :id
      v-model="value"
      class="default-input"
      data-test="app-password-input"
      :autocomplete
      :class="{
        [defaultBorderClass]: !isInvalid && !disabled,
        [`${disabledBorderClass} ${disabledBgClass} outline-none`]: disabled && !isInvalid,
        [invalidBorderClass]: isInvalid,
        [clearBtnOffsetClass]: !disabled
      }"
      :disabled
      :placeholder="placeholder"
      :type="passwordStarred ? 'password' : 'text'"
    >

    <AppBtn
      not-bordered
      not-filling
      class="absolute w-[24px] h-[24px] top-[50%] right-[5px]"
      data-test="app-password-input__toggle-star"
      style="transform: translate(0, -50%);"
      :title="passwordStarred ? 'Показать' : 'Скрыть'"
      @click="passwordStarred = !passwordStarred"
    >
      <EyeIcon 
        v-if="passwordStarred"
        data-test="app-password-input__eye"
      />
      <EyeClosedIcon 
        v-else
        data-test="app-password-input__closed-eye"
      />
    </AppBtn>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getRandomUid } from '@/helpers/index.js'
import { input as inputClasses } from '@/assets/vars.js'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'

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
  autocomplete,
} = defineProps({
  autocomplete: {
    type: String,
    default: 'current-password',
    validator(value) {
      return ['current-password', 'off', 'new-password'].includes(value)
    },
  },
  modelValue: { type: String, default: '' },
  id: { type: String, default: () => getRandomUid() },
  placeholder: { type: String, default: 'Введите пароль' },
  disabled: { type: Boolean, default: false },
  isInvalid: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:modelValue',
])

// установка значения
const value = computed({
  get: () => modelValue,
  set: (newValue) => {
    if (disabled) {
      return
    }
    emit('update:modelValue', newValue)
  },
})

const passwordStarred = ref(true)
</script>

<script>
export default {
  name: 'AppPasswordInput',
}
</script>