<template>
  <pre v-if="loggedIn">
    {{JSON.stringify(poll, 2)}}
  </pre>
</template>
<script>
import cookies from '../../lib/cookies'

export default {
  async asyncData({ app }) {
    try {
      const pollId = app.context.route.params.poll
      const poll = await app.$axios.$get(`/api/admin/poll/${pollId}`)
      const authToken = cookies(app.$cookies).getAuthToken()
      return {
        loggedIn: true,
        authToken,
        poll
      }
    } catch (ex) {
      return {
        loggedIn: false,
        authToken: null,
        poll: null
      }
    }
  },
  mounted() {
    if (!this.loggedIn) this.$router.push({ path: '/admin/login' })
  }
}
</script>
