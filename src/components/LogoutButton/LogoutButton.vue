<script>
export default {
  methods: {
    logout() {
      this.$auth.logout()
      this.$router.push({ path: "/" })
    }
  }
}
</script>

<template>
  <button
    class="btn btn-danger btn-block"
    @click.prevent="logout"
  >
    Log Out
  </button>
</template>
