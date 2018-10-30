<template>
  <Card class="poll-result">
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
  </Card>
</template>
<script>
import OptionResult from './OptionResult'
import Card from './Card'
export default {
  props: ['poll'],
  components: {
    OptionResult, Card
  },
  computed: {
    sortedOptions() {
      return this.poll.sortedOptions.map(optionName => {
        return this.poll.ratios.find(ratio => ratio.name === optionName)
      })
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
}
</style>
