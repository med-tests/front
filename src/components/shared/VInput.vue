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
        class="border border-color-gray-700 rounded-xs p-2 text-gray-700 text-base w-full"
        :name="id"
        :placeholder="placeholder"
        :readonly="readonly"
        :type="computedType"
        :value="modelValue"
        @input="$emit('update:modelValue', type === 'number' ? Number($event.target.value) : $event.target.value)"
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
import {computed, ref} from 'vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: ''},
  label: { type: String, default: '' },
  id: { type: String, required: true },
  placeholder: { type: String, default: 'Введите значение' },
  readonly: { type: Boolean, default: false },
  type: { type: String, default: 'text' },
  hideCloseIcon: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'onClickCloseIcon'])

const passwordHidden = ref(true)

const computedType = computed(() => {
  if (props.type === 'password') {
    return passwordHidden.value ? 'password' : 'text'
  }
  return props.type
})
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
