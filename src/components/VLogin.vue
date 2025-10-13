<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <form
      class="border p-5 bg-white/95"
      @submit.prevent="login"
    >
      <div class="w-full mb-3">
        <V-Input
          id="login"
          v-model="username"
          label="Логин"
        />
      </div>

      <div class="w-full mb-4">
        <V-Input
          id="password"
          v-model="password"
          label="Пароль"
          type="password"
        />
      </div>

      <div class="flex justify-center">
        <button
          class="border py-2 px-4 bg-emerald-700 text-white uppercase cursor-pointer"
        >
          Войти
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import VInput from '@/components/shared/VInput.vue'
import {ref} from 'vue'

const username = ref('')
const password = ref('')

const login = () => {
  console.log(username.value, password.value)
}
</script>
