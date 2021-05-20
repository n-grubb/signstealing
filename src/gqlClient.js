import * as Realm from "realm-web"
import { createClient } from '@urql/vue'

export const APP_ID = "signstealing-rvkgv";
const app = new Realm.App(APP_ID);

// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
  // Guarantee that there's a logged in user with a valid access token
  if (!app.currentUser) {
    // If no user is logged in, log in an anonymous user. The logged in user will have a valid
    // access token.
    await app.logIn(Realm.Credentials.anonymous())
  } else {
    // An already logged in user's access token might be stale. To guarantee that the token is
    // valid, we refresh the user's custom data which also refreshes their access token.
    await app.currentUser.refreshCustomData()
  }
  return app.currentUser.accessToken
}

// setup the GQL client
export default createClient({
  url: `https://realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`,
  fetchOptions: () => {
    const accessToken = getValidAccessToken()
    return {
      headers: { authorization: accessToken ? `Bearer ${accessToken}` : '' },
    }
  }
})
