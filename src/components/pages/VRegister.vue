<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <form
      class="border border-emerald-800 p-5 bg-white/95 flex flex-col items-center"
      style="min-width: 300px;"
      @submit.prevent
    >
      <div class="text-xl uppercase mb-3">
        Регистрация
      </div>

      <div class="w-full mb-3">
        <VInput
          id="login"
          v-model="username.value"
          required
          label="Логин"
          :callback-validator="validateUsername"
          :touch-id="touchId"
          @on-click-close-icon="username.value = ''"
          @on-validate="username.error = $event"
        />
      </div>

      <div class="w-full mb-3">
        <VInput
          id="password"
          v-model="password.value"
          required
          label="Пароль"
          type="password"
          :callback-validator="validatePassword"
          :touch-id="touchId"
          @on-validate="password.error = $event"
        >
          <template #description>
            <div class="mb-1">
              <div class="text-sm">
                - Не менее 8 символов
              </div>
              <div class="text-sm">
                - Xотя бы одно число
              </div>
              <div class="text-sm">
                - Xотя бы один спецсимвол
              </div>
              <div class="text-sm">
                - Xотя бы одна латинская буква в нижнем регистре
              </div>
              <div class="text-sm">
                - Xотя бы одна латинская буква в верхнем регистре
              </div>
            </div>
          </template>
        </VInput>
      </div>

      <VBtn
        not-bordered
        not-filling
        class="mb-3"
        type="success"
        :disabled="loading.register"
        @click="router.push({ name: 'login' })"
      >
        <div class="text-sm text-gray-600 hover:text-emerald-700">
          У меня есть аккаунт
        </div>
      </VBtn>
      <VBtn
        class="mt-2"
        type="success"
        :is-loading="loading.register"
        @click="register"
      >
        <div class="uppercase px-3 py-1">
          Зарегистрироваться
        </div>
      </VBtn>
    </form>
  </div>
</template>

<script setup>
import VInput from '@/components/shared/VInput.vue'
import { nextTick, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { useRouter } from 'vue-router'
import { showToast } from '@/components/shared/toaster/toast.js'
import { getRandomUid } from '@/helpers/index.js'
import {useLoadingStore} from '@/stores/loadingStore.js'
import {storeToRefs} from 'pinia'

const userStore = useUserStore()
const router = useRouter()

const username = reactive({
  value: '',
  error: false,
})

function validateUsername (value) {
  if (value.length < 2) {
    showToast('Слишком короткй логин', {type: 'error'})
    return false
  }
  if (value.length > 32) {
    showToast('Не больше 32 символов в логине', {type: 'error'})
    return false
  }

  return true
}

const password =  reactive({
  value: '',
  error: false,
})
function validatePassword (value) {
  if (value.length < 8) {
    showToast('Не менее 8 символов в пароле.', {type: 'error'})
    return false
  }
  if (!/(?=.*[0-9])(?=.*[!"№;%:?*()=@#$^&></|~+_\\,])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!"№;%:?*()=@#$^&></|~+_\\,]/g.test(value)) {
    // (?=.*[0-9]) - строка содержит хотя бы одно число
    // (?=.*[!"№;%:?*()=@#$^&></|~+_\\,]) - строка содержит хотя бы один спецсимвол
    // (?=.*[a-z]) - строка содержит хотя бы одну латинскую букву в нижнем регистре
    // (?=.*[A-Z]) - строка содержит хотя бы одну латинскую букву в верхнем регистре
    showToast('Пароль должен содержать заглавные и строчные латинские буквы, цифры и символы', {type: 'error'})
    return false
  }

  return true
}

const touchId = ref('')
async function checkValidate () {
  touchId.value = getRandomUid(7)
  await nextTick()
  if (username.error || password.error) {
    return false
  }
  return true
}

const { loading } = storeToRefs(useLoadingStore())

const register = async () => {
  if (!await checkValidate()) {
    return
  }

  userStore.register({
    login: username.value,
    password: password.value,
  })
      .catch(err => {
        if (!err.error) {
          console.log(err)
        }
      })
}
</script>
