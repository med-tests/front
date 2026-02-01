<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <form
      class="border border-emerald-800 p-5 bg-white/95 flex flex-col items-center"
      style="min-width: 300px;"
      @submit.prevent
    >
      <div class="text-xl uppercase mb-3">
        {{ isLoginPage ? 'Вход' : 'Регистрация' }}
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
          @on-validate="username.error = !$event"
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
          @on-validate="password.error = !$event"
        />
        <div v-if="!isLoginPage">
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
      </div>

      <VBtn
        not-bordered
        not-filling
        class="mb-3"
        type="success"
        :disabled="computedIsLoading"
        @click="toggleLoginRegister"
      >
        <div class="text-sm text-gray-600 hover:text-emerald-700">
          {{ isLoginPage ? 'У меня нет аккаунта' : 'У меня есть аккаунт' }}
        </div>
      </VBtn>

      <VBtn
        class="mt-2"
        type="success"
        :is-loading="computedIsLoading"
        @click="isLoginPage ? login() : register()"
      >
        <div class="uppercase px-3 py-1">
          {{ isLoginPage ? 'Войти' : 'Зарегистрироваться' }}
        </div>
      </VBtn>

      <VBtn
        v-if="isLoginPage"
        not-bordered
        not-filling
        class="mt-3"
        type="default"
        :is-loading="computedIsLoading"
        @click="router.push({ name: 'main' })"
      >
        <div class="text-sm text-gray-600 hover:text-emerald-700">
          Продолжить без входа
        </div>
      </VBtn>
    </form>
  </div>
</template>

<script setup>
import VInput from '@/components/shared/VInput.vue'
import {computed, nextTick, reactive, ref} from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { useRouter } from 'vue-router'
import { showToast } from '@/components/shared/toaster/toast.js'
import { getRandomUid } from '@/helpers/index.js'
import {useLoadingStore} from '@/stores/loadingStore.js'

const userStore = useUserStore()
const router = useRouter()

const username = reactive({
  value: '',
  error: false,
})
function validateUsername (value) {
  if (isLoginPage.value) {
    return true
  }

  // Валидация при регистрации
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
  if (isLoginPage.value) {
    return true
  }

  // Валидация при регистрации
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

const { loading } = useLoadingStore()
const computedIsLoading = computed(() => {
  return loading.login || loading.register
})

const login = async () => {
  if (!await checkValidate()) {
    return
  }

  userStore.login({
    login: username.value,
    password: password.value,
  })
    .then(() => {
      router.push({ name: 'main' })
    })
    .catch(err => {
      if (!err.error) {
        console.log(err)
      }
    })
}

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

const isLoginPage = ref(true)
function toggleLoginRegister () {
  username.value = ''
  password.value = ''
  isLoginPage.value = !isLoginPage.value
}
</script>
