import {defineStore} from 'pinia'
import { computed, reactive } from 'vue'
import api from '@/api'
import { showToast } from '@/components/shared/toaster/toast.js'
import { prepareTest } from '@/helpers'

export const useTestStore = defineStore(
  'testStore',
  () => {
    const fullData = reactive({})

    const fetchData = () => {
      const visibilityData = localStorage.getItem('testVisibilityData')
        ? JSON.parse(localStorage.getItem('testVisibilityData'))
        : {}

      // todo установка order
      api.getAllTests()
        .then(data => {
          data.forEach(test => {
            fullData[test.code] = prepareTest(test, visibilityData[test.code])
          })
        })
    }

    const changeTest = (code, param, value) => {
      const visibilityData = localStorage.getItem('testVisibilityData') ? JSON.parse(localStorage.getItem('testVisibilityData')) : {}

      if (Object.hasOwn(visibilityData, code)) {
        visibilityData[code][param] = value
      } else {
        visibilityData[code] = {}
        visibilityData[code][param] = value
      }

      localStorage.setItem('testVisibilityData', JSON.stringify(visibilityData))
      fullData.value[code][param] = value
    }

    const arrListData = computed(() => {
      return Object.entries(fullData)
        .map(([key, value]) => {
          const { title, order, isHidden } = value
          return {
                code: key,
                title: title,
                order: order,
                isHidden: isHidden,
              }
        })
        .sort((a, b) => a.order - b.order)
    })

    const sortedFullData = computed(() => {
      return Object.entries(fullData)
        .map(([key, value]) => {
          return {
            code: key,
            ...value,
          }
        })
        .sort((a, b) => a.order - b.order)
    })

    const updateOrder = (newList) => {
      newList
        .forEach(({ code }, index ) => {
          changeTest(code, 'order', index)
          fullData[code].order = index
        })
    }

    const addNewTest = (test) => {
      api.addTest(test)
        .then((res) => {
          showToast('Новый тест добавлен')
          // todo разобраться с order
          fullData[res.code] = prepareTest(res, { isHidden: false, order: Object.keys(fullData).length })
        })
    }

    return {
      // state
      fullData,

      // getters
      arrListData,
      sortedFullData,

      // actions
      fetchData,
      changeTest,
      updateOrder,
      addNewTest,
    }
  },
)
