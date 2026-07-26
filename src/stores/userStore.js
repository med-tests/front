import { defineStore } from 'pinia'
import { useTestStore } from '@/stores/testStore.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { showToast } from '@/components/shared/AppToaster/toast.js'
import { useApiStore } from '@/stores/apiStore.js'

export const useUserStore = defineStore(
  'userStore',
  () => {
    const apiStore = useApiStore()
    const testStore = useTestStore()
    const router = useRouter()

    const isLoggedIn = ref(false)

    function checkIsLoggedIn () {
      isLoggedIn.value = !!localStorage.getItem('token')
    }

    function register ({ login, password }) {
      return apiStore.register({
        login,
        password,
      })
        .then((res) => {
          if (res.token) {
            localStorage.setItem('token', res.token)
            isLoggedIn.value = true
            router.push({ name: 'main' })
          } else {
            showToast('Ошибка регистрации. Свяжитесь с администрацией сайта', { type: 'error' })
            isLoggedIn.value = false
          }
      })
    }

    function login ({ login, password }) {
      return apiStore.login({
        login,
        password,
      })
        .then((res) => {
          if (res.token) {
            localStorage.setItem('token', res.token)
            isLoggedIn.value = true
            router.push({ name: 'main' })
          } else {
            showToast('Ошибка входа. Свяжитесь с администрацией сайта', { type: 'error' })
            isLoggedIn.value = false
          }
        })
    }

    function logout () {
      testStore.clearData()
      localStorage.removeItem('token')
      isLoggedIn.value = false
    }


    return {
      // state
      isLoggedIn,

      // actions
      checkIsLoggedIn,
      register,
      login,
      logout,
    }
  })
