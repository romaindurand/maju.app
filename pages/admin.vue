<template>
  <div>
    <admin-login
      v-if="!loggedIn"
      :onLoggedIn="onLoggedIn" />
    <admin-polls
      v-if="loggedIn"
      :polls="polls"
      :fetchPolls="fetchPolls" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import cookies from '../lib/cookies'
import pollsSort from '../lib/pollsSort'
import AdminPolls from '../components/admin/PollList'
import AdminLogin from '../components/admin/Login'

export default {
  components: { AdminPolls, AdminLogin },
  async asyncData({ app }) {
    try {
      const { polls } = await app.$axios.$get(`/api/admin/polls`)
      const sortedPolls = polls.sort(pollsSort.alphabetical)
      const authToken = cookies(app.$cookies).getAuthToken()
      return {
        loggedIn: true,
        authToken,
        polls: sortedPolls
      }
    } catch (ex) {
      return {
        loggedIn: false,
        polls: null,
        authToken: null,
      }
    }
  },
  methods: {
    ...mapActions(['notifyError']),
    onLoggedIn(authToken) {
      cookies(this.$cookies).setAuth(authToken)
      this.authToken = authToken
      this.loggedIn = true
      this.fetchPolls()
    },
    async fetchPolls() {
      this.$nuxt.$loading.start()
      const {polls} = await this.$axios.$get(`/api/admin/polls`)
      this.$nuxt.$loading.finish()
      this.polls = polls.sort(pollsSort.alphabetical)
    },
  }
}
</script>
