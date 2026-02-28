import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    name: 'main',
    path: '/',
    component: () => import('@/components/pages/VMain.vue'),
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/components/pages/VLogin.vue'),
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('@/components/pages/VRegister.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/components/pages/VMain.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
