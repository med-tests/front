<template>
  <RouterView />
  <AppToaster />
</template>
<script setup>
import AppToaster from '@/components/shared/AppToaster'
import {onMounted} from 'vue'
import {useUserStore} from '@/stores/userStore.js'

const userStore = useUserStore()
onMounted(() => {
  userStore.checkIsLoggedIn()
})
</script>
