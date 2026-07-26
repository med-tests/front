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
        <AppInput
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
        <AppPasswordInput
          id="register-password"
          v-model="password"
          :touch-id
        />
      </div>

      <AppBtn
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
      </AppBtn>
      <AppBtn
        class="mt-2"
        type="success"
        :is-loading="loading.register"
        @click="register"
      >
        <div class="uppercase px-3 py-1">
          Зарегистрироваться
        </div>
      </AppBtn>
    </form>
  </div>
</template>

<script setup>
import AppInput from '@/components/shared/AppInput.vue'
import AppPasswordInput from '@/components/shared/AppPasswordInput'
import { nextTick, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { useRouter } from 'vue-router'
import { showToast } from '@/components/shared/AppToaster/toast.js'
import { getRandomUid } from '@/helpers/index.js'
import { useApiStore } from '@/stores/apiStore.js'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const router = useRouter()

const username = reactive({
  value: '',
  error: false,
})

function validateUsername (value) {
  if (value.length < 2) {
    showToast('Слишком короткй логин', { type: 'error' })
    return false
  }
  if (value.length > 32) {
    showToast('Не больше 32 символов в логине', { type: 'error' })
    return false
  }

  return true
}

const password =  reactive({
  value: '',
  error: false,
})

const touchId = ref('')

async function checkValidate () {
  touchId.value = getRandomUid(7)
  await nextTick()
  if (username.error || password.error) {
    return false
  }
  return true
}

const { loading } = storeToRefs(useApiStore())

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
