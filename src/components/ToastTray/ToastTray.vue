<script>
/**
 * ToastTray: A display area for toast notifications.
 * Toast notifications are managed in the Vuex store.
 */
import Notification from '@/components/Notification/Notification.vue'

export default {
  components: { Notification },
  computed: {
    /**
     * Retrieve the toast messages from the store.
     *
     * @returns {array} - an array of toast messages
     */
    toastMessages() {
      return this.$store.state.toast.toastMessages || []
    }
  },
  methods: {
    /**
     * Dispatch a Vuex action to remove a toast message.
     *
     * @param {object} toastId - the ID of a toast message to remove
     */
    dismissNotification(toastId) {
      this.$store.dispatch('removeToastMessage', toastId)
    }
  }
}
</script>

<template>
  <div class="toast-tray">
    <Notification
      v-for="toastMessage in toastMessages.slice(-3)"
      :key="toastMessage.id"
      :type="toastMessage.type"
      :closeable="true"
      role="status"
      aria-live="polite"
      @dismiss="dismissNotification(toastMessage.id)"
    >
      {{ toastMessage.text }}
    </Notification>
  </div>
</template>

<style scoped>
.toast-tray {
  position: fixed;
  top: 0;
  right: var(--space);
  width: calc(100% - 3rem);
  z-index: var(--elevation-lg);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}

.toast-tray .notification {
  width: max-content;
  min-width: 15rem;
  max-width: 50%;
  margin-bottom: var(--space);
  z-index: var(--elevation-sm);
}

.toast-tray:nth-child(3) + .notification {
  transition: none;
}
</style>
