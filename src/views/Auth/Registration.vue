<script>
import NotificationTray from '@/components/NotificationTray/NotificationTray.vue'

export default {
  components: { NotificationTray },
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      serverErrors: []
    }
  },
  computed: {
    // todo: only display these after each field has been touched.
    errors() {
      const errors = []

      if (!this.email) {
        errors.push({
          id: 0,
          text: `Must add a valid email address`,
          type: 'error'
        })
      }

      if (!this.password || this.password.length < 6) {
        errors.push({
          id: 1,
          text: `Must provide a valid password (6+ characters)`,
          type: 'error'
        })
      }

      if (!this.confirmPassword) {
        errors.push({
          id: 2,
          text: `Please confirm your password`,
          type: 'error'
        })
      }

      if (this.password !== this.confirmPassword) { //  && errors.find(error => error.id === 1)) {
        errors.push({
          id: 3,
          text: `Passwords do not match.`,
          type: 'error'
        })
      }

      return errors.concat(this.serverErrors)
    },

    canSubmitForm() {
      return this.errors.length === 0
    }
  },
	methods: {
    async handleSubmission(event) {
      event.preventDefault()

      // check to make sure the form is valid before submitting.
      if (this.canSubmitForm) {
        try {
          await this.$store.dispatch('register', { email: this.email, password: this.password })
          this.$router.push('/login')
        } catch (error) {
          console.log("Error... staying put.")
        }
      }
    }
  }
}
</script>

<template>
	<section class="login">
    <h2>
      Sign Up
    </h2>
    <form @submit="handleSubmission">
      <NotificationTray :notifications="errors" />

      <div class="field">
        <label for="email-address" class="sr-only">Email address</label>
        <input v-model="email" id="email" type="email" name="email" required placeholder="Email address">
      </div>
      <div class="field">
        <label for="password" class="sr-only">Password</label>
        <input v-model="password" id="password" name="password" type="password" required placeholder="Password">
      </div>
      <div class="field">
        <label for="confirm-password" class="sr-only">Confirm Password</label>
        <input v-model="confirmPassword" id="confirm-password" name="confirm-password" type="password" required placeholder="Confirm Password">
      </div>
      <button type="submit" :disabled="!canSubmitForm">Submit</button>
    </form>
	</section>
</template>

<style scoped>
.login {
  max-width: 20rem;
  margin: auto;
  margin-top: var(--space-xl);
}

h2 {
  margin-bottom: var(--space);
  text-align: center; 
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

input {
  appearance: none;
  display: block; 
  width: 100%; 
  padding: var(--space);
  margin-bottom: var(--space);
  border: var(--border-thickness) solid var(--neutral-light);
  border-radius: var(--border-radius);
  color: var(--neutral-dark)''
}

input::placeholder {
  color: var(--neutral);
}

button {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-xs);
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--accent);
  font-weight: var(--font-bold);
  color: var(--white);
}
</style>