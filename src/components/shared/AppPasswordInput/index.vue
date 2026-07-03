<script setup>
import AppInput from '@/components/shared/AppInput'
import {computed } from 'vue'
import {showToast} from '@/components/shared/AppToaster/toast.js'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import CheckIcon from '@/components/icons/CheckIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const {
  id,
  touchId,
} = defineProps({
  id: { type: String, required: true },
  touchId: { type: String, required: true },
})

const password = defineModel({
  required: true,
  type: Object,
})

function validatePassword () {
  const invalid = computedConditions.value.filter(({isValid}) => !isValid)
  invalid.forEach(condition => {
    showToast(condition.errorMessage, {type: 'error'})
  })
  return invalid.length === 0
}

const computedConditions = computed(() => {
  const passwordValue = password.value.value
  return [
    {
      label: 'Не менее 8 символов',
      isValid: passwordValue.length > 8,
      errorMessage: 'Не менее 8 символов в пароле',
    },
    {
      label: 'Xотя бы одно число',
      isValid: /(?=.*[0-9])/g.test(passwordValue),
      errorMessage: 'В пароле должно быть хотя бы одно число',
    },
    {
      label: 'Xотя бы один спецсимвол',
      isValid: /(?=.*[!"№;%:?*()=@#$^&></|~+_\\,])/g.test(passwordValue),
      errorMessage: 'В пароле должен быть хотя бы один спецсимвол',
    },
    {
      label: 'Xотя бы одна латинская буква в нижнем регистре',
      isValid: /(?=.*[a-z])/g.test(passwordValue),
      errorMessage: 'В пароле должна быть хоть одна латинская буква в нижнем регистре',
    },
    {
      label: 'Xотя бы одна латинская буква в верхнем регистре',
      isValid: /(?=.*[A-Z])/g.test(passwordValue),
      errorMessage: 'В пароле должна быть хоть одна латинская буква в верхнем регистре',
    },
  ]
})
</script>

<template>
  <AppInput
    :id="id"
    v-model="password.value"
    required
    label="Пароль"
    type="password"
    :callback-validator="validatePassword"
    :touch-id="touchId"
    @on-validate="password.error = $event"
  >
    <template #description>
      <div class="mb-1">
        <div
          v-for="(condition, index) in computedConditions"
          :key="index"
        >
          <div class="flex items-center mb-1">
            <CloseIcon
              v-if="!condition.isValid"
              class="fill-red-800"
              width="16"
            />
            <CheckIcon
              v-else
              class="stroke-emerald-800"
              width="18"
            />
            <div class="text-sm ml-1">
              {{ condition.label }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppInput>
</template>
