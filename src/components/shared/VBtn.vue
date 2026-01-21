<template>
  <div
    :id="randomUid"
    class="inline-block rounded-xs select-none text-lg"
    :class="computedStyles"
    @click.stop.capture="(!disabled && !isLoading) && $emit('click')"
  >
    <template v-if="!isLoading">
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
      :style="{
        'height': `${btnHeight}px`,
        'width': `${btnWidth}px`
      }"
    >
      <div
        class="absolute v-btn-loading"
        :class="{
          'text-gray-700': (type === 'default' || (['error'].includes(type) && notFilling)),
          'text-white': ['success', 'error'].includes(type) && !notFilling,
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
import {computed, onMounted, ref} from 'vue'

const props = defineProps({
  notBordered: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  notFilling: { type: Boolean, default: false }, // заливка фона кнопки
  title: { type: String, default: '' },
  type: {type: String, default: 'default'}, // success, error, default
  isLoading: { type: Boolean, default: false },
})

defineEmits(['click'])

const randomUid = getRandomUid()

const computedStyles = computed(() => {
  const { type, disabled } = props
  const bordered = !props.notBordered
  const filling = !props.notFilling

  const obj = {
    // font-color
    'text-gray-700': !disabled && (type === 'default' || (['error'].includes(type) && !filling)),
    'text-white': !disabled && ['success', 'error'].includes(type) && filling,
    'text-emerald-700 hover:text-emerald-800': !disabled && type === 'success' && !filling,
    'text-gray-500': disabled,
    'text-gray-200': disabled && ['success', 'error'].includes(type) && filling,


    // fill (for svg)
    'fill-gray-600 hover:fill-gray-900': !disabled && type === 'default',
    'fill-emerald-900 hover:fill-emerald-600': !disabled && type === 'success' && !filling,
    'fill-red-900 hover:fill-red-600': !disabled && type === 'error' && !filling,
    'fill-white hover:fill-white':['success', 'error'].includes(type) && filling,
    'fill-gray-500 hover:fill-gray-500': disabled && (type === 'default' || (['success', 'error'].includes(type) && !filling)),
    // 'fill-emerald-900 hover:fill-emerald-900': disabled && type === 'success' && !filling,
    // 'fill-red-900 hover:fill-red-900': disabled && type === 'error' && !filling,

    // border and border-color (Не зависит от filling и disabled)
    'border border-gray-700': bordered && type === 'default',
    'border border-emerald-700': bordered && type === 'success',
    'border border-red-700': bordered && type === 'error',
    'p-1': bordered && !props.isLoading,

    // filling (background-color)
    'bg-white hover:bg-black/5': type === 'default' && filling && !disabled,
    'bg-black/10 hover:bg-black/10': type === 'default' && filling && disabled,
    'bg-emerald-700 hover:bg-emerald-600': type === 'success' && filling && !disabled,
    'hover:bg-emerald-500 bg-emerald-500': type === 'success' && filling && disabled,
    'bg-red-600 hover:bg-red-500': type === 'error' && filling && !disabled,
    'bg-red-400 hover:bg-red-400': type === 'error' && filling && disabled,
  }
  const res = []
  disabled || props.isLoading ? res.push('cursor-not-allowed') : res.push('cursor-pointer')

  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      res.push(key)
    }
  })

  return res
})

const btnWidth = ref(100)
const btnHeight = ref(25)
onMounted(() => {
  const elBounding = document.getElementById(randomUid).getBoundingClientRect()

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
