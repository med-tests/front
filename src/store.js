import {defineStore} from 'pinia'
import { computed, reactive } from 'vue'
import api from '@/api'
import { showToast } from '@/components/shared/toaster/toast.js'
import { formatTest } from '@/helpers'

export const useTestStore = defineStore(
  'testStore',
  () => {
    const fullData = reactive([])

    const fetchData = () => {
      // todo установка order
      api.getAllTests()
        .then(data => {
          data.forEach(test => {
            const formattedTest = formatTest(test)
            fullData.push(formattedTest)
          })
        })
    }

    const changeTest = (id, data) => {
      // todo оrder
      const allowedFields = ['title', 'normalRangeFrom', 'normalRangeTo', 'isHidden', 'showFrom', 'showTo']
      const sendData = {}
      allowedFields.forEach(field => {
        if (Object.hasOwn(data, field)) {
          sendData[field] = data[field]
        }
      })

      api.editTest(id, sendData)
        .then((res) => {
          const index = getIndexByTestId(id)
          fullData[index] = formatTest(res)
        })
    }

    const arrListData = computed(() => {
      // todo index -> order
      return fullData
        .map((test, index) => {
          const { title, id, isHidden } = test
          return {
            id,
            title,
            order: index,
            isHidden,
          }
        })
        .sort((a, b) => a.order - b.order)
    })

    const sortedFullData = computed(() => {
      return fullData.map(test => test).sort((a, b) => a.order - b.order)
    })

    const updateOrder = (newList) => {
      newList
        .forEach(({ code }, index ) => {
          changeTest(code, 'order', index)
          fullData[code].order = index
        })
    }

    const addNewTest = (test) => {
      return api.addTest(test)
        .then((test) => {
          showToast('Новый тест добавлен')
          // todo разобраться с order
          const formattedTest = formatTest(test)
          fullData.push(formattedTest)
        })
    }

    const deleteTest = (id) => {
      api.editTest(id, { status: 0 })
        .then(() => {
          const index = fullData.findIndex(test => test.id === id)
          fullData.splice(index, 1)
        })
    }

          if(!Object.keys(visibilityData).length) {
            return
          }

    function getIndexByTestId (id) {
      return fullData.findIndex(test => test.id === id)
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
      deleteTest,
    }
  },
)
