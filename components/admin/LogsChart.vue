<script>
import { Line, Bubble, mixins } from 'vue-chartjs'

export default {
  extends: Bubble,
  props: ['options', 'chartData'],
  mixins: [mixins.reactiveProp],
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    options () {
      this.$data._chart.options = this.options
      this.$data._chart.update()
    }
  }
}
</script>
