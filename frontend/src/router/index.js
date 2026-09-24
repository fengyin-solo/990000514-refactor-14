import { createRouter, createWebHistory } from 'vue-router'
import { hasSession } from '../auth/session.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:id',
    name: 'Board',
    component: () => import('../views/Board.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !hasSession()) {
    next('/login')
  } else if (to.meta.guest && hasSession()) {
    next('/')
  } else {
    next()
  }
})

export default router
