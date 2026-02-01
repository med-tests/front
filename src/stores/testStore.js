import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import api from '@/api.js'
import { formatTest } from '@/helpers'
import { showToast } from '@/components/shared/toaster/toast.js'
import {useLoadingStore} from '@/stores/loadingStore.js'
import {useUserStore} from '@/stores/userStore.js'
import moment from 'moment'

export const useTestStore = defineStore(
  'testStore',
  () => {
    const loadingStore = useLoadingStore()
    const userStore = useUserStore()
    const fullData = reactive([])

    function getAllTests() {
      fullData.splice(0, fullData.length)

      if (!userStore.isLoggedIn) {
        return
      }

      loadingStore.setLoadingFor('getAllTests', true)

      return api.getAllTests()
        .then(data => {
          data.forEach(test => {
            const formattedTest = formatTest(test)
            fullData.push(formattedTest)
          })
        })
        .catch((err) => {})
        .finally(() => {
          loadingStore.setLoadingFor('getAllTests', false)
        })
    }

    const changeTest = async (id, data) => {
      const allowedFields = ['title', 'normalFrom', 'normalTo', 'isHidden', 'showFrom', 'showTo', 'results']
      const sendData = {}
      allowedFields.forEach(field => {
        if (Object.hasOwn(data, field)) {
          sendData[field] = data[field]
        }
      })

      const index = getIndexByTestId(id)
      try {
        if (userStore.isLoggedIn) {
          loadingStore.setLoadingFor('editTest', true)
          const res = await api.editTest(id, sendData)
          showToast('Изменения сохранены')
          fullData[index] = formatTest(res)
        }
        else {
          if (Object.hasOwn(sendData, 'title')) {
            fullData[index].title = sendData.title
          }
          if (Object.hasOwn(sendData, 'normalFrom')) {
            fullData[index].normalRange.from = sendData.normalFrom
          }
          if (Object.hasOwn(sendData, 'normalTo')) {
            fullData[index].normalRange.to = sendData.normalTo
          }
          if (Object.hasOwn(sendData, 'isHidden')) {
            fullData[index].isHidden = sendData.isHidden
          }
          if (Object.hasOwn(sendData, 'showFrom')) {
            fullData[index].shownPeriod.start = sendData.showFrom
          }
          if (Object.hasOwn(sendData, 'showTo')) {
            fullData[index].shownPeriod.end = sendData.showTo
          }
          if (Object.hasOwn(sendData, 'results')) {
            sendData.results.map((result) => {
              const existingResIndex = fullData[index].results.findIndex(r => r.id === result.id)
              if (existingResIndex !== -1) {
                if (result.status !== 0) {
                  Object.hasOwn(result, 'value') && (fullData[index].results[existingResIndex].value = result.value)
                  Object.hasOwn(result, 'date') && (fullData[index].results[existingResIndex].date = result.date)
                }
                else {
                  fullData[index].results.splice(existingResIndex, 1)
                }
              }
              else {
                fullData[index].results.push({
                  id: fullData[index].results.length + 1,
                  value: result.value,
                  date: result.date,
                })
              }
            })

            if (fullData[index].results.length) {
              fullData[index].results.sort((a,b) => moment(a.date, 'YYYY-MM-DD').unix() - moment(b.date, 'YYYY-MM-DD').unix())

              if (!fullData[index].shownPeriod.start && !fullData[index].shownPeriod.end) {
                fullData[index].shownPeriod = {
                  start: fullData[index].results[0].date,
                  end: fullData[index].results[fullData[index].results.length - 1].date,
                }
              }
            }
          }
          showToast('Изменения сохранены до перезагрузки страницы')
        }
      }
      catch (err) {
        showToast('Не удалось сохранить изменения', { type: 'error' })
        return Promise.reject(err)
      }
      finally {
        if (userStore.isLoggedIn) {
          loadingStore.setLoadingFor('editTest', false)
        }
      }
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
      if (!userStore.isLoggedIn) {
        return
      }

      const reversedNewPosition = fullData.length - newPosition
      const reversedOldPosition = fullData.length - oldPosition

      return api.changeTestPosition(id, {
        newPosition: reversedNewPosition,
        oldPosition: reversedOldPosition,
      })
        .then(() => {
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
        .catch(err => {
          showToast('Не удалось сохранить изменения', { type: 'error' })
        })
    }

    const addNewTest = async (test) => {
      try {
        let formattedTest
        if (userStore.isLoggedIn) {
          loadingStore.setLoadingFor('addTest', true)
          const res = await api.addTest(test)
          showToast('Анализ добавлен')
          formattedTest = formatTest(res)
        } else {
          const formattedResults = test.results
            .map((result, index) => ({
              id: index + 1,
              date: result.date,
              value: result.value,
            }))
            .sort((a,b) => moment(a.date, 'YYYY-MM-DD') - moment(b.date, 'YYYY-MM-DD'))
            || []

          formattedTest = {
            id: fullData.length + 1,
            title: test.title,
            normalRange: {
              from: test.normalFrom,
              to: test.normalTo,
            },
            isHidden: false,
            shownPeriod: {
              start: formattedResults[0]?.date || '',
              end: formattedResults[formattedResults.length - 1]?.date || '',
            },
            position: test.position,
            results: formattedResults,
          }
          showToast('Анализ добавлен до перезагрузки страницы')
        }
        fullData.push(formattedTest)
      } catch (err) {
        showToast('Не удалось добавить анализ', { type: 'error' })
        return Promise.reject(err)
      }
      finally {
        if (userStore.isLoggedIn) {
          loadingStore.setLoadingFor('addTest', false)
        }
      }
    }

    const deleteTest = async (id) => {
      try {
        if (userStore.isLoggedIn) {
          loadingStore.setLoadingFor('deleteTest', true)
          await api.deleteTest(id)
        }
        showToast('Анализ удален')
        const index = getIndexByTestId(id)
        fullData.splice(index, 1)
      }
      catch (err) {
        showToast('Не удалось удалить анализ', { type: 'error' })
      }
      finally {
        if (userStore.isLoggedIn) {
          loadingStore.setLoadingFor('deleteTest', false)
        }
      }
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
      getAllTests,
      changeTest,
      updateOrder,
      addNewTest,
      deleteTest,
      getFullTestById,
      clearTests,
    }
  },
)
