<template>
  <header>
    <a href="/">
      <img src="/logo.png" alt="Maju Poll Logo"/>
      <h1>maju</h1>
    </a>
    <div class="flags">
      <div
        class="language"
        v-for="el in locales"
        :key="el.code"
        :class="{ active: (el.code === locale) }"
        @click="switchLanguage(el.code)"
      >
        <img :src="`/${el.name}.svg`" :alt="el.name"/>
      </div>
    </div>
    <div class="error drop" v-if="error">
      <div>
        {{ error }}
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['locale', 'locales', 'preventLanguageReload', 'error'])
  },
  methods: {
    switchLanguage (localeCode) {
      document.cookie = `locale=${localeCode}`;
      if (this.preventLanguageReload) {
        if (!window.confirm(this.$t(`confirm_reload.${localeCode}`))) return
      }
      location.reload()
    }
  }
}
</script>


<style lang="less" scoped>
header {
  top: 0px;
  width: 100%;
  position: fixed;
  z-index: 100;
  background-color: white;
  height: 60px;
  box-shadow: 0 0 5px darkgray;
  border-bottom: 1px solid lightgray;

  .error {
    div {
      margin: auto;
      text-align: center;
      width : 380px;
    }
    width: 100%;
    padding: 10px;
    position: absolute;
    font-size: 1.1em;
    background-color: #faa;
    color: darkred;
  }

  div.flags {
    float: right;
    margin: 20px;
    div {
      margin: 5px;
      border: 1px solid lightgray;
      float: left;
      cursor: pointer;
      img {
        height: 20px;
        top: 0;
        left: 0;
      }
      &.active {
        display: none;
      }
    }
  }

  img {
    position: relative;
    top: 10px;
    left: 10px;
    height: 40px;
    float: left;
  }

  a {
    color: black;
    text-decoration: none;

    h1 {
      user-select: none;
      display: inline-block;
      font-size: 30px;
      margin-top: 7px;
      margin-left: 15px;
    }
  }
}
</style>
