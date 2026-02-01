<template>
  <RouterView />
  <VToast />
</template>
<script setup>
import VToast from '@/components/shared/toaster/VToast.vue'
import {onMounted} from 'vue'
import {useUserStore} from '@/stores/userStore.js'

const userStore = useUserStore()
onMounted(() => {
  userStore.checkIsLoggedIn()
})
</script>
