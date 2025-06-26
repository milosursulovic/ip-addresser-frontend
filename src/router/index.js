import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      title: 'Home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      title: 'Login',
      component: LoginView,
    },
  ],
})

export default router
