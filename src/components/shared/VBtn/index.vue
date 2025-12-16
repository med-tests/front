<template>
  <div
    :id="randomUid"
    class="inline-block rounded-xs select-none text-lg btn"
    :class="computedStyles"
    @click.stop.capture="!disabled && $emit('click')"
  >
    <slot />
    <ToolTip
      v-if="title"
      :append-element-id="randomUid"
      :text="title"
    />
  </div>
</template>

<script setup>
import { getRandomUid } from '@/helpers/index.js'
import { computed } from 'vue'

const props = defineProps({
  notBordered: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  notFilling: { type: Boolean, default: false }, // заливка фона кнопки
  title: { type: String, default: '' },
  type: {type: String, default: 'default'}, // success, error, default
})

defineEmits(['click'])

const randomUid = getRandomUid()

const computedStyles = computed(() => {
  const { type, disabled } = props
  const bordered = !props.notBordered
  const filling = !props.notFilling

  const obj = {
    // font-color
    'text-gray-700': !disabled && (type === 'default' || (['success', 'error'].includes(type) && !filling)),
    'text-white': !disabled && ['success', 'error'].includes(type) && filling,
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
    'border p-1 border-gray-700': bordered && type === 'default',
    'border p-1 border-emerald-700': bordered && type === 'success',
    'border p-1 border-red-700': bordered && type === 'error',

    // filling (background-color)
    'bg-white hover:bg-black/5': type === 'default' && filling && !disabled,
    'bg-black/10 hover:bg-black/10': type === 'default' && filling && disabled,
    'bg-emerald-700 hover:bg-emerald-600': type === 'success' && filling && !disabled,
    'hover:bg-emerald-500 bg-emerald-500': type === 'success' && filling && disabled,
    'bg-red-600 hover:bg-red-500': type === 'error' && filling && !disabled,
    'bg-red-400 hover:bg-red-400': type === 'error' && filling && disabled,
  }
  const res = []
  disabled ? res.push('cursor-not-allowed') : res.push('cursor-pointer')

  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      res.push(key)
    }
  })

  return res
})
</script>
