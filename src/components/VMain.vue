<script setup>
import { computed, onMounted, useTemplateRef } from 'vue'
import {useTestStore} from '@/store.js'
import LineChart from '@/components/LineChart.vue'
import TestList from '@/components/TestList.vue'
import UpsertTestModal from '@/components/UpsertTestModal.vue'
import VBtn from '@/components/shared/VBtn/index.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'

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

const upsertTestModalRef = useTemplateRef('upsert-test-modal')
</script>

<template>
  <div
    class="mx-auto my-0 flex px-5 h-screen bg-white/95"
    style="max-width: 1440px;"
  >
    <div
      class="p-4 pl-0 border-r-4 border-emerald-800"
      style="width: 250px"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="font-medium text-xl text-gray-700">
          Список анализов
        </h3>
        <v-btn
          not-bordered
          not-filling
          class="ml-auto"
          title="Добавить анализ"
          type="success"
          @click="upsertTestModalRef.open()"
        >
          <PlusIcon
            height="16px"
            width="16px"
          />
        </v-btn>
      </div>
      <TestList />

      <UpsertTestModal
        ref="upsert-test-modal"
        @save="testStore.addNewTest($event)"
      />
    </div>

    <div class="grow-1 p-4 pr-0">
      <h3 class="font-medium text-xl mb-3 text-gray-700">
        Графики
      </h3>
      <div
        v-if="computedIsNoChart"
        class="text-gray-700"
      >
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
