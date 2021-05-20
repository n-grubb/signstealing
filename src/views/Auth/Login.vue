<template>
	<section class="login">
    <h2>
      Log in
    </h2>
    <form @submit="handleSubmission">
      <div class="field">
        <label for="email-address" class="sr-only">Email address</label>
        <input v-model="email" id="email" type="email" name="email" autocomplete="email" required placeholder="Email address">
      </div>
      <div class="field">
        <label for="password" class="sr-only">Password</label>
        <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required placeholder="Password">
      </div>
      <button type="submit">Submit</button>
    </form>
	</section>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
	methods: {
    async handleSubmission(event) {
      event.preventDefault()
      try {
        await this.$store.dispatch('login', { email: this.email, password: this.password })
        this.$router.push('/')
      } catch(error) {
        console.error('sign in failed')
      }
    }
  }
}
</script>

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
  color: var(--neutral-dark);
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