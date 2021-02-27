<template>
  <div>
    <div class="wip">
      <img v-if="!open" @click="() => open = true" src="/wip.png" alt="Work in progress">
      <div v-if="open" class="open">
        <font-awesome-icon
          icon="times-circle"
          class="close"
          @click="() => open = false"
        />
        <div v-html="$t('wip')"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<style lang="less" scoped>
.wip {
  position: fixed;
  left: -5px;
  bottom: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 5px gray;
  padding: 5px;
  max-width: 200px;
  font-size: 0.8em;

  img {
    width: 50px;
    cursor: pointer;
  }

  .open {
    position: relative;
    padding: 5px;

    .close {
      position: relative;
      top: 0;
      right: -180px;
      cursor: pointer;

      &:hover {
        color: red;
      }
    }
  }

}
</style>
