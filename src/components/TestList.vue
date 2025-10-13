<template>
  <draggable
    v-model="computedArrListData"
    group="test"
    item-key="code"
  >
    <template #item="{element, index}">
      <div
        class="py-2 flex border-emerald-800"
        :class="{'border-b-1': index !== computedArrListData.length - 1}"
      >
        <a
          class="pr-1 cursor-pointer text-lg"
          :class="[element.isHidden ? 'text-gray-400' : 'text-gray-600 hover:text-gray-900']"
          :href="`#${element.code}`"
        >
          {{ element.title }}
        </a>
        <EyeIcon
          v-if="element.isHidden"
          class="ml-auto cursor-pointer"
          title="Показать"
          :class="[element.isHidden ? 'fill-gray-400' : 'fill-gray-600 hover:fill-gray-900']"
          @click="testStore.changeTest(element.code, 'isHidden', !element.isHidden)"
        />
        <EyeClosedIcon
          v-else
          class="ml-auto cursor-pointer"
          title="Скрыть"
          :class="[element.isHidden ? 'fill-gray-400' : 'fill-gray-600 hover:fill-gray-900']"
          @click="testStore.changeTest(element.code, 'isHidden', !element.isHidden)"
        />
      </div>
    </template>
  </draggable>
</template>

<script setup>
import draggable from 'vuedraggable'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import {useTestStore} from '@/store.js'
import {computed} from 'vue'

const testStore = useTestStore()

const computedArrListData = computed({
  get: () => testStore.arrListData,
  set: (newList) => testStore.updateOrder(newList),
})
</script>
