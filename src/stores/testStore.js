import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import api from '@/api.js'
import { formatTest } from '@/helpers'
import { showToast } from '@/components/shared/toaster/toast.js'

export const useTestStore = defineStore(
  'testStore',
  () => {
    const fullData = reactive([])

    const fetchData = () => {
      fullData.splice(0, fullData.length)

      return api.getAllTests()
        .then(data => {
          data.forEach(test => {
            const formattedTest = formatTest(test)
            fullData.push(formattedTest)
          })
        })
        .catch((err) => {})
    }

    const changeTest = (id, data) => {
      const allowedFields = ['title', 'normalFrom', 'normalTo', 'isHidden', 'showFrom', 'showTo', 'results']
      const sendData = {}
      allowedFields.forEach(field => {
        if (Object.hasOwn(data, field)) {
          sendData[field] = data[field]
        }
      })

      return api.editTest(id, sendData)
        .then((res) => {
          showToast('Изменения сохранены')
          const index = getIndexByTestId(id)
          fullData[index] = formatTest(res)
        })
        .catch((err) => {})
    }

    const arrListData = computed(() => {
      return fullData
        .map(test => {
          const { title, id, isHidden, position } = test
          return {
            id,
            title,
            position,
            isHidden,
          }
        })
        .sort((a, b) => b.position - a.position)
    })

    const sortedFullData = computed(() => {
      return fullData
        .map(test => test)
        .sort((a, b) => b.position - a.position)
    })

    const updateOrder = ({ id, newPosition, oldPosition }) => {
      const reversedNewPosition = fullData.length - newPosition
      const reversedOldPosition = fullData.length - oldPosition


      return api.changeTestPosition(id, {
        newPosition: reversedNewPosition,
        oldPosition: reversedOldPosition,
      }).then(() => {
          showToast('Изменения сохранены')
          const isGoUp = reversedNewPosition > reversedOldPosition
          if (isGoUp) {
            fullData.forEach(test => {
              if (test.position > reversedOldPosition
                && test.position <= reversedNewPosition
                && test.id !== id) {
                test.position = test.position - 1
              }
              if (test.id === id) {
                test.position = reversedNewPosition
              }
            })
          } else {
            fullData.forEach(test => {
              if (test.position >= reversedNewPosition
                && test.position < reversedOldPosition
                && test.id !== id) {
                test.position = test.position + 1
              }
              if (test.id === id) {
                test.position = reversedNewPosition
              }
            })
          }
        })
        .catch(err => {})
    }

    const addNewTest = (test) => {
      return api.addTest(test)
        .then((test) => {
          showToast('Новый тест добавлен')
          const formattedTest = formatTest(test)
          fullData.push(formattedTest)
        })
        .catch((err) => {})
    }

    const deleteTest = (id) => {
      api.deleteTest(id)
        .then(() => {
          const index = fullData.findIndex(test => test.id === id)
          fullData.splice(index, 1)
        })
        .catch((err) => {})
    }

    const clearTests = () => {
      fullData.splice(0, fullData.length)
    }

    function getFullTestById (id) {
      return fullData.find(test => Number(test.id) === Number(id))
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
      getFullTestById,
      clearTests,
    }
  },
)
