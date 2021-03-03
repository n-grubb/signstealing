import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import Toolbox from '@n-grubb/toolbox'
import '@n-grubb/toolbox/dist/style.css'

createApp(App)
  .use(router)
  .use(Toolbox)
  .mount('#app')
