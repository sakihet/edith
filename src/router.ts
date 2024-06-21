import { createWebHistory, createRouter } from "vue-router"

import IndexPage from './pages/IndexPage.vue'
import AboutPage from './pages/AboutPage.vue'

const routes = [
  { path: '/', component: IndexPage },
  { path: '/about', component: AboutPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
