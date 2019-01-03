<template>
  <div>
    <VoteForm v-if="poll" :poll="poll" :refreshResults="refreshResults"/>
    <PollResult v-if="poll" :poll="ratios" :resultsVisible="resultsVisible"/>
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
        { name: 'description', content: 'Vote and view poll results !' }
      ]
    }
  },
  async asyncData({ app }) {
    const pollId = app.context.route.params.poll
    try {
      const poll = await app.$axios.$get(`/api/poll/${pollId}`)
      const ratios = await app.$axios.$get(`/api/results/${pollId}`)
      return {
        poll: {
          ...poll,
          id: pollId
        },
        ratios
      }
    } catch (ex) {
      return {
        poll: null,
        ratios: null,
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
      this.ratios = await this.$axios.$get(`/api/results/${this.poll.id}`)
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
