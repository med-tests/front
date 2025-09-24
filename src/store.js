import {defineStore} from "pinia";
import {computed, ref} from "vue"

import usersData from '@/data/users.json'
import moment from "moment";

export const useTestStore = defineStore(
  'testStore',
  () => {
    const fullData = ref({})

    const fetchData = () => {
      const visibilityData = localStorage.getItem('testVisibilityData')
        ? JSON.parse(localStorage.getItem('testVisibilityData'))
        : {}

      Object.entries(usersData).forEach(([code, analis], index) => {

        let results = []
        if (Object.hasOwn(visibilityData, code) && Object.hasOwn(visibilityData[code], 'shownPeriod')) {
          results = analis.results
            .filter(res => {
              return moment(res.date, 'YYYY-MM-DD').isBetween(visibilityData[code].shownPeriod.start, visibilityData[code].shownPeriod.end, 'day', '[]');
            })
            .map((res) => ({x: res.date, y: res.value }))
        } else {
          results = analis.results.map((res) => ({x: res.date, y: res.value }))
        }

        let res = {
          title: analis.title,
          normalRange: analis.normalRange || {},
          results,
          order: index + 1,
          isHidden: false,
          shownPeriod: {
            start: visibilityData.shownPeriod?.start || results[0]?.x || analis.results[0].date || '',
            end: visibilityData.shownPeriod?.end || results[results.length - 1]?.x || analis.results[analis.results.length - 1].date || ''
          },
          testDates: analis.results.map(({ date }) => date),
          firstTestDate: analis.results[0].date,
          lastTestDate: analis.results[analis.results.length - 1].date,
        }

        if (Object.hasOwn(visibilityData, code)) {
          res = {...res, ...visibilityData[code]}
        }

        fullData.value[code] = res
      })
    }

    const changeTest = (code, param, value) => {
      const visibilityData = localStorage.getItem('testVisibilityData') ? JSON.parse(localStorage.getItem('testVisibilityData')) : {}

      if (Object.hasOwn(visibilityData, code) && Object.hasOwn(visibilityData[code], param)) {
        visibilityData[code][param] = value
      } else {
        visibilityData[code] = {}
        visibilityData[code][param] = value
      }

      localStorage.setItem('testVisibilityData', JSON.stringify(visibilityData))
      fullData.value[code][param] = value

      if (param === 'shownPeriod') {
        fullData.value[code].results = usersData[code].results
          .filter(res => {
            return moment(res.date).isBetween(value.start, value.end, 'day', '[]');
          })
          .map((res) => ({x: res.date, y: res.value }))
      }
    }

    const arrListData = computed(() => {
      return Object.entries(fullData.value).map(([key, value]) => {
        // todo сортировать по order
        return {
              code: key,
              title: value.title,
              order: value.order,
              isHidden: value.isHidden,
            }
      })
    })

    return {
      fullData,
      arrListData,
      fetchData,
      changeTest,
    }

  }
)
