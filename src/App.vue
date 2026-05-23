<template>
  <RouterView />
  <Index />
</template>
<script setup>
import Index from '@/components/shared/AppToaster/index.vue'
import {onMounted} from 'vue'
import {useUserStore} from '@/stores/userStore.js'

const userStore = useUserStore()
onMounted(() => {
  userStore.checkIsLoggedIn()
})
</script>
