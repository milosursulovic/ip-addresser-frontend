import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

router.beforeEach((to, from, next) => {
  const defaultTitle = 'My App'
  document.title = to.meta.title || defaultTitle
  next()
})

app.mount('#app')
