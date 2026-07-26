import { defineStore } from 'pinia'
import { reactive } from 'vue'
import api from '@/api.js'
import { showToast } from '@/components/shared/AppToaster/toast.js'

export const useApiStore = defineStore(
  'apiStore',
  () => {

    const loading = reactive({
        getParams: false,
        addParameter: false,
        editParameter: false,
        deleteParameter: false,
        login: false,
        register: false,
    })
      
   function getParams () {
       loading.getParams = true
       return api.getParams()
         .finally(() => {
             loading.getParams = false
         })
         .catch((err) => {
             showToast('Не удалось получить данные', { type: 'error' })
             return Promise.reject(err)
         })
   }

   function editParameter (sendData) {
        loading.editParameter = true
        return api.editParameter(sendData)
          .finally(() => {
              loading.editParameter = false
          })
          .catch((err) => {
              showToast('Не удалось сохранить изменения', { type: 'error' })
              return Promise.reject(err)
          })

   }

   function addParameter (sendData) {
        loading.addParameter = true
        return api.addParameter(sendData)
          .finally(() => {
              loading.addParameter = false
          })
          .catch(err => {
              showToast('Не удалось создать показатель', { type: 'error' })
              return Promise.reject(err)
          })
   }

   function deleteParameter (id) {
     loading.deleteParameter = true
     return api.deleteParameter(id)
       .finally(() => {
           loading.deleteParameter = false
       })
       .catch(err => {
           showToast('Не удалось удалить показатель', { type: 'error' })
           return Promise.reject(err)
       })
   }

   function login (sendData) {
        loading.login = true
        return api.login(sendData)
          .finally(() => {
            loading.login = false
          })
          .catch(err => {
            showToast('Не удалось войти', { type: 'error' })
            return Promise.reject(err)
          })
   }

   function register (sendData) {
     loading.register = true
     return api.register(sendData)
       .finally(() => {
         loading.register = false
       })
       .catch(err => {
         showToast('Не удалось зарегистрировать пользователя', { type: 'error' })
         return Promise.reject(err)
       })
   }

    return {
        loading,

        getParams,
        addParameter,
        editParameter,
        deleteParameter,
        login,
        register,
    }
  },
)