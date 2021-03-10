import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import '@n-grubb/toolbox/dist/style.css'

createApp(App)
  .use(router)
  .mount('#app')
