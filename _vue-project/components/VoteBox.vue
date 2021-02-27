<template>
  <div
    class="vote-box"
    :title="$t('maju_ranks')[index].toString()"
    :style="{
      width: isSelected ? '65px' : null,
      fontSize: isSelected ? '0.7em' : '0.6em',
      fontWeight: isSelected ? 'bold' : 'normal',
      backgroundColor: isSelected ? color : lightenColor(color),
      gridColumn: index + 1,
      border: `1px solid ${isSelected ? color : 'lightgray'}`,
      boxShadow: isSelected ? `0 0 10px ${color}`: ''
    }"
    @click="clickHandler">
    {{ $t('maju_ranks')[index].toString() }}
  </div>
</template>
<script>
import tinycolor from 'tinycolor2'

export default {
  props: ['isSelected', 'index', 'name', 'color'],
  methods: {
    lightenColor(color) {
      return tinycolor(color).setAlpha(0.5).toString()
    },
    clickHandler() {
      this.$emit('click', this.name, this.index)
    }
  }
}
</script>

<style lang="less" scoped>
.vote-box {
  color: black;
  height: 30px;
  width: 50px;
  cursor: pointer;
  margin: auto;
  padding-top: 15px;
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: width 400ms ease-in-out, font-size 400ms ease-in-out, background-color 400ms ease-in-out;
  @media screen and (max-width: 390px) {
    width: 30px;
  }
}
</style>
