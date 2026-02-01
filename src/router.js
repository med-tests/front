import { createWebHistory, createRouter } from 'vue-router'

import VMain from '@/components/pages/VMain.vue'
import VLogin from '@/components/pages/VLogin.vue'

const routes = [
  {
    name: 'main',
    path: '/',
    component: VMain,
  },
  {
    name: 'login',
    path: '/login',
    component: VLogin,
  },
  {
    path: '/:pathMatch(.*)*',
    component: VMain,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
