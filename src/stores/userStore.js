import { defineStore } from 'pinia'
import api from '@/api.js'
import { useTestStore } from '@/stores/testStore.js'
import { useRouter } from 'vue-router'
import {useLoadingStore} from '@/stores/loadingStore.js'
import {ref} from 'vue'
import {showToast} from '@/components/shared/toaster/toast.js'

export const useUserStore = defineStore(
  'userStore',
  () => {
    const testStore = useTestStore()
    const loadingStore = useLoadingStore()
    const router = useRouter()

    const isLoggedIn = ref(false)

    function checkIsLoggedIn () {
      isLoggedIn.value = !!localStorage.getItem('token')
    }

    function register ({ login, password }) {
      loadingStore.setLoadingFor('register', true)
      return api.register({
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
        .catch((err) => {})
        .finally(() => {
          loadingStore.setLoadingFor('register', false)
        })
    }

    function login ({ login, password }) {
      loadingStore.setLoadingFor('login', true)
      return api.login({
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
        .catch((err) => {})
        .finally(() => {
          loadingStore.setLoadingFor('login', false)
        })
    }

    function logout () {
      testStore.clearTests()
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
