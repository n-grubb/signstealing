     
<script>
/**
 * ToastTray: A display area for toast notifications.
 * Toast notifications are managed in the Vuex store.
 */
import Notification from '@/components/Notification/Notification.vue'

export default {
  components: { Notification },
  props: {
    notifications: {
      type: Array,
      required: true
    }
  }
}
</script>

<template>
  <div class="notification-tray">
    <Notification 
      v-for="notification in notifications" 
      :key="notification.id"
      :type="notification.type"
      :closeable="false"
      role="status"
      aria-live="polite"
    >
      {{ notification.text }}
    </Notification>
  </div>
</template>

<style scoped>
.notification-tray .notification {
  margin-bottom: var(--space);
  background-color: var(--white);
}
</style>
