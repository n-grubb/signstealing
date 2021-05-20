/**
 * A simple plugin to make our Realm app available to all components as a global property.
 */
import * as Realm from "realm-web"
const APP_ID = "signstealing-rvkgv" // todo: move into a .env file
export const realmApp = new Realm.App(APP_ID)

export default {
  install(app) {
    app.config.globalProperties.$realm = realmApp
  }
}