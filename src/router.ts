import { createWebHistory, createRouter } from "vue-router"

import AppLayout from "./components/AppLayout.vue"
import IndexPage from './pages/IndexPage.vue'
import AboutPage from './pages/AboutPage.vue'
import DebugPage from "./pages/DebugPage.vue"
import DemoPage from "./pages/DemoPage.vue"
import LayoutPage from "./pages/LayoutPage.vue"
import PromptPage from "./pages/PromptPage.vue"
import ProofreadingPage from "./pages/ProofreadingPage.vue"
import CompletionPage from "./pages/TextCompletionPage.vue"
import SandboxPage from './pages/SandboxPage.vue'
import TranslationPage from './pages/TranslationPage.vue'
import SummarizationPage from "./pages/SummarizationPage.vue"

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/',
        component: IndexPage,
      },
      {
        path: '/:noteId',
        component: IndexPage,
      },
      {
        path: '/about',
        component: AboutPage
      },
      {
        path: '/debug',
        component: DebugPage
      },
      {
        path: '/demo',
        component: DemoPage
      },
      // demos
      {
        path: '/translation',
        component: TranslationPage
      },
      {
        path: '/prompt',
        component: PromptPage
      },
      {
        path: '/proofreading',
        component: ProofreadingPage
      },
      {
        path: '/completion',
        component: CompletionPage
      },
      {
        path: '/summarization',
        component: SummarizationPage
      }
    ]
  },
  { path: '/layout', component: LayoutPage },
  { path: '/sandbox', component: SandboxPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
