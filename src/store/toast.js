/**
 * Toast Message Vuex Module
 */

// Default time (in ms) that a toast message will disappear after.
const dismissInterval = 5000

/**
 * Create a Toast Message object
 *
 * @param {symbol} id - a unique message id
 * @param {string} text - the text of the message (supports markdown)
 * @param {string} type - a type of message ('info' | 'success' | 'error')
 * @param {number} dismissAfter - time in ms when this toast message will be dismissed
 * @returns {object} - a toast message object
 */
function createToastMessage(id, text, type, dismissAfter) {
  return {
    id,
    text,
    type,
    dismissAfter
  }
}

const toastModule = {
  state: {
    toastMessages: []
  },

  mutations: {
    /**
     * Add a new toast message and give it a unique id.
     *
     * @param {object} - The Vuex state
     * @param {object} A toast message object generated from createToastMessage()
     */
    ADD_TOAST_MESSAGE(state, toastMessage) {
      state.toastMessages = [...state.toastMessages, toastMessage]
    },

    /**
     * Remove a toast message from the store.
     *
     * @param {object} - The Vuex state
     * @param {symbol} - The id of a toast message to remove
     */
    REMOVE_TOAST_MESSAGE(state, id) {
      state.toastMessages = state.toastMessages.filter(message => message.id !== id)
    },

    /**
     * Clear all toast messages from the store.
     *
     * @param {object} - The Vuex state
     */
    CLEAR_TOAST_MESSAGES(state) {
      state.toastMessages = []
    }
  },

  actions: {
    /**
     * Recieve toast message pieces and generate a toastMessage object with a unique id.
     * Queues a dismiss action if the generated toastMessage is dismissable.
     *
     * @param {object} context - A Vuex context object
     * @param {object} payload - An object with a text property defined and optional type and dismissAfter properties.
     */
    async addToastMessage({ commit, dispatch }, { text, type = 'info', dismissAfter = dismissInterval }) {
      // generate a unique id for this toast message
      const toastId = Symbol('messageId')
      // create the toast message and initiate the mutation
      commit('ADD_TOAST_MESSAGE', createToastMessage(toastId, text, type, dismissAfter))
      // if the message is dismissed after an interval,
      // wait the alotted time and then dispatch the remove message action
      if (dismissAfter) {
        await new Promise(resolve => setTimeout(() => resolve(), dismissAfter))
        dispatch('removeToastMessage', toastId)
      }
    },

    /**
     * An action to initiate the remove toast mutation
     *
     * @param {object} context - A Vuex context object
     * @param {symbol} toastIdToRemove - The id of a toast message to remove
     */
    removeToastMessage({ commit }, toastIdToRemove) {
      commit('REMOVE_TOAST_MESSAGE', toastIdToRemove)
    },

    /**
     * An action to initiate the clear toast messages mutation
     *
     * @param {object} context - A Vuex context object
     */
    clearToastMessages({ commit }) {
      commit('CLEAR_TOAST_MESSAGES')
    }
  }
}

export default toastModule
