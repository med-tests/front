<template>
  <div>
    <label
      v-if="label"
      class="block mb-1 text-gray-700"
      :class="{'required': required }"
      :for="id"
    >
      {{ label }}
    </label>
    <slot name="description" />
    <AppCalendarInput
      v-if="type === 'calendar'"
      :id
      :colored-dates
      :disabled
      :hide-close-icon
      :is-invalid
      :max-date
      :min-date
      :model-value="value"
      :on-before-select
      @clear="emit('clear')"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <AppTextInput
      v-else-if="type === 'text'"
      :id
      :autocomplete
      :disabled
      :hide-close-icon
      :is-invalid
      :model-value="value"
      :placeholder
      @update:model-value="emit('update:modelValue', $event)"
    />
    <AppNumberInput
      v-else-if="type === 'number'"
      :id
      :disabled
      :hide-close-icon
      :is-invalid
      :model-value="value"
      :placeholder
      @update:model-value="emit('update:modelValue', $event)"
    />
    <AppPasswordInput
      v-else-if="type === 'password'"
      :id
      :autocomplete
      :disabled
      :is-invalid
      :model-value="value"
      :placeholder
      @update:model-value="emit('update:modelValue', $event)"
    />
    <AppSelect 
      v-else-if="type === 'select'"
      :disabled
      :input-settings="{ placeholder }"
      :is-allow-empty
      :is-invalid
      :is-search
      :list="selectList"
      :model-value="value"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import { getRandomUid } from '@/helpers/index.js'
import AppCalendarInput from '@/components/shared/inputs/AppCalendarInput'
import AppTextInput from '@/components/shared/inputs/AppTextInput'
import AppSelect from '@/components/shared/AppSelect'
import AppNumberInput from '@/components/shared/inputs/AppNumberInput'
import AppPasswordInput from '@/components/shared/inputs/AppPasswordInput'
import { ref, watch } from 'vue'
import { useValidateInput } from '@/composables/useValidateInput.js'

const {
  id,
  modelValue,
  required,
  touchId,
  callbackValidator,
} = defineProps({
  id: { type: String, default: () => getRandomUid() },
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  type: {
    type:String,
    required: true,
    validator(value) {
      return ['text', 'number', 'password', 'calendar', 'select'].includes(value)
    },
  },
  touchId: { type: String, default: '' },
  // должна возвращать true, если ввод валиден и false - если нет
  // может иметь сайд-эффекты типа вызовы тостера с текстом ошибки
  callbackValidator: { type: Function, default: () => true },

  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: 'Введите значение' },
  disabled: { type: Boolean, default: false },
  hideCloseIcon: { type: Boolean, default: false },
  // для текстового и пароля
  autocomplete: { type: String, default: 'off' },
  // для календаря
  minDate: {
    type: [String, null],
    default: null,
    validator(value) {
      const isNull = value === null
      const isEmpty = value === ''
      const isFormattedString = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)
      return isEmpty || isNull || isFormattedString
    },
  },
  maxDate: {
    type: [String, null],
    default: null,
    validator(value) {
      const isNull = value === null
      const isEmpty = value === ''
      const isFormattedString = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)
      return isEmpty || isNull || isFormattedString
    },
  },
  coloredDates: {
    type: Array,
    default: () => ([]),
    validator(value) {
      return value
          .every(str => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(str))
    },
  },
  onBeforeSelect: { type: [Function, null], default: null },
  
  // для селекта
  selectList: {
    type: Array,
    default: () => ([]),
  },
  isSearch: { type: Boolean, default: false },
  isAllowEmpty: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:modelValue',
  'onValidate',
  'clear',
])

const value = ref('')

watch(
    () => modelValue,
    (newVal) => value.value = newVal,
    { immediate: true },
)

const { isInvalid, validate, setIsInvalidTo } = useValidateInput()

watch(
    () => touchId,
    () => {
      validate({
        value: value.value,
        required,
        callbackValidator,
      })
    },
)

watch(
    isInvalid,
    () => {
      emit('onValidate', !isInvalid.value)
    },
)

watch(
    value,
    () => {
      if (isInvalid.value) {
        setIsInvalidTo(false)
      }
    },
)
</script>

<style>
.required::after {
  content: '*';
  color: red;
}
</style>