<script>
import LoginButton from '@/components/LoginButton/LoginButton.vue'
import LogoutButton from '@/components/LogoutButton/LogoutButton.vue'
import SignUpButton from '@/components/SignUpButton/SignUpButton.vue'

export default {
  components: { 
    LogoutButton, 
    LoginButton, 
    SignUpButton 
  },
  created() {
    console.log('$auth', this.$auth)
  }
}
</script>

<template>
  <LogoutButton 
    v-if="$auth.isAuthenticated.value" 
  />
  <div 
    v-else 
    class="unauth-buttons"
  >
    <LoginButton />
    <SignUpButton />
  </div>
</template>



