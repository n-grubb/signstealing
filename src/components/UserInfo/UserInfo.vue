<script>
export default {
  computed: {
    isLoggedIn() {
      console.log(this.$store.state.currentUser)
      return this.$store.state.isLoggedIn
    },

    userProfile() {
      return this.isLoggedIn && this.$store.state.currentUser ? this.$store.state.currentUser.profile : {}
    },

    userEmail() {
      return this.userProfile ? this.userProfile.email : ''
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      // this.$router.push('/')
    }
  }
}
</script>

<template>
  <div :class="[ 'user-info', { unauth: !isLoggedIn } ]">
    <div v-if="!isLoggedIn" class="unauth">
      <router-link to="login">Login</router-link>
	    <router-link to="signup">Sign Up</router-link>
    </div>
    <div v-else class="profile">
      <label class="profile__label">Logged in as:</label>
      <span class="profile__email">{{ userEmail }}</span>
      <button class="profile__logout" v-if="isLoggedIn" @click="logout">Logout</button>
    </div>
  </div>
</template>

<style>
.user-info {
  width: 100%;
  padding: var(--space-lg);
  border-top: var(--border-thickness) solid var(--neutral-light);
}

.unauth {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: flex-start;
}

.profile__label {
  font-size: var(--text-xs);
  color: var(--neutral);
}

.profile__logout {
  width: max-content;
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--neutral-dark);
  cursor: pointer;
}
</style>