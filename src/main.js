import { createApp } from 'vue'
import App from './App.vue'
import Toolbox from '@n-grubb/toolbox'
import '@n-grubb/toolbox/dist/style.css'

createApp(App)
  .use(Toolbox)
  .mount('#app')
