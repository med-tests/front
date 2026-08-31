<template>
  <div
    class="font-medium text-lg text-red-600 text-center py-2 bg-red-100"
  >
    <AppBtn
      not-bordered
      not-filling
      type="success"
      @click="router.push({ name: 'login' })"
    >
      Войдите
    </AppBtn> или <AppBtn
      not-bordered
      not-filling
      type="success"
      @click="router.push({ name: 'register' })"
    >
      зарегистрируйтесь
    </AppBtn>, чтобы не потерять изменения при перезагрузке страницы
  </div>
</template>

<script setup>
import router from '@/router.js'
</script>

<script>
export default {
  name: 'NotLoggedInBanner',
}
</script>