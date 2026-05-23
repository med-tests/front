<script setup>
import {ref, watch} from 'vue'
import VueSelect from 'vue3-select-component'

const {
  modelValue,
  options,
} = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  options: {
    type: Array,
    default: () => ([]),
    validator(value) {
      return value.every(v => Object.hasOwn(v, 'value') && Object.hasOwn(v, 'label'))
    },
  },
  placeholder: { type: String, default: 'Выберите значение' },
  disabled: { type: Boolean, default: false },
})

const selected = ref('')

watch(
    () => modelValue,
    (newVal) => {
      selected.value = newVal.value
    },
    {
      immediate: true,
    },
)

const emit = defineEmits(['update:modelValue'])

watch(
    selected,
    (newVal) => {
      const data = {
        value: newVal || '',
        title: options.find(({ value }) => value === newVal)?.label || '',
      }

      emit('update:modelValue', data)
    },
)

</script>

<template>
  <VueSelect
    v-model="selected"
    class="custom-select"
    :classes="{
      control: 'text-gray-700 text-base',
      valueContainer: 'p-2',
    }"
    :is-disabled="disabled"
    :options="options"
    :placeholder
  >
    <template #no-options>
      Ничего не найдено
    </template>
  </VueSelect>
</template>

<style>
.custom-select {
  --vs-menu-offset-top: -4px;
  --vs-background-color: transparent;
  --vs-outline-color:  var(--color-emerald-800);
  --vs-option-focused-background-color: #d9f0e8;
  --vs-option-selected-background-color: rgba(121, 207, 184, 0.85);
  --vs-min-height: 42px;
  --vs-indicator-icon-size: 26px;
  --vs-indicator-icon-color: var(--color-gray-600);
  --vs-border-radius: var(--radius-xs);
  --vs-border : 1px solid var(--color-gray-600);
}

.custom-select .indicators-container:hover .clear-button {
  color: var(--color-gray-900) !important;
}

</style>
