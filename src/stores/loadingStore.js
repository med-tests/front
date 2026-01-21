import {defineStore} from 'pinia'
import {reactive} from 'vue'

export const useLoadingStore = defineStore(
  'loadingStore',
  () => {
    const loading = reactive({
      getAllTests: false,
      addTest: false,
      editTest: false,
      deleteTest: false,
      login: false,
      register: false,
    })

    function setLoadingFor (name, value) {
      loading[name] = value
    }

    return {
      // state
      loading,

      // actions
      setLoadingFor,
    }
  },
)
