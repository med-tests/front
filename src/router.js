import { createWebHistory, createRouter } from 'vue-router'

import VMain from '@/components/VMain.vue'
import VLogin from '@/components/VLogin.vue'

const routes = [
  { path: '/', component: VMain },
  { path: '/login', component: VLogin },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
