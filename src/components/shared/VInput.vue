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
    <div class="relative">
      <input
        :id="id"
        class="border rounded-xs p-2 text-gray-700 text-base w-full"
        :class="[isInvalid ? 'border-red-700' : 'border-gray-700']"
        :name="id"
        :placeholder="placeholder"
        :readonly="readonly"
        :type="computedType"
        :value="value"
        @input="setValue($event.target.value)"
      >

      <v-btn
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
      </v-btn>

      <v-btn
        v-if="type !== 'password' && !hideCloseIcon"
        not-bordered
        not-filling
        class="absolute"
        style="width: 24px; height: 24px; top: 50%; transform: translate(0, -50%); right: 5px;}"
        title="Очистить"
        @click="$emit('onClickCloseIcon')"
      >
        <CloseIcon />
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import { showToast } from '@/components/shared/toaster/toast.js'

const props = defineProps({
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
})

const emit = defineEmits(['update:modelValue', 'onClickCloseIcon', 'onValidate'])

const passwordHidden = ref(true)

const computedType = computed(() => {
  if (props.type === 'password') {
    return passwordHidden.value ? 'password' : 'text'
  }
  return props.type
})

const value = ref('')
const setValue = (newValue) => {
  value.value = newValue
  emit('update:modelValue', props.type === 'number' ? Number(newValue) : newValue)
}

const isInvalid = ref(false)

watch(
  () => props.touchId,
  () => {
    if (props.required && (!value.value && value.value !== 0)) {
      isInvalid.value = true
      showToast('Заполните обязательные поля', {type: 'error'})
      emit('onValidate', false)
      return
    }

    const isCustomValid = props.callbackValidator(value.value)
    if (!isCustomValid) {
      isInvalid.value = true
      emit('onValidate', false)
    }

    emit('onValidate', true)
  },
)

watch(
  value,
  () => {
    if (isInvalid.value) {
      isInvalid.value = false
    }
  },
)

watch(
  () => props.modelValue,
  (newVal) => {
    value.value = newVal
  },
  {
    immediate: true,
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
