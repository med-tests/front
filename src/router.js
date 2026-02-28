import { createWebHistory, createRouter } from 'vue-router'

import VMain from '@/components/pages/VMain.vue'
import VLogin from '@/components/pages/VLogin.vue'
import VRegister from '@/components/pages/VRegister.vue'

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
    name: 'register',
    path: '/register',
    component: VRegister,
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
