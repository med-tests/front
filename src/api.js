import axios from 'axios'
import { showToast } from '@/components/shared/toaster/toast.js'
import { useUserStore } from '@/stores/userStore.js'

const apiInstance = axios.create({
  baseURL: 'http://med-tests.fvds.ru/api',
})

apiInstance.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem('token')
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => Promise.reject(error))

apiInstance.interceptors.response.use(function (response) {
  // если код состояния в диапазоне 2xx
  if (response.data.error) {
    showToast(response.data.message, { type: 'error' })

    if (response.data.error_code === 1) {
      const userStore = useUserStore()
      userStore.logout()
    }

    return Promise.reject(response.data)
  }
  return response.data
},
  function (error) {
  // если код состояния вне диапазона 2xx
  showToast('Ошибка', { type: 'error' })
  console.log(error)
  return Promise.reject(error)
})

export default {
  login: function (credentials) {
    return apiInstance.post('/login', credentials)
  },
  register: function (credentials) {
    return apiInstance.post('/register', credentials)
  },
  getAllTests: function () {
    return apiInstance.get('/get-tests')
  },
  addTest: function (data) {
    return apiInstance.post('/add-test', data)
  },
  editTest: function (id, data) {
    return apiInstance.patch(`/edit-test/${id}`, data)
  },
}
