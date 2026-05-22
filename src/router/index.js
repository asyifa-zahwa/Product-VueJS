// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: () => import('../views/AddProduct.vue'),
    meta: { requiresAuth: true } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('access_token') !== null

  if (to.meta.requiresAuth && !isAuth) {
    next({ name: 'Login' })
  } else if (to.meta.guest && isAuth) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router