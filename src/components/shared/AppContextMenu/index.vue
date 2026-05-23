<template>
  <div
    :id="randomId"
    :ref="`cm-${randomId}`"
    class="relative"
  >
    <div
      data-test="wrp-toggler"
      @click="opened = !opened"
    >
      <slot name="toggler" />
    </div>

    <div
      v-if="opened"
      v-click-outside="close"
      class="absolute z-1 bg-white border border-emerald-800 rounded mt-1"
      data-test="wrp-items"
    >
      <div
        v-for="(item, index) of arrItems"
        :key="index"
        class="py-1 px-4 hover:bg-emerald-600/15 cursor-pointer text-lg rounded whitespace-nowrap"
        data-test="item"
        @click="selectItem(item.event)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, useTemplateRef} from 'vue'
import {getRandomUid} from '@/helpers'

const randomId = getRandomUid()

const vClickOutside = {
  mounted: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event.target)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted: el => {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}

const contextMenuRef = useTemplateRef(`cm-${randomId}`)
function close (eventTarget) {
  if (eventTarget.id === randomId || contextMenuRef.value.contains(eventTarget)) {
    return
  }
  opened.value = false
}

defineProps({
  // { title: string, event: string }
  arrItems: { type: Array, required: true },
})

const opened = ref(false)

const emit = defineEmits(['click'])

function selectItem (eventName) {
  emit('click', eventName)
  opened.value = false
}

</script>
