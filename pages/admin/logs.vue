<template>
  <admin-logs
    v-if="loggedIn"
    :logs="logs" />
</template>
<script>
import AdminLogs from '../../components/admin/LogsCard'
import cookies from '../../lib/cookies'
import pollsSort from '../../lib/pollsSort'

export default {
  components: { AdminLogs },
  async asyncData({ app }) {
    try {
      const [polls, logs] = await Promise.all([
        app.$axios.$get(`/api/admin/polls`),
        app.$axios.$get(`/api/admin/logs`)])
      const sortedPolls = polls.sort(pollsSort.alphabetical)
      const authToken = cookies(app.$cookies).getAuthToken()
      return {
        loggedIn: true,
        authToken,
        polls: sortedPolls,
        logs
      }
    } catch (ex) {
      return {
        loggedIn: false,
        polls: null,
        logs: null,
        authToken: null,
      }
    }
  },
  mounted() {
    if (!this.loggedIn) this.$router.push({ path: '/admin/login' })
  }
}
</script>
