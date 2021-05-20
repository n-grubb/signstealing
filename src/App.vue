<script>
import AppSidebar from './components/AppSidebar/AppSidebar.vue'
import ToastTray from './components/ToastTray/ToastTray.vue'

export default {
  components: { AppSidebar, ToastTray },
  computed: {
    useSidebarLayout() {
      return !this.$route.meta.hideSidebar
    }
  }
}
</script>

<template>
  <ToastTray />
  <AppSidebar v-if="useSidebarLayout" />
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style>
html {
  overflow-x: hidden;
}

#app {
  /* theme overrides */
  --border-thickness: 1px;
  /* custom colors */
  --error: #dc2626;
  --error-light: #fee2e2;
  --error-dark: #b91c1c;
  /* elevation */
  --elevation-sm: 10;
  --elevation-md: 20;
  --elevation-lg: 30;

  @apply font-sans;
  /* setup sidebar layout */
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}

main {
  min-width: 50%;
  height: 100vh;
  padding: var(--space-xl);
  flex-basis: 0;
  flex-grow: 999;
  overflow-y: auto;
}

.app-sidebar {
  flex-grow: 1;
  background-color: var(--white);
  border-right: var(--border-thickness) solid var(--neutral-lighter);
}

.app-sidebar.open {
  flex-basis: 15rem;
}

svg {
  width: 1rem;
  height: 1rem;
}

/* general button styles */
.button {
  min-width: 2.5rem;
  min-height: 2.5rem;
  padding: var(--space-xs);
  padding-bottom: calc(var(--space-xs) - 4px);
  border: 1px solid var(--neutral-light);
  border-radius: 4px;
  background: var(--white);
  box-shadow: 2px 2px 2px rgba(0,0,0,.15);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>