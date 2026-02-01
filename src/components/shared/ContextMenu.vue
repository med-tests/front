<template>
  <div
    :id="randomId"
    class="relative"
  >
    <div
      class="flex"
      @click="opened = !opened"
    >
      <slot name="trigger" />
    </div>

    <div
      v-if="opened"
      v-click-outside="close"
      class="absolute z-1 bg-white border border-emerald-800 rounded mt-1"
    >
      <div
        v-for="(item, index) of arrItems"
        :key="index"
        class="py-1 px-4 hover:bg-emerald-600/15 cursor-pointer text-lg rounded whitespace-nowrap"
        @click="selectItem(item.event)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {getRandomUid} from '@/helpers'

const randomId = getRandomUid()

const vClickOutside = {
  mounted: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted: el => {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}

function close (event) {
  if (event.target.id === randomId || document.getElementById(randomId).contains(event.target)) {
    return
  }
  opened.value = false
}

defineProps({
  // { title: string, event: string }
  arrItems: { type: Array, default: () => ([]) },
})

const opened = ref(false)

const emit = defineEmits(['click'])

function selectItem (eventName) {
  emit('click', eventName)
  opened.value = false
}

</script>
