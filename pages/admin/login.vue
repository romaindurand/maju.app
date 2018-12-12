<template>
  <admin-login
      :onLoggedIn="onLoggedIn" />
</template>
<script>
import AdminLogin from '../../components/admin/Login'
import cookies from '../../lib/cookies'

export default {
  components: { AdminLogin },
  methods: {
    onLoggedIn(authToken) {
      cookies(this.$cookies).setAuth(authToken)
      this.$router.push({path: '/admin/polls'})
    }
  }
}
</script>
