import axios from 'axios'
import { showToast } from '@/components/shared/toaster/toast.js'

const apiInstance = axios.create({
  baseURL: 'http://localhost:5000',
})

apiInstance.interceptors.response.use(function (response) {
  // если код состояния в диапазоне 2xx
  return response.data
},
  function (error) {
  // если код состояния вне диапазона 2xx
  showToast('Ошибка', { type: 'error' })
  console.log(error)
  return Promise.reject(error)
})

export default {
  getAllTests: function () {
    return apiInstance.get('/')
  },
  addTest: function (data) {
    return apiInstance.post('/add-test', data)
  },
  editTest: function (code, data) {
    // code должен быть обязательно
    return apiInstance.patch('/edit', { code, ...data })
  },
}
