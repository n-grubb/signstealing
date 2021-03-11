<script>
export default {
  methods: {
    login() {
      this.$auth.loginWithRedirect()
    }
  }
}
</script>

<template>
  <button
    class="btn btn-primary btn-block"
    @click="login"
  >
    Log In
  </button>
</template>



