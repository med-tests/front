import { defineStore } from 'pinia'
import api from '@/api.js'
import { useTestStore } from '@/stores/testStore.js'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore(
  'userStore',
  () => {
    const testStore = useTestStore()
    const router = useRouter()

    function register ({ login, password }) {
      return api.register({
        login,
        password,
      })
        .then((res) => {
          localStorage.setItem('token', res.token)
          router.push({ name: 'main' })
        })
        .catch((err) => {})
    }

    function login ({ login, password }) {
      return api.login({
        login,
        password,
      })
        .then((res) => {
          localStorage.setItem('token', res.token)
          router.push({ name: 'main' })
        })
        .catch((err) => {})
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
