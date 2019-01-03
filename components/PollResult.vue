<template>
  <Card class="poll-result">
    <h3 v-if="!open" class="show-results" @click="showResults">
      {{ $t('show_results') }}
    </h3>
    <div v-show="open" ref="resultsContainer">
      <h3>
        {{ $t(poll.winner.length === 1 ? 'result_winner' : 'result_tie') }} : {{ poll.winner.join(', ') }}
      </h3>
      <h2>
        {{ $t('result_title') }}
        <i>
          ({{ +poll.voteCount || 0 }} vote{{ poll.voteCount !== 1 ? 's' : '' }})
        </i>
      </h2>
      <OptionResult
        v-for="(ratio, index) in sortedOptions"
        :rank="index"
        :key="ratio.name"
        :name="ratio.name"
        :ratios="ratio.scoreRatio"/>
    </div>
  </Card>
</template>
<script>
import OptionResult from './OptionResult'
import Card from './Card'
import slide from '../lib/slide'
import voteAuth from '../lib/voteAuth'
export default {
  props: ['poll', 'resultsVisible'],
  components: {
    OptionResult, Card
  },
  data() {
    return {
      open: false
    }
  },
  mounted() {
    const hasVoted = voteAuth(this.$cookies).hasVoted(this.$props.poll.id)
    if (hasVoted) this.open = true
  },
  computed: {
    sortedOptions() {
      return this.poll.sortedOptions.map(optionName => {
        return this.poll.ratios.find(ratio => ratio.name === optionName)
      })
    }
  },
  methods: {
    showResults() {
      this.open = true
      slide.down(this.$refs.resultsContainer, 400)
    }
  },
  watch: {
    resultsVisible(newVal, oldVal) {
      if (newVal === true) this.showResults()
    }
  }
}
</script>

<style lang="less" scoped>
.poll-result {
  padding-top: 15px;
  text-align: center;
  margin-bottom: 400px;
  a {
    text-decoration: none;
    color: green;
    font-weight: bold;
  }
  h2 i{
    font-style: normal;
    font-weight: lighter;
    font-size: 0.8em;
  }
  .show-results {
    cursor: pointer;
  }
}
</style>
