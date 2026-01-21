import { defineStore } from 'pinia'
import api from '@/api.js'
import { useTestStore } from '@/stores/testStore.js'
import { useRouter } from 'vue-router'
import {useLoadingStore} from '@/stores/loadingStore.js'

export const useUserStore = defineStore(
  'userStore',
  () => {
    const testStore = useTestStore()
    const loadingStore = useLoadingStore()
    const router = useRouter()

    function register ({ login, password }) {
      loadingStore.setLoadingFor('register', true)
      return api.register({
        login,
        password,
      })
        .then((res) => {
          localStorage.setItem('token', res.token)
          router.push({ name: 'main' })
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
          localStorage.setItem('token', res.token)
          router.push({ name: 'main' })
        })
        .catch((err) => {})
        .finally(() => {
          loadingStore.setLoadingFor('login', false)
        })
    }

    function logout () {
      testStore.clearTests()
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    }


    return {
      // actions
      register,
      login,
      logout,
    }
  })
