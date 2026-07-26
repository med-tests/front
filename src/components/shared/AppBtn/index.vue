<template>
  <div
    :id="randomUid"
    :ref="`ref-${randomUid}`"
    class="inline-block rounded-xs select-none text-lg"
    :class="computedStyles"
    @click="click"
  >
    <template v-if="!isLoading">
      <!--  Ответственность за отступы лежит на слоте!  -->
      <slot />
      <ToolTip
        v-if="title"
        :append-element-id="randomUid"
        :text="title"
      />
    </template>

    <div
      v-if="isLoading"
      class="relative"
      data-test="loading-wrapper"
      :style="{
        'height': `${btnHeight}px`,
        'width': `${btnWidth}px`
      }"
    >
      <div
        class="absolute v-btn-loading"
        data-test="spinner"
        :class="{
          'text-white': !notFilling && (type === 'error' || type === 'success'),
          'text-gray-700': type === 'default',
          'text-red-500':type === 'error' && notFilling,
          'text-emerald-700': type === 'success' && notFilling,
        }"
        :style="{
          'width': btnHeight / 2 + 'px',
          'height': btnHeight / 2 + 'px'
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { getRandomUid } from '@/helpers/index.js'
import { computed, onMounted, ref, useTemplateRef } from 'vue'

const props = defineProps({
  notBordered: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  notFilling: { type: Boolean, default: false }, // заливка фона кнопки
  title: { type: String, default: '' },
  type: { type: String, default: 'default' }, // success, error, default
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

function click (event) {
  if (props.disabled || props.isLoading) {
    event.stopPropagation()
    return
  }
  emit('click')
}

const computedStyles = computed(() => {
  const { type, disabled, notBordered, notFilling, isLoading } = props

  const isDefault = type === 'default'
  const isSuccess = type === 'success'
  const isError = type === 'error'
  const isSuccessOrError = isSuccess || isError
  const isFilled = !notFilling
  const isBordered = !notBordered

  // Правила: [условие, класс]
  const rules = [
    // Цвет текста
    [!disabled && (isDefault || (isError && !isFilled)), 'text-gray-700 hover:text-gray-900'],
    [!disabled && isSuccessOrError && isFilled, 'text-white'],
    [!disabled && isSuccess && !isFilled, 'text-emerald-700 hover:text-emerald-800'],
    [disabled && !(isSuccessOrError && isFilled), 'text-gray-500'],
    [disabled && isSuccessOrError && isFilled, 'text-gray-200'],

    // Заливка SVG
    [!disabled && isDefault, 'fill-gray-600 hover:fill-gray-900'],
    [!disabled && isSuccess && !isFilled, 'fill-emerald-900 hover:fill-emerald-600'],
    [!disabled && isError && !isFilled, 'fill-red-900 hover:fill-red-600'],
    [isSuccessOrError && isFilled, 'fill-white hover:fill-white'],
    [disabled && (isDefault || (isSuccessOrError && !isFilled)), 'fill-gray-500 hover:fill-gray-500'],

    // Рамка (не зависит от filling/disabled)
    [isBordered && isDefault, 'border border-gray-400'],
    [isBordered && isSuccess, 'border border-emerald-700'],
    [isBordered && isError, 'border border-red-500'],
    [isBordered && !isLoading, 'p-1'],

    // Фон
    [isDefault && isFilled && !disabled, 'bg-white hover:bg-black/5'],
    [isDefault && isFilled && disabled, 'bg-black/10 hover:bg-black/10'],
    [isSuccess && isFilled && !disabled, 'bg-emerald-700 hover:bg-emerald-600'],
    [isSuccess && isFilled && disabled, 'hover:bg-emerald-500 bg-emerald-500'],
    [isError && isFilled && !disabled, 'bg-red-500 hover:bg-red-600'],
    [isError && isFilled && disabled, 'bg-red-400 hover:bg-red-400'],
  ]

  return [
    (!disabled && !isLoading) ? 'cursor-pointer' : 'cursor-not-allowed',
    ...rules
        .filter(([condition]) => condition)
        .map(([, className]) => className),
  ]
})

const randomUid = getRandomUid()
const btnWidth = ref(100)
const btnHeight = ref(25)
const elRef = useTemplateRef(`ref-${randomUid}`)
onMounted(() => {
  const elBounding = elRef.value.getBoundingClientRect()

  btnWidth.value = elBounding.width - (props.notBordered ? 0 : 2)
  btnHeight.value = elBounding.height - (props.notBordered ? 0 : 2)
})
</script>

<style>
.v-btn-loading{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-width: 2px;
    border-style: solid;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1.7s linear infinite;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>
