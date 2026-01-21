<script setup>
import { computed, onMounted, useTemplateRef } from 'vue'
import { useTestStore } from '@/stores/testStore.js'
import LineChart from '@/components/LineChart.vue'
import TestList from '@/components/TestList.vue'
import UpsertTestModal from '@/components/UpsertTestModal.vue'
import VBtn from '@/components/shared/VBtn/index.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import { useUserStore } from '@/stores/userStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'

const { loading } = useLoadingStore()
const computedIsAllTestsLoading = computed(() => {
  return loading.getAllTests || false
})

const testStore = useTestStore()
const userStore = useUserStore()
onMounted(() => {
  testStore.getAllTests()
})

const computedIsNoTests = computed(() => {
  return !testStore.fullData.length
})

const computedAllTestsHidden = computed(() => {
  if (testStore.fullData.length) {
    return Object.values(testStore.fullData).every(({isHidden}) => isHidden)
  } else {
    return false
  }
})

const upsertTestModalRef = useTemplateRef('upsert-test-modal')
</script>

<template>
  <div
    class="mx-auto my-0 flex px-5 h-screen bg-white/95"
    style="max-width: 1600px;"
  >
    <!--  Список анализов  -->
    <div
      class="p-4 pl-0 border-r-4 border-emerald-800"
      style="width: 350px"
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
          :disabled="computedIsAllTestsLoading"
          @click="upsertTestModalRef.open()"
        >
          <PlusIcon
            width="20"
            :line-width="4"
          />
        </v-btn>
      </div>

      <div v-if="computedIsAllTestsLoading">
        Загрузка...
      </div>
      <TestList v-else />
    </div>

    <!--  Графики  -->
    <div class="grow-1 p-4 pr-0">
      <div class="flex justify-between mb-3">
        <h3 class="font-medium text-xl text-gray-700">
          Графики
        </h3>
        <v-btn
          type="error"
          @click="userStore.logout()"
        >
          ВЫЙТИ
        </v-btn>
      </div>

      <div v-if="computedIsAllTestsLoading">
        Загрузка...
      </div>

      <div
        v-if="!computedIsAllTestsLoading && (computedAllTestsHidden || computedIsNoTests)"
        class="text-red-800 text-xl p-6 font-semibold"
      >
        <template v-if="computedAllTestsHidden">
          Все графики скрыты.
          <div>Чтобы изменить видимость графика, нажиме на иконку глаза напротив соответствующего анализа в списке.</div>
        </template>

        <template v-else-if="computedIsNoTests">
          Анализы еще не добавлены.
          <div>
            Чтобы добавить анализ, нажмите на плюс возле списка анализов или
            <v-btn
              not-bordered
              not-filling
              title="Добавить анализ"
              type="success"
              @click="upsertTestModalRef.open()"
            >
              <div class="text-xl">
                сюда
              </div>
            </v-btn>.
          </div>
        </template>
      </div>

      <div
        v-if="!computedIsAllTestsLoading && !computedIsNoTests && !computedAllTestsHidden"
        class="overflow-y-auto overflow-x-hidden"
        style="height: calc(100vh - 16px - 28px - 12px - 12px - 12px)"
      >
        <LineChart
          v-for="test in testStore.sortedFullData"
          :id="test.id"
          :key="test.id"
          class="py-15 first:pt-5 test-chart relative"
          :test="test"
        />
      </div>
    </div>

    <!--  Модалка добавления анализа  -->
    <UpsertTestModal
      ref="upsert-test-modal"
    />
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
