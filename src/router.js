import { createWebHistory, createRouter } from 'vue-router'

const devRoutes = [
  {
    name: 'test',
    path: '/test',
    component: () => import('@/components/pages/PageTest.vue'),
  },
]

const routes = [
  {
    name: 'main',
    path: '/',
    component: () => import('@/components/pages/PageMain.vue'),
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/components/pages/PageLogin.vue'),
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('@/components/pages/PageRegister.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/components/pages/PageMain.vue'),
  },
]
if (import.meta.env.DEV) {
  routes.unshift(...devRoutes)
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
