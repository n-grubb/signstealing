<script>
export default {
  methods: {
    signup() {
      this.$auth.loginWithRedirect({
        screen_hint: 'signup'
      })
    }
  }
}
</script>

<template>
  <button
    class="btn btn-primary btn-block"
    @click="signup"
  >
    Sign Up
  </button>
</template>
