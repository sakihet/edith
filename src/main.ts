import { createApp } from 'vue'
import router from './router'
import './css/reset.css'
import './css/token.css'
import './css/utility.css'
import './css/layout.css'
import './css/style.css'
import './css/pattern.css'
import App from './App.vue'

createApp(App).use(router).mount('#app')
