<script setup>
import {computed, onMounted} from 'vue'
import {useTestStore} from '@/store.js'
import LineChart from '@/components/LineChart.vue'
import TestList from '@/components/TestList.vue'

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
    class="mx-auto my-0 flex px-5 h-screen bg-white/95"
    style="max-width: 1440px;"
  >
    <div
      class="p-4 border-r-4 border-emerald-800"
      style="width: 225px"
    >
      <h3 class="mb-3 font-medium text-xl">
        Список анализов
      </h3>
      <TestList />
    </div>

    <div class="grow-1 p-4 pr-0">
      <h3 class="font-medium text-xl mb-3">
        Графики
      </h3>
      <div v-if="computedIsNoChart">
        нет данных или все графики скрыты
      </div>
      <div
        class="overflow-y-auto overflow-x-hidden"
        style="height: calc(100vh - 16px - 28px - 12px - 12px - 12px)"
      >
        <LineChart
          v-for="test in testStore.sortedFullData"
          :id="test.code"
          :key="test.code"
          class="py-15 first:pt-5 test-chart relative"
          :code="test.code"
          :test="test"
        />
      </div>
    </div>
  </div>
</template>

<style>
.test-chart:not(:last-child)::after {
  content: '';
  position: absolute;
  width: 70%;
  height: 1px;
  background: #006045;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
}
</style>
