<template>
  <div></div>
</template>

<script>
import cookies from '../../lib/cookies'

export default {
  async asyncData({ app }) {
    const authToken = cookies(app.$cookies).getAuthToken()
    return {
      loggedIn: !!authToken
    }
  },
  mounted() {
    if (this.loggedIn) this.$router.push({ path: '/admin/polls' })
    else this.$router.push({ path: '/admin/login' })
  }
}
</script>
