import { createWebHistory, createRouter } from 'vue-router'

import VMain from '@/components/VMain.vue'
import VLogin from '@/components/VLogin.vue'

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

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !localStorage.getItem('token')) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
