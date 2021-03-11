import { createApp } from 'vue'
import store from './store'
import router from './router'
import { setupAuth } from './auth'
import authConfig from './auth_config.json'
import App from './App.vue'

// global styles
import '@n-grubb/toolbox/dist/style.css'
import './assets/css/tw.css'

let app = createApp(App)
  .use(store)
  .use(router)

function callbackRedirect(appState) {
  router.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : '/'
  )
}

// setup auth and mount app
setupAuth(authConfig, callbackRedirect).then(auth => {
  app
    .use(auth)
    .mount('#app')
})