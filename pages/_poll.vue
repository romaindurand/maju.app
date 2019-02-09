<template>
  <div>
    <VoteForm
      v-if="poll"
      :poll="poll"
      :refreshResults="refreshResults"/>
    <PollResult
      v-if="poll && results" :results="results"
      :resultsVisible="resultsVisible"
      :refreshResults="refreshResults"
      :endDate="poll.settings && poll.settings.endDate"/>
    <Card v-if="!poll" class="not-found">
      <h1>{{ $t('404_title') }}</h1>
    </Card>
    <div v-if="!isProduction" @click="resetVote()">reset</div>
  </div>
</template>

<script>
import Card from '../components/Card'
import VoteForm from '../components/VoteForm'
import PollResult from '../components/PollResult'
import voteAuth from "../lib/voteAuth";
import { mapState } from 'vuex';

export default {
  components: { VoteForm, PollResult, Card },
  head () {
    return {
      title: `maju - ${(this.poll && this.poll.question) || "Let's make better choices together !"}`,
      meta: [
        { name: 'description', content: 'Vote and view poll results !' },
        //twitter
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: this.poll && this.poll.question ? this.poll.question : 'Click to see all available options !' },
        { name: 'twitter:description', content: 'Vote and view poll results !' },// todo: dynamic depending on end date
        { name: 'twitter:image', content: 'https://maju.app/logo.png' },
        { name: 'twitter:site', content: '@maju_app'},
        //facebook
        { property: 'og:url', content: `https://maju.app/${this.poll.id}` },
        { property: 'og:title', content: this.poll && this.poll.question ? this.poll.question : 'Click to see all available options !' },
        { property: 'og:description', content: 'Vote and view poll results !' },
        { property: 'og:image', content: 'https://maju.app/logo.png' },
      ]
    }
  },
  async asyncData({ app }) {
    const pollId = app.context.route.params.poll
    try {
      const poll = await app.$axios.$get(`/api/poll/${pollId}`)
      const results = await app.$axios.$get(`/api/results/${pollId}`)
      return {
        poll: {
          ...poll,
          id: pollId
        },
        results
      }
    } catch (ex) {
      return {
        poll: null,
        results: null,
      }
    }
  },
  data() {
    return {
      isProduction: process.env.isProduction,
      resultsVisible: false
    }
  },
  methods: {
    resetVote() {
      voteAuth(this.$cookies).reset(this.poll.id)
    },
    async refreshResults() {
      const pollId = this.poll.id
      this.results = await this.$axios.$get(`/api/results/${pollId}`)
      const poll = await this.$axios.$get(`/api/poll/${pollId}`)
      this.poll = {
        ...this.poll,
        ...poll
      }
      this.resultsVisible = true
    }
  },
}
</script>
<style lang="less" scoped>
.not-found {
  text-align: center;
}
</style>
