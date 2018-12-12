<template>
  <admin-polls
    v-if="loggedIn"
    :polls="polls"
    :fetchData="fetchData" />
</template>
<script>
import { mapActions, mapState } from 'vuex'
import cookies from '../../lib/cookies'
import pollsSort from '../../lib/pollsSort'
import AdminPolls from '../../components/admin/PollList'

export default {
  components: { AdminPolls },
  async asyncData({ app }) {
    try {
      const polls = await app.$axios.$get(`/api/admin/polls`)
      const sortedPolls = polls.sort(pollsSort.alphabetical)
      const authToken = cookies(app.$cookies).getAuthToken()
      return {
        loggedIn: true,
        authToken,
        polls: sortedPolls,
      }
    } catch (ex) {
      return {
        loggedIn: false,
        polls: null,
        authToken: null,
      }
    }
  },
  mounted() {
    if (!this.loggedIn) this.$router.push({ path: '/admin/login' })
  },
  methods: {
    ...mapActions(['notifyError']),
    async fetchData() {
      this.$nuxt.$loading.start()
      const polls = await this.$axios.$get(`/api/admin/polls`)
      this.$nuxt.$loading.finish()
      this.polls = polls.sort(pollsSort.alphabetical)
    },
  }
}
</script>
