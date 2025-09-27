<script setup>
import {useTestStore} from './store.js'
import {computed, onMounted} from "vue";
import EyeIcon from "@/components/icons/EyeIcon.vue";
import EyeClosedIcon from "@/components/icons/EyeClosedIcon.vue";
import LineChart from "@/components/LineChart.vue";
import Toast from "@/components/toaster/Toast.vue";

const testStore = useTestStore()

onMounted(() => {
  testStore.fetchData()
})

const computedIsNoChart = computed(() => {
  if (testStore.fullData) {
    const noData = !Object.keys(testStore.fullData).length
    const allHidden =  Object.values(testStore.fullData).every(({isHidden}) => isHidden)
    return noData || allHidden
  } else {
    return false
  }
})
</script>

<template>
<div
    class="mx-auto my-0 flex px-5 h-screen"
    style="width: 1440px"
>
  <div
      class="p-4 border-r-4 border-emerald-800"
      style="width: 225px"
  >
    <h3 class="mb-3 font-medium text-xl">Список анализов</h3>
    <div
        v-for="(test, index) of testStore.arrListData"
        :key="test.code"
        class="py-2 flex border-emerald-800"
        :class="{'border-b-1': index !== testStore.arrListData.length - 1}"
    >
      <a
          class="pr-1 cursor-pointer text-lg"
          :href="`#${test.code}`"
          :class="[test.isHidden ? 'text-gray-400' : 'text-gray-600 hover:text-gray-900']"
      >
        {{ test.title }}
      </a>

      <EyeIcon
          v-if="test.isHidden"
          class="ml-auto cursor-pointer"
          :class="[test.isHidden ? 'fill-gray-400' : 'fill-gray-600 hover:fill-gray-900']"
          title="Показать"
          @click="testStore.changeTest(test.code, 'isHidden', !test.isHidden)"
      />
      <EyeClosedIcon
          v-else
          class="ml-auto cursor-pointer"
          :class="[test.isHidden ? 'fill-gray-400' : 'fill-gray-600 hover:fill-gray-900']"
          title="Скрыть"
          @click="testStore.changeTest(test.code, 'isHidden', !test.isHidden)"
      />
    </div>
  </div>

  <div class="grow-1 p-4">
    <h3 class="mb-3 font-medium text-xl">Графики</h3>
    <div v-if="computedIsNoChart">
      нет данных или все графики скрыты
    </div>
    <div
        class="overflow-y-auto overflow-x-hidden"
        style="height: calc(100vh - 16px - 28px - 12px - 12px - 12px)"
    >
      <LineChart
          v-for="(test, ind) in testStore.fullData"
          :key="ind"
          :id="ind"
          class="py-5"
          :code="ind"
          :test="test"
      />
    </div>
  </div>
</div>
<Toast />
</template>
