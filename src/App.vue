<script setup>
import {useTestStore} from './store.js'
import {computed, onMounted} from "vue";
import LineChart from "@/components/LineChart.vue";
import Toast from "@/components/shared/toaster/Toast.vue";
import TestList from "@/components/TestList.vue";

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
    <TestList/>
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
          v-for="test in testStore.sortedFullData"
          :key="test.code"
          :id="test.code"
          :code="test.code"
          :test="test"
      />
    </div>
  </div>
</div>
<Toast />
</template>
