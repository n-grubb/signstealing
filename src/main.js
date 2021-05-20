import { createApp } from 'vue'
import urql from '@urql/vue'
import realm from './realm'
import store from './store/store'
import router from './router'
import gqlClient from './gqlClient'
import App from './App.vue'
import PrimeVue from 'primevue/config';

// global styles
import '@n-grubb/toolbox/dist/style.css'
import './assets/css/tw.css'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/saga-blue/theme.css' // theme

// import { setupAuth } from './auth0'
// import authConfig from './auth_config.json'
// 
// function callbackRedirect(appState) {
//   router.push(
//     appState && appState.targetUrl
//       ? appState.targetUrl
//       : '/'
//   )
// }
// setup auth and mount app
// setupAuth(authConfig, callbackRedirect).then(auth => {
//   createApp(App)
//     .use(store)
//     .use(router)
//     .use(auth)
//     .use(urql, gqlClient)
//     .mount('#app')
// })

createApp(App)
  .use(realm)
  .use(store)
  .use(router)
  .use(urql, gqlClient)
  .use(PrimeVue)
  .mount('#app')