<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useTestStore } from '@/stores/testStore.js'
import LineChart from '@/components/LineChart.vue'
import TestList from '@/components/TestList.vue'
import UpsertTestModal from '@/components/UpsertTestModal.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import { useUserStore } from '@/stores/userStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'
import ContextMenu from '@/components/shared/ContextMenu.vue'
import router from '@/router.js'

const { loading } = useLoadingStore()

const testStore = useTestStore()
const userStore = useUserStore()

const scrollOffset = ref(0)
const bannerHeight = ref(0)
onMounted(() => {
  const chartTitle = document.getElementById('chartTitle')
  const chartTitleHeight = chartTitle.offsetHeight + +window.getComputedStyle(chartTitle).marginBottom.replace('px', '')

  const chartWrap = document.getElementById('chartWrap')
  const chartWrapPaddings = +window.getComputedStyle(chartWrap).paddingTop.replace('px', '')
      + +window.getComputedStyle(chartWrap).paddingBottom.replace('px', '')

  if (!userStore.isLoggedIn) {
    bannerHeight.value = document.getElementById('banner').offsetHeight
  }

  scrollOffset.value = chartTitleHeight + chartWrapPaddings + bannerHeight.value
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

function onContextMenuClick (eventName) {
  if (eventName === 'addTest') {
    upsertTestModalRef.value.open()
  }
}
</script>

<template>
  <div
    class="mx-auto my-0 h-screen bg-white/95 flex flex-col"
    style="max-width: 1600px;"
  >
    <div
      v-if="!userStore.isLoggedIn"
      id="banner"
      class="font-medium text-lg text-red-600 text-center py-2 bg-red-100"
    >
      Войдите, чтобы не потерять изменения при перезагрузке страницы
    </div>

    <div
      class="flex px-5 grow-1"
      :style="{ height: userStore.isLoggedIn ? '100%' : `calc(100% - ${bannerHeight}px)`}"
    >
      <!--  Список анализов  -->
      <div
        class="p-4 pl-0 border-r-2 border-emerald-800"
        style="width: 350px"
      >
        <div class="mb-3 flex items-center justify-between">
          <h3 class="font-medium text-xl text-gray-700">
            Список анализов
          </h3>

          <ContextMenu
            :arr-items="[
              {title: 'Добавить анализ', event: 'addTest'},
            ]"
            @click="onContextMenuClick"
          >
            <template #trigger>
              <VBtn
                not-bordered
                not-filling
                type="success"
                :disabled="loading.getAllTests"
              >
                <PlusIcon
                  width="20"
                  :line-width="4"
                />
              </VBtn>
            </template>
          </ContextMenu>
        </div>

        <div v-if="loading.getAllTests">
          Загрузка...
        </div>
        <TestList v-else />
      </div>

      <!--  Графики  -->
      <div
        id="chartWrap"
        class="grow-1 p-4 pr-0"
      >
        <div
          id="chartTitle"
          class="flex justify-between mb-3"
        >
          <h3 class="font-medium text-xl text-gray-700">
            Графики
          </h3>

          <div class="ml-auto">
            <VBtn
              v-if="userStore.isLoggedIn"
              type="error"
              @click="userStore.logout()"
            >
              <span class="px-2">Выйти</span>
            </VBtn>
            <template v-else>
              <VBtn
                class="mr-4"
                type="default"
                @click="router.push({ name: 'register' })"
              >
                <span class="px-2">ЗАРЕГИСТРИРОВАТЬСЯ</span>
              </VBtn>

              <VBtn
                type="success"
                @click="router.push({ name: 'login' })"
              >
                <span class="px-2">ВОЙТИ</span>
              </VBtn>
            </template>
          </div>
        </div>

        <div v-if="loading.getAllTests">
          Загрузка...
        </div>

        <div
          v-if="!loading.getAllTests && (computedAllTestsHidden || computedIsNoTests)"
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
              <VBtn
                not-bordered
                not-filling
                title="Добавить анализ"
                type="success"
                @click="upsertTestModalRef.open()"
              >
                <span class="text-xl">
                  сюда
                </span>
              </VBtn>.
            </div>
          </template>
        </div>

        <div
          v-if="!loading.getAllTests && !computedIsNoTests && !computedAllTestsHidden"
          class="overflow-y-auto overflow-x-hidden"
          :style="{ height: `calc(100vh - ${scrollOffset}px)` }"
        >
          <LineChart
            v-for="test in testStore.sortedFullData"
            :id="test.id"
            :key="test.id"
            class="py-15 first:pt-0 last:pb-0 test-chart relative"
            :test="test"
          />
        </div>
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
