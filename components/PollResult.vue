<template>
  <Card class="poll-result">
    <h3 v-if="results.resultsHidden">
      {{ $t('results_hidden') }}
      <no-ssr>
        <Countdown
          v-if="results.endDate"
          :end="results.endDate"
          @finished="refreshResults"
          :i18n="$t('countdown')"/>
      </no-ssr>
    </h3>
    <h3 v-if="!open && !results.resultsHidden" class="show-results" @click="showResults">
      {{ $t('show_results') }}
    </h3>
    <div v-show="open && !results.resultsHidden" ref="resultsContainer">
      <div v-if="!results.resultsHidden">
        <h3>
          {{ $t(results.winner.length === 1 ? 'result_winner' : 'result_tie') }} : {{ results.winner.join(', ') }}
        </h3>
        <h2>
          {{ $t('result_title') }}
          <i v-if="results.voteCount !== null">
            ({{ +results.voteCount || 0 }} vote{{ results.voteCount !== 1 ? 's' : '' }})
          </i>
        </h2>
        <OptionResult
          v-for="(ratio, index) in sortedOptions"
          :rank="index"
          :key="ratio.name"
          :name="ratio.name"
          :ratios="ratio.scoreRatio"/>
      </div>
    </div>
  </Card>
</template>
<script>
import Countdown from 'vuejs-countdown'
import NoSsr from 'vue-no-ssr'
import OptionResult from './OptionResult'
import Card from './Card'
import slide from '../lib/slide'
import voteAuth from '../lib/voteAuth'
export default {
  props: ['results', 'resultsVisible', 'refreshResults'],
  components: {
    OptionResult, Card, Countdown, NoSsr
  },
  data() {
    return {
      open: false
    }
  },
  mounted() {
    if (this.results.resultsHidden) return
    const hasVoted = voteAuth(this.$cookies).hasVoted(this.results.id)
    if (hasVoted || this.results.hasEnded) this.open = true
  },
  computed: {
    sortedOptions() {
      return this.results.sortedOptions.map(optionName => {
        return this.results.ratios.find(ratio => ratio.name === optionName)
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
