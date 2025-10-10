<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <form
        class="border p-5 bg-white/95"
        @submit.prevent="login"
    >
      <div class="w-full mb-3">
        <Input
          v-model="username"
          id="login"
          label="Логин"
        />
      </div>

      <div class="w-full mb-4">
        <Input
            v-model="password"
            id="password"
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
import Input from '@/components/shared/Input.vue'
import {ref} from "vue";

const username = ref('')
const password = ref('')

const login = () => {
  console.log(username.value, password.value)
}
</script>
