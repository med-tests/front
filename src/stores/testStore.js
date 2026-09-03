import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import api from '@/api.js'
import { formatParameter } from '@/helpers'
import { showToast } from '@/components/shared/AppToaster/toast.js'
import { useUserStore } from '@/stores/userStore.js'
import moment from 'moment'
import { useApiStore } from '@/stores/apiStore.js'

export const useTestStore = defineStore(
  'testStore',
  () => {
    const apiStore = useApiStore()
    const userStore = useUserStore()
    const fullData = reactive([])

    function getParams() {
      fullData.splice(0, fullData.length)

      if (!userStore.isLoggedIn) {
        return
      }

      apiStore.getParams()
        .then(data => {
          data.forEach(parameter => {
            const formattedParam = formatParameter(parameter)
            fullData.push(formattedParam)
          })
      })
    }

    const changeParameter = async (id, data) => {
      const allowedFields = ['title', 'isShowAverage', 'normalFrom', 'normalTo', 'isHidden', 'showFrom', 'showTo', 'results']
      const sendData = {}
      allowedFields.forEach(field => {
        if (Object.hasOwn(data, field)) {
          sendData[field] = data[field]
        }
      })

      const index = getIndexByParameterId(id)
      if (userStore.isLoggedIn) {
        apiStore.editParameter({ id, data: sendData })
          .then(data => {
            showToast('Сохранено')
            fullData[index] = formatParameter(data)
          })
      } else {
        const param = fullData[index]
        if (Object.hasOwn(sendData, 'title')) {
          param.title = sendData.title
        }
        if (Object.hasOwn(sendData, 'isShowAverage')) {
          param.isShowAverage = sendData.isShowAverage
        }
        if (Object.hasOwn(sendData, 'normalFrom')) {
          param.normalRange.from = sendData.normalFrom
        }
        if (Object.hasOwn(sendData, 'normalTo')) {
          param.normalRange.to = sendData.normalTo
        }
        if (Object.hasOwn(sendData, 'isHidden')) {
          param.isHidden = sendData.isHidden
        }
        if (Object.hasOwn(sendData, 'showFrom')) {
          param.shownPeriod.start = sendData.showFrom
        }
        if (Object.hasOwn(sendData, 'showTo')) {
          param.shownPeriod.end = sendData.showTo
        }
        if (Object.hasOwn(sendData, 'results')) {
          sendData.results.map((result) => {
            const existingResIndex = param.results.findIndex(r => r.id === result.id)
            if (existingResIndex !== -1) {
              if (result.status !== 0) {
                Object.hasOwn(result, 'value') && (param.results[existingResIndex].value = result.value)
                Object.hasOwn(result, 'date') && (param.results[existingResIndex].date = result.date)
              }
              else {
                param.results.splice(existingResIndex, 1)
              }
            }
            else {
              param.results.push({
                id: param.results.length + 1,
                value: result.value,
                date: result.date,
              })
            }
          })

          if (param.results.length) {
            param.results.sort((a,b) => moment(a.date, 'YYYY-MM-DD').unix() - moment(b.date, 'YYYY-MM-DD').unix())

            param.shownPeriod = {
              start: param.results[0].date,
              end: param.results[param.results.length - 1].date,
            }
          } else {
            param.shownPeriod = { start: '', end: '' }
          }
        }
        showToast('Сохранено до перезагрузки страницы')
      }
    }

    const arrListData = computed(() => {
      return fullData
        .map(parameter => {
          const { title, id, isHidden, position } = parameter
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
        .map(param => param)
        .sort((a, b) => b.position - a.position)
    })

    const updateOrder = ({ id, newPosition, oldPosition }) => {
      if (!userStore.isLoggedIn) {
        return
      }

      const reversedNewPosition = fullData.length - newPosition
      const reversedOldPosition = fullData.length - oldPosition

      return api.changeParameterPosition(id, {
        newPosition: reversedNewPosition,
        oldPosition: reversedOldPosition,
      })
        .then(() => {
          showToast('Сохранено')
          const isGoUp = reversedNewPosition > reversedOldPosition
          if (isGoUp) {
            fullData.forEach(item => {
              if (item.position > reversedOldPosition
                && item.position <= reversedNewPosition
                && item.id !== id) {
                item.position = item.position - 1
              }
              if (item.id === id) {
                item.position = reversedNewPosition
              }
            })
          } else {
            fullData.forEach(param => {
              if (param.position >= reversedNewPosition
                && param.position < reversedOldPosition
                && param.id !== id) {
                param.position = param.position + 1
              }
              if (param.id === id) {
                param.position = reversedNewPosition
              }
            })
          }
        })
        .catch(err => {
          showToast('Не удалось сохранить изменения', { type: 'error' })
          console.error(err)
        })
    }

    const addParameter = async (rawParameter) => {
      if (userStore.isLoggedIn) {
        apiStore.addParameter(rawParameter)
          .then(data => {
            showToast('Сохранено')
            fullData.push(formatParameter(data))
          })
      }
      else {
        const formattedResults = rawParameter.results
            .map((result, index) => ({
              id: index + 1,
              date: result.date,
              value: result.value,
            }))
            .sort((a,b) => a.date.localeCompare(b.date))
          || []

        fullData.push({
          id: fullData.length + 1,
          title: rawParameter.title,
          isShowAverage: rawParameter.isShowAverage,
          normalRange: {
            from: rawParameter.normalFrom,
            to: rawParameter.normalTo,
          },
          isHidden: false,
          shownPeriod: {
            start: formattedResults[0]?.date || '',
            end: formattedResults[formattedResults.length - 1]?.date || '',
          },
          position: rawParameter.position,
          results: formattedResults,
        })
        showToast('Сохранено до перезагрузки страницы')
      }
    }

    const deleteParameter = async (id, title) => {
      if (userStore.isLoggedIn) {
        apiStore.deleteParameter(id)
          .then(() => {
            showToast(`Показатель "${title}" удален`)
            const index = getIndexByParameterId(id)
            fullData.splice(index, 1)
          })

      }
      else {
        showToast(`Показатель "${title}" удален`)
        const index = getIndexByParameterId(id)
        fullData.splice(index, 1)
      }
    }

    const clearData = () => {
      fullData.splice(0, fullData.length)
    }

    function getFullParameterById (id) {
      return fullData.find(param => Number(param.id) === Number(id))
    }

    function getIndexByParameterId (id) {
      return fullData.findIndex(param => param.id === id)
    }

    function addMultiResults (data) {
      if (userStore.isLoggedIn) {
        return apiStore.addMultiResults(data)
          .then((res) => {
            showToast('Сохранено')
            res.forEach(param => {
              const index = getIndexByParameterId(param.id)
              fullData[index] = formatParameter(param)
            })
          })
      } else {
        return new Promise((res) => res())
          .then(() => {
            data.forEach(({ id, results }) => {
              const param = getFullParameterById(id)
              if (param) {
                param.results = results
                  .concat(param.results)
                  .sort((a, b) => new Date(a.date) - new Date(b.date))

                param.shownPeriod.start = param.results[0].date
                param.shownPeriod.end = param.results[param.results.length - 1].date
              }
            })
        })
      }
    }

    return {
      // state
      fullData,

      // getters
      arrListData,
      sortedFullData,

      // actions
      getParams,
      changeParameter,
      updateOrder,
      addParameter,
      deleteParameter,
      getFullParameterById,
      clearData,
      addMultiResults,
    }
  },
)
