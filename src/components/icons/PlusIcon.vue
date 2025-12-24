<template>
  <svg
      fill="inherit"
      :height="width"
      :width="width"
  >
    <rect
        :x="horizontal.x"
        :y="horizontal.y"
        :width="horizontal.width"
        :height="horizontal.height"
    />

    <rect
        :x="vertical.x"
        :y="vertical.y"
        :width="vertical.width"
        :height="vertical.height"
    />
  </svg>
</template>

<script setup>
import { computed, reactive } from 'vue'

const props = defineProps({
  width: { type: [Number, String], default: 24 },
  lineWidth: { type: Number, default: 2 },
})

const computedLineWidth = computed(() => {
  let lw = props.lineWidth
  if (Math.round(props.width / 10) > 2) {
    lw = Math.round(props.width / 10)
  }
  return lw
})


const vertical = reactive({
  x: Math.round(props.width / 2) - Math.round(computedLineWidth.value / 2),
  y: 0,
  width: computedLineWidth.value,
  height: props.width,
})


const horizontal = reactive({
  x: 0,
  y: Math.round(props.width / 2) - Math.round(computedLineWidth.value / 2),
  width: props.width,
  height: computedLineWidth.value,
})
</script>
