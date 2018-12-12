<template>
  <card class="logs">
    <logs-chart
      ref="chart"
      :logs="logs"
      :chart-data="chartData"
      :options="chartOptions"/>
    <datepicker
      class="days-start"
      :inline="true"
      @selected="startDateChanged"
      :value="startDate"/>
    <time-input
      class="days-range"
      :startValue="range"
      :min="0.1"
      :max="30"
      :step="0.1"
      :ctrlStep="1"
      @changed="rangeChanged"/>
  </card>
</template>
<script>
import Card from '../Card'
import TimeInput from '../TimeInput'
import LogsChart from './LogsChart'
import Datepicker from 'vuejs-datepicker'
import { subDays, subHours, addHours, differenceInHours } from 'date-fns';

export default {
  components: { Card, LogsChart, Datepicker, TimeInput },
  props: {
    logs: {
      default: []
    }
  },
  methods: {
    rangeChanged (range) {
      this.range = range
      this.updateChartDate()
    },
    startDateChanged (date) {
      this.startDate = date
      this.updateChartDate()
    },
    updateChartDate() {
      this.options.min = subHours(this.startDate, this.range * 24)
      this.options.max = this.startDate
    },
    getTimeUnit(delta) {
      if (delta < 3) return 'minute'
      if (delta < 24) return 'hour'
      if (delta < 720) return 'day'
      return 'month'
    }
  },
  computed: {
    chartData() {
      const ips = this.logs.reduce((memo, log) => memo.includes(log.ip) ? memo : [...memo, log.ip], [])
      const colorLabels = {
        'invalid.password': '#f00',
        'admin.login': '#0f0',
        'rate.limited': '#fa0',
        'no.auth.cookie': '#f0f',
        'no.auth.token': '#fdd',
        'invalid.auth.token': '#00f'}
      const datasets = Object.keys(colorLabels).map(type => ({
        backgroundColor: colorLabels[type],
        data: this.logs
          .filter(log => log.type === type)
          .map(log => ({
            label: 'foo',
            x: new Date(log.date),
            y: log.ip,
            r: 2
          })),
        label: type
      }))
      return {datasets}
    },
    chartOptions() {
      const dateDeltaInHours = differenceInHours(this.options.max, this.options.min)
      const unit = this.getTimeUnit(dateDeltaInHours)
      console.log({dateDeltaInHours})
      return {
        timestamp: +new Date(),
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit,
              min: this.options.min,
              max: this.options.max
            }
          }],
          yAxes: [{
            type: 'category',
            labels: this.logs.reduce((memo, log) => memo.includes(log.ip) ? memo : [...memo, log.ip], [])
          }]
        }
      }
    }
  },
  data() {
    const now = new Date()
    return {
      range: 1,
      startDate: now,
      options: {
        min: subHours(now, 24),
        max: now
      }
    }
  }
}
</script>
<style lang="less" scoped>
.days-range {
  display: inline-block;
  position: relative;
  vertical-align: top;
  top: 20px;
  margin-left: 20px;
}

.days-start {
  display: inline-block;
}
</style>
