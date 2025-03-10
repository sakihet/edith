import { createWebHistory, createRouter } from "vue-router"

import IndexPage from './pages/IndexPage.vue'
import AboutPage from './pages/AboutPage.vue'
import DebugPage from "./pages/DebugPage.vue"
import LayoutPage from "./pages/LayoutPage.vue"
import SandboxPage from './pages/SandboxPage.vue'

const routes = [
  {
    path: '/',
    component: IndexPage,
  },
  {
    path: '/:noteId',
    component: IndexPage,
  },
  { path: '/about', component: AboutPage },
  { path: '/debug', component: DebugPage },
  { path: '/layout', component: LayoutPage },
  { path: '/sandbox', component: SandboxPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
