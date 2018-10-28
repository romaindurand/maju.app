<template>
  <div class="option-vote-form" :key="name">
    <div class="option-name">{{ name }}</div>
    <div class="boxes-container">
      <div
        class="box"
        v-for="(color, index) in colors"
        :key="index"
        :title="$t('maju_ranks')[index].toString()"
        :style="{
          width: selectedValue === index ? '60px' : null,
          fontSize: selectedValue === index ? '0.7em' : '0.6em',
          fontWeight: selectedValue === index ? 'bold' : 'normal',
          backgroundColor: selectedValue === index ? color.toHexString(): color.clone().lighten(40).toHexString(),
          gridColumn: index + 1,
          boxShadow: selectedValue === index ? `0 0 10px ${color.toHexString()}`: ''
        }"
        @click="() => updateSelectedValue(name, index)">
        {{ $t('maju_ranks')[index].toString() }}
      </div>
    </div>
  </div>
</template>

<script>
import tinygradient from 'tinygradient'

export default {
  props: {
    name: String,
    selectedValue: Number,
    updateSelectedValue: Function
  },
  data() {
    return {
      colors: tinygradient(['#ff0000', '#33dd33']).hsv(6)
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
.box {
  color: black;
  height: 30px;
  width: 45px;
  cursor: pointer;
  margin: auto;
  border: 1px solid lightgray;
  padding-top: 15px;
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: width 400ms ease-in-out, font-size 400ms ease-in-out, background-color 400ms ease-in-out;
  @media screen and (max-width: 340px) {
    width: 30px;
  }
}
</style>
