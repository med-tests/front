<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useTestStore } from '@/stores/testStore.js'
import LineChart from '@/components/LineChart.vue'
import ChartItemList from '@/components/ChartItemList.vue'
import UpsertParamModal from '@/components/UpsertParamModal.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import { useUserStore } from '@/stores/userStore.js'
import AppContextMenu from '@/components/shared/AppContextMenu'
import router from '@/router.js'
import {storeToRefs} from 'pinia'
import {useApiStore} from '@/stores/apiStore.js'
import NotLoggedInBanner from '@/components/NotLoggedInBanner'

const { loading } = storeToRefs(useApiStore())

const testStore = useTestStore()
const { fullData, sortedFullData } = storeToRefs(testStore)
const { getParams } = testStore

const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)
const { logout } = userStore

const scrollOffset = ref(0)
const bannerHeight = ref(0)
onMounted(() => {
  const chartTitle = document.getElementById('chartTitle')
  const chartTitleHeight = chartTitle.offsetHeight + +window.getComputedStyle(chartTitle).marginBottom.replace('px', '')

  const chartWrap = document.getElementById('chartWrap')
  const chartWrapPaddings = +window.getComputedStyle(chartWrap).paddingTop.replace('px', '')
      + +window.getComputedStyle(chartWrap).paddingBottom.replace('px', '')

  if (!isLoggedIn.value) {
    bannerHeight.value = document.getElementById('banner').offsetHeight
  }

  scrollOffset.value = chartTitleHeight + chartWrapPaddings + bannerHeight.value
  getParams()
})

const computedIsNoData = computed(() => {
  return !loading.value.getParams && !fullData.value.length
})

const computedAllItemsHidden = computed(() => {
  const isAllHidden = fullData.value.length
     ? Object.values(fullData.value).every(({isHidden}) => isHidden)
     : false
  return !loading.value.getParams && isAllHidden
})

const upsertParamModalRef = useTemplateRef('upsert-param-modal')

function onContextMenuClick (eventName) {
  if (eventName === 'createParameter') {
    upsertParamModalRef.value.open()
  }
}

const computedVisibleItems = computed(() => {
  return sortedFullData.value.filter(({ isHidden }) => !isHidden)
})
</script>

<template>
  <div
    class="mx-auto my-0 h-screen bg-white/95 flex flex-col"
    style="max-width: 1600px;"
  >
    <NotLoggedInBanner
      v-if="!isLoggedIn"
      id="banner"
    />

    <div
      class="flex px-4 grow-1"
      :style="{ height: isLoggedIn ? '100%' : `calc(100% - ${bannerHeight}px)`}"
    >
      <!--  Панель управления  -->
      <div
        v-if="!computedIsNoData"
        class="py-4 px-2 pl-0 border-r-2 border-emerald-800"
        style="width: 350px"
      >
        <div class="mb-3 flex items-center justify-between">
          <h3 class="font-medium text-xl text-gray-700">
            Панель управления
          </h3>

          <div>
            <AppContextMenu
              :arr-items="[
                {title: 'Создать показатель', event: 'createParameter'},
              ]"
              @click="onContextMenuClick"
            >
              <template #toggler>
                <div class="flex">
                  <AppBtn
                    not-bordered
                    not-filling
                    type="success"
                    :disabled="loading.getParams"
                  >
                    <PlusIcon
                      width="20"
                      :line-width="4"
                    />
                  </AppBtn>
                </div>
              </template>
            </AppContextMenu>
          </div>
        </div>

        <div v-if="loading.getParams">
          Загрузка...
        </div>

        <ChartItemList v-else />
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
          <h3
            v-if="!computedIsNoData"
            class="font-medium text-xl text-gray-700"
          >
            Графики
          </h3>

          <div class="ml-auto">
            <AppBtn
              v-if="isLoggedIn"
              type="error"
              @click="logout()"
            >
              <span class="px-2">Выйти</span>
            </AppBtn>
            <template v-else>
              <AppBtn
                class="mr-4"
                type="default"
                @click="router.push({ name: 'register' })"
              >
                <span class="px-2">ЗАРЕГИСТРИРОВАТЬСЯ</span>
              </AppBtn>

              <AppBtn
                type="success"
                @click="router.push({ name: 'login' })"
              >
                <span class="px-2">ВОЙТИ</span>
              </AppBtn>
            </template>
          </div>
        </div>

        <div v-if="loading.getParams">
          Загрузка...
        </div>

        <div 
          v-if="computedAllItemsHidden"
          class="text-red-800 text-xl p-6 font-semibold"
        >
          Все графики скрыты.
          <div>Чтобы изменить видимость графика, нажиме на иконку глаза напротив соответствующего названия в панели управления.</div>
        </div>

        <div
          v-if="computedIsNoData"
          class="text-red-800 text-xl p-6 font-semibold text-center"
        >
          Графики еще не созданы.
          <div class="my-2">
            Чтобы начать, необходимо
            <AppBtn
              type="success"
              @click="upsertParamModalRef.open()"
            >
              <span class="px-2">Создать показатель</span>
            </AppBtn>
          </div>
        </div>

        <div
          v-if="!computedIsNoData && !computedAllItemsHidden"
          class="overflow-y-auto overflow-x-hidden"
          :style="{ height: `calc(100vh - ${scrollOffset}px)` }"
        >
          <LineChart
            v-for="item in computedVisibleItems"
            :id="item.id"
            :key="item.id"
            class="py-15 first:pt-0 last:pb-0 param-chart relative"
            :item="item"
          />
        </div>
      </div>
    </div>

    <!--  Модалка создания показателя  -->
    <UpsertParamModal
      ref="upsert-param-modal"
    />
  </div>
</template>

<style>
.param-chart:not(:last-child)::after {
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
