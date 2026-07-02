<template>
  <svg 
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    :height="width" 
    :width="width"
  >
    <path
      d="m5 13 5 5 9-11"
      stroke="inherit"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2.5"
    />
  </svg>
</template>

<script setup>
const { width } = defineProps({
  width: { type: [Number, String], default: 16 },
})
</script>