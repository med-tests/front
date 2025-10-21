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
          @on-click-close-icon="username = ''"
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
        <v-btn
          type="success"
        >
          <div class="uppercase px-3 py-1">
            Войти
          </div>
        </v-btn>
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
