import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

import usersData from '@/data/users.json'

export const useTestStore = defineStore(
  'testStore',
  () => {
    const fullData = ref({})

    const fetchData = () => {
      const visibilityData = localStorage.getItem('testVisibilityData')
        ? JSON.parse(localStorage.getItem('testVisibilityData'))
        : {}

      Object.entries(usersData).forEach(([code, analis]) => {
        let res = {
          title: analis.title,
          normalRange: analis.normalRange || {},
          results: analis.results,
          isHidden: false,
          shownPeriod: {
            start: visibilityData.shownPeriod?.start || analis.results[0]?.date || '',
            end: visibilityData.shownPeriod?.end || analis.results[analis.results.length - 1]?.date || '',
          },
        }

        if (Object.hasOwn(visibilityData, code)) {
          res = {...res, ...visibilityData[code]}
        }

        fullData.value[code] = res
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
      return Object.entries(fullData.value)
        .map(([key, value]) => {
          return {
                code: key,
                title: value.title,
                order: value.order,
                isHidden: value.isHidden,
              }
        })
        .sort((a, b) => a.order - b.order)
    })

    const sortedFullData = computed(() => {
      return Object.entries(fullData.value)
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
          fullData.value[code].order = index
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
    }
  },
)
