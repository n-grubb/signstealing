<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info'
    },
    closeable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    capitalizedNotificationType() {
      const value = this.type.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<template>
  <transition name="fade">
    <div :class="['notification', `notification--${type}`]">
      <!-- 
      <SvgIcon
        v-if="icon"
        :name="icon"
        width="1rem"
        height="1rem"
      /> 
      -->
      <span class="visually-hidden">{{ capitalizedNotificationType }}:</span>
      <div class="notification__content">
        <slot />
      </div>
      <div
        v-if="closeable"
        class="notification__close"
        @click="$emit('dismiss')"
      > 
      X
        <!--
        <SvgIcon
          name="close"
          width="1rem"
          height="1rem"
        />
        -->
      </div>
    </div>
  </transition>
</template>


<style scoped>
.notification {
  position: relative;
  margin-top: var(--space);
  padding: var(--space-sm);
  background-color: var(--cool-white);
  border: var(--border-thickness) solid var(--neutral-light);
  border-left: none;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  box-shadow: 2px 2px 5px rgb(0,0,0,.15);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.notification svg {
  align-self: flex-start;
  margin-right: var(--space-xs);
  fill: var(--neutral-darker);
}

.notification__content {
  flex-grow: 1;
  margin-right: .625rem;
}

.notification__close {
  position: relative;
  fill: var(--text);
  cursor: pointer;
}

.notification__close svg {
  margin-right: 0;
}

.notification__close:after {
  content: '';
  width: 2.5rem;
  height: 2.5rem;
  position: absolute;
  top: -.75rem;
  left: -.75rem;
  cursor: pointer;
}

.notification:before {
  position: absolute;
  content: '';
  width: calc(var(--border-thickness) * 4);
  height: calc(100% + var(--border-thickness) * 2);
  left: 0;
  top: calc(var(--border-thickness) * -1);
}

/* Type variants */

.notification--info {
  fill: var(--lightblue-dark);
}

.notification--info:before {
  background: var(--lightblue-dark);
}

.notification--error {
  fill: var(--error);
}

.notification--error:before {
  background: var(--error);
}

.notification--success {
  fill: var(--emerald);
}

.notification--success:before {
  background: var(--emerald);
}
</style>
