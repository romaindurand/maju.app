<template>
  <div class="option-result">
    <div class="ranking-index">{{ rank + 1 }}.</div>
    <div class="ranking-name">{{ name }}</div>

    <div class="result-container">
      <div class="median-bar"></div>
      <div
        class="tooltip"
        :style="{
          left: tooltipLeft,
          backgroundColor: lightenColor(colors[tooltipIndex]),
          width: formatRatio(ratios[tooltipIndex], 6),
          opacity: tooltipVisible ? 1 : 0,
          pointerEvents: tooltipVisible ? 'all' : 'none'
        }"
        @click="() => clickHandler(null)">
        {{ formatRatio(ratios[tooltipIndex], 5) }}
        {{ $t('result_details')[0] }}
        <i>{{ name }}</i>
        {{ $t('result_details')[1] }}
        <i>{{ ranks[tooltipIndex] }}</i>
      </div>
      <div
        class="ratio"
        v-for="(ratio, index) in ratios"
        :key="index"
        :style="{
          // display: ratio > 0 ? 'block' : 'none',
          backgroundColor: colors[index],
          border: ratio ? `2px outset ${colors[index]}` : 'none',
          width: `${(ratio*100).toFixed(3)}%`
        }"
        @click="() => clickHandler(index)"
      >
        {{ ratio && ratio > 0.07 ? formatRatio(ratio) : '' }}
      </div>
    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script>
import gradientColors from '../lib/gradientColors'
import tinycolor from 'tinycolor2'
export default {
  data() {
    return {
      tooltipIndex: null,
      ranks: this.$t('maju_ranks'),
      tooltipVisible: false,
      colors: gradientColors
    }
  },
  props: ['rank', 'name', 'ratios'],
  computed: {
    tooltipLeft() {
      const left = this.ratios.reduce((memo, ratio, index) => {
        if (index < this.tooltipIndex) memo += ratio;
        return memo;
      }, 0)
      return this.formatRatio(Math.min(left, 0.7))
    }
  },
  methods: {
    formatRatio(ratio, precision = 4) {
      return `${String(ratio * 100).substr(0, precision)}%`;
    },
    clickHandler(index) {
      this.tooltipIndex = index === null ? this.tooltipIndex : index
      this.tooltipVisible = index === null ? false : true
    },
    lightenColor(color) {
      const myColor = tinycolor(color).lighten(10).toString()
      return myColor
    }
  }
}
</script>


<style lang="less" scoped>
.option-result {
  width: calc(100% - 50px);
  margin-bottom: 10px;
  margin-left: 10px;

  .ranking-index {
    position: absolute;
    text-align: left;
  }

  .ranking-name {
    font-weight: bold;
    margin-left: 30px;
    text-align: left;
    width: calc(100% - 70px);
  }

  .result-container {
    position: relative;
    margin-left: 30px;
    margin-top: 10px;
    width: 100%;
    height: 30px;
    white-space: nowrap;

    .ratio {
      white-space: normal;
      height: 30px;
      display: inline-block;
      vertical-align: bottom;
      font-size: 0.9em;
      padding-top: 2px;
      cursor: pointer;
      box-sizing: border-box;
      transition: all 1s ease-in-out;
    }

    .tooltip {
      white-space: normal;
      box-sizing: border-box;
      position: absolute;
      cursor: pointer;
      border-radius: 5px;
      padding: 10px;
      // top: -50%;
      transform: translateY(-33%);
      z-index: 10;
      box-shadow: 0 0 10px black;
      min-width: 200px;
      transition: opacity 400ms ease-in-out, left 400ms ease-in-out, background-color 400ms ease-in-out;
      i {
        font-weight: bold;
        font-style: normal;
      }
      @media screen and (max-width: 750px) {
        left: calc(50% - 150px) !important;
        width: 300px !important;
        margin: auto;
      }
    }
  }

  .median-bar {
    width: 1px;
    left: calc(50% - 1px);
    height: 30px;
    background-color: black;
    position: absolute;
    pointer-events: none;
  }
}
</style>
