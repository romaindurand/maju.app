<template>
  <div>
    <VoteForm
      :poll="poll"
      :refreshResults="refreshResults"
    />
    <!-- <div>{{ poll }}</div>
    <div>{{ results }}</div> -->
    <PollResult :poll="ratios"/>
    <div
      v-if="!isProduction"
      @click="resetVote()"
    >
      reset
    </div>
  </div>
</template>

<script>
import VoteForm from '../components/VoteForm.vue'
import PollResult from '../components/PollResult.vue'
import voteAuth from "../lib/voteAuth";

export default {
  components: { VoteForm, PollResult },
  async asyncData({ app }) {
    const pollId = app.context.route.params.poll
    const poll = await app.$axios.$get(`/api/poll/${pollId}`)
    const ratios = await app.$axios.$get(`/api/results/${pollId}`)

    return {
      poll: {
        ...poll,
        id: pollId
      },
      ratios
    }
  },
  methods: {
    resetVote() {
      voteAuth.reset(this.poll.id)
    },
    async refreshResults() {
      this.ratios = await this.$axios.$get(`/api/results/${this.poll.id}`)
    }
  },
  computed: {
    isProduction() {
      return process.env.NODE_ENV === 'production'
    }
  }
}
</script>
