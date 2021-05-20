import { createStore } from 'vuex'
import * as Realm from "realm-web"
import { realmApp as $realm } from '../realm' 
import toastModule from './toast'

export default createStore({
  state: {
    lastUpdated: new Date(2021, 2, 23),
    isLoggedIn: !!localStorage.getItem("auth-token"),
    currentUser: $realm.currentUser || {}
  },

  mutations: {
    LOGIN(state, payload) {
      state.isLoggedIn = true
      state.currentUser = payload
    },

    LOGOUT(state) {
      state.isLoggedIn = false
      state.currentUser = {}
    }
  },

  actions: {
    async login({ commit, dispatch }, { email, password }) {
      console.log('login dispatched!')
      try {
        // Create an Realm credentials from the email and password provided by the payload.
        const credentials = Realm.Credentials.emailPassword(email, password)
        // Authenticate the user
        const user = await $realm.logIn(credentials)
        // Update local storage
        localStorage.setItem('auth-token', user.accessToken)
        // update state
        commit('LOGIN', user)
        // messag user
        dispatch('addToastMessage', { type: 'success', text: 'You have successfully logged in to the application.' })
      } catch(error) {
        dispatch('addToastMessage', { type: error, text: `There was a problem logging you in: ${error}` })
        console.error("Failed to log in", error)
      }
    },

    async logout({ commit, dispatch, state }) {
      try {
        // Log out w/ MongoDB Realm
        await state.currentUser.logOut()
        // remove our auth token from local storage.
        localStorage.removeItem('auth-token')
        // mutate state
        commit('LOGOUT')
        dispatch('addToastMessage', { type: 'success', text: 'You have been logged out of the application.' })
      } catch (error) {
        dispatch('addToastMessage', { type: 'error', text: `There was a problem logging you out: ${error}` })
        console.error("Failed to log user out:", error)
      }
    },

    async register({ dispatch }, { email, password }) {
      try {
        // Register user with MongoDB Realm
        await $realm.emailPasswordAuth.registerUser(email, password)
        dispatch('addToastMessage', { type: 'success', text: 'Account created! Please log in to continue.' })
      } catch(error) {
        dispatch('addToastMessage', { type: 'error', text: `There was a problem with your registration: ${error}` })
        console.error("Failed to register:", error)
      }
    }
  },

  modules: {
    toast: toastModule
  }
})