<template>
  <div class="time-input">
    <div class="chevron up">
      <font-awesome-icon
        icon="chevron-up"
        @click="increment">
      </font-awesome-icon>
    </div>
    <div>
      {{value}}
    </div>
    <div class="chevron down">
      <font-awesome-icon
        icon="chevron-down"
        @click="decrement">
      </font-awesome-icon>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    max: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    ctrlStep: {
      type: Number,
      default: 5
    },
    startValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      value: this.$props.startValue
    }
  },
  methods: {
    increment(event) {
      const delta = this.max - this.min
      const stepValue = event.ctrlKey ? this.ctrlStep : this.step
      this.value = this.value + stepValue > this.max ? this.value + stepValue - delta - 1 : this.value + stepValue
      this.$emit('changed', this.value)
    },
    decrement(event) {
      const delta = this.max - this.min
      const stepValue = event.ctrlKey ? this.ctrlStep : this.step
      this.value = this.value - stepValue < this.min ? this.value - stepValue + delta + 1 : this.value - stepValue
      this.$emit('changed', this.value)
    }
  }
}
</script>
<style lang="less" scoped>
.time-input {
  display: inline-block;
  position: relative;
  user-select: none;
  // bottom: -1.5em;
  width: 20px;
  text-align: center;
  .chevron {
    position: absolute;
    width: 100%;
    cursor: pointer;

    &.up {
      top: -1em;
    }

    &.down {
      top: 1em;
    }
  }
}
</style>
