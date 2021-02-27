<template>
  <div class="option-vote-form" :key="name">
    <div class="option-name">{{ name }}</div>
    <div class="boxes-container">
      <VoteBox
        v-for="(color, index) in colors"
        :key="index"
        @click="updateSelectedValue"
        :isSelected="selectedValue === index"
        :color="color"
        :index="index"
        :name="name"
      />
    </div>
  </div>
</template>

<script>
import gradientColors from '../lib/gradientColors'
import VoteBox from './VoteBox.vue'

export default {
  props: {
    name: String,
    selectedValue: Number,
    updateSelectedValue: Function
  },
  components: {
    VoteBox,
  },
  data() {
    return {
      colors: gradientColors
    }
  }
}
</script>

<style lang="less" scoped>
.option-vote-form {
  border-bottom: 2px solid darkgray;
  border-radius: 10px;
  padding-top: 5px;
  &:first-child {
    border-top: 1px solid lightgray;
  }

  .option-name {
    position: relative;
    font-size: 1em;
    float: none;
    text-align: left;
    padding: 5px;
    padding-left: 15px;
    width: auto;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .boxes-container {
    margin-bottom: 10px;
    display: grid;
    overflow: hidden;
    grid-auto-rows: minmax(50px, auto);
    grid-template-columns: repeat(6 1fr);
  }
}
</style>
