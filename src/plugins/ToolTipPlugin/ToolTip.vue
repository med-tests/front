<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup>
// https://vueschool.io/articles/vuejs-tutorials/how-to-create-a-vue-js-3-tool-tip-plugin/
// https://atomiks.github.io/tippyjs/v6/all-props/
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import { onMounted, onUpdated, onUnmounted } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  appendElementId: { type: String, required: true },
})

let tippyInstance = null

function initTippy() {
  if (tippyInstance) tippyInstance.destroy()

  // the tippy function takes the element to hover over and some options
  // remember we want the element the tooltip is nested under
  // we can access that on the template ref's parentNode
  tippyInstance = tippy(document.getElementById(props.appendElementId), {
    content: props.text,
    delay: 50,
    placement: 'auto',
    theme: 'light',

    // чтоб не скрывалось для удобства отладки
    // hideOnClick: 'toggle',
    // trigger: 'click',
  })
}

onMounted(initTippy)

// but we should also initialize it again on update
// so that the tooltip text is reactive
onUpdated(initTippy)

onUnmounted(() => tippyInstance.destroy())
</script>


<style>
.tippy-content {
  font-size: 16px;
}
</style>
