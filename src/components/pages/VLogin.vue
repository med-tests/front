<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <form
      class="border border-emerald-800 p-5 bg-white/95 flex flex-col items-center"
      style="min-width: 300px;"
      @submit.prevent
    >
      <div class="text-xl uppercase mb-3">Вход</div>

      <div class="w-full mb-3">
        <VInput
          id="login"
          v-model="username.value"
          required
          label="Логин"
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
          :touch-id="touchId"
          @on-validate="password.error = $event"
        />
      </div>

      <VBtn
        not-bordered
        not-filling
        class="mb-3"
        type="success"
        :disabled="loading.login"
        @click="router.push({ name: 'register' })"
      >
        <div class="text-sm text-gray-600 hover:text-emerald-700">
          У меня нет аккаунта
        </div>
      </VBtn>

      <VBtn
        class="mt-2"
        type="success"
        :is-loading="loading.login"
        @click="login"
      >
        <div class="uppercase px-3 py-1">Войти</div>
      </VBtn>

      <VBtn
        not-bordered
        not-filling
        class="mt-3"
        type="default"
        :is-loading="loading.login"
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
import { nextTick, reactive, ref} from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { useRouter } from 'vue-router'
import { getRandomUid } from '@/helpers/index.js'
import {useLoadingStore} from '@/stores/loadingStore.js'
import {storeToRefs} from 'pinia'

const userStore = useUserStore()
const router = useRouter()

const username = reactive({
  value: '',
  error: false,
})

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

const { loading } = storeToRefs(useLoadingStore())

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
</script>
