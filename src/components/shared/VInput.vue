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
    <div class="relative">
      <input
        :id
        class="border rounded-xs p-2 text-gray-700 text-base w-full outline-emerald-800"
        :class="{
          'border-gray-400 bg-gray-200 outline-none': disabled && !(isInvalid || isInvalidCalendar),
          'border-red-700': (isInvalid || isInvalidCalendar) && !disabled,
          'border-gray-600': !isInvalid && !isInvalidCalendar && !disabled,
        }"
        :disabled
        :name="id"
        :placeholder
        :readonly
        :style="[type === 'password' || !hideCloseIcon ? 'padding-right: 30px;' : '']"
        :type="computedType"
        :value
        @input="setValue($event.target.value)"
      >

      <VBtn
        v-if="type === 'password'"
        not-bordered
        not-filling
        class="absolute"
        style="width: 24px; height: 24px; top: 50%; transform: translate(0, -50%); right: 5px;}"
        :title="passwordHidden ? 'Показать' : 'Скрыть'"
        @click="passwordHidden = !passwordHidden"
      >
        <EyeIcon v-if="passwordHidden" />
        <EyeClosedIcon v-else />
      </VBtn>

      <VBtn
        v-if="type !== 'password' && !hideCloseIcon"
        not-bordered
        not-filling
        class="absolute"
        style="width: 24px; height: 24px; top: 50%; transform: translate(0, -50%); right: 5px;}"
        :disabled
        :title="disabled ? '' : clearTitle"
        @click="$emit('onClickCloseIcon')"
      >
        <CloseIcon />
      </VBtn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import {useValidateInput} from '@/composables/useValidateInput.js'

const {
  modelValue,
  label,
  id,
  placeholder,
  readonly,
  type,
  hideCloseIcon,
  required,
  touchId,
  callbackValidator,
  isInvalidCalendar,
  disabled,
} = defineProps({
  modelValue: { type: [String, Number], default: ''},
  label: { type: String, default: '' },
  id: { type: String, required: true },
  placeholder: { type: String, default: 'Введите значение' },
  readonly: { type: Boolean, default: false },
  type: { type: String, default: 'text' }, // text, password, number
  hideCloseIcon: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  touchId: { type: String, default: '' },
  // должна возвращать true, если ввод валиден и false - если нет
  // может иметь сайд-эффекты типа вызовы тостера с текстом ошибки
  callbackValidator: { type: Function, default: () => true },
  // только для календаря. Инпут используется только на вывод. Ввод контролирует библиотека
  isInvalidCalendar: { type: Boolean, default: false},
  disabled: { type: Boolean, default: false },
  clearTitle: { type: String, default: 'Очистить' },
})

const emit = defineEmits([
  'update:modelValue',
  'onClickCloseIcon',
  'onValidate',
])

const passwordHidden = ref(true)

const computedType = computed(() => {
  if (type === 'password') {
    return passwordHidden.value ? 'password' : 'text'
  }
  return type
})

const value = ref('')
const setValue = (newValue) => {
  if (disabled) {
    return
  }
  value.value = type === 'number' && newValue ? Number(newValue) : newValue
  emit('update:modelValue', value.value)
}
watch(
  () => modelValue,
  (newVal) => {
    setValue(newVal)
  },
  {
    immediate: true,
  },
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
      emit('onValidate', isInvalid.value)
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

<style scoped>
/* Скрытие стрелок для всех браузеров */
input[type=number] {
  -moz-appearance: textfield;
  appearance: none;
}

/* Скрытие стрелок для Webkit-браузеров */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  display: none;
}
.required::after {
  content: '*';
  color: red;
}
</style>
