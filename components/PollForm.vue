<template>
  <Card class="poll-form">
    <form @submit="handleSubmit">
      <h2>
        {{ $t('home.title').split('{maju}')[0] }}
        <a href="#faq" @click.prevent="handleMajuClick">{{ getMajuTitle(majuTitleStep) }}</a>
        {{ $t('home.title').split('{maju}')[1] }}
      </h2>
      <input
        v-model="question"
        @change="updatePreventReload"
        autoFocus
        type="text"
        :placeholder="$t('home.question_placeholder')"
        className="drop"
        autoComplete="off"/>
      <h2>{{ $t('home.options_title') }}</h2>
      <ol>
        <li v-for="(option, i) in options" :key="i" class="drop">
          <input
            autoComplete="off"
            :value="options[i]"
            type="text"
            :placeholder="$t('home.option_placeholder')"
            @change="event => updateOption(i, event)"
            @focus="event => handleOptionClick(i)"/>
        </li>
      </ol>
      <!-- <Settings ref={this.settings}/> -->
      <div class="submit-container">
        <button :class="error ? 'error' : ''">{{ $t('create_poll_button') }}</button>
        <div v-if="error" className="error">{{ error }}</div>
        <div style="clear: 'both'"></div>
      </div>
        <vue-recaptcha
          ref="recaptcha"
          @verify="postFormData"
          @expired="onExpired"
          size="invisible"
          :sitekey="recaptchaSiteKey">
        </vue-recaptcha>
    </form>
  </Card>
</template>
<script>
import Card from './Card'
import VueRecaptcha from 'vue-recaptcha'

const FINAL_TITLE_INDEX = 19

export default {
  components: {
    Card, VueRecaptcha
  },
  data() {
    return {
      error: null,
      question: '',
      options: ['', '', ''],
      recaptchaSiteKey: process.env.RECAPTCHA_SITEKEY,
      majuTitleStep: 5,
      moreOptions: false,
      endDate: null,
    }
  },
  computed: {
    isProduction() {
      return process.env.NODE_ENV === 'production'
    }
  },
  methods: {
    onExpired: function () {
      // console.log('Expired')
    },

    handleOptionClick(i) {
      this.error = null
      if (i === this.options.length - 1) {
        this.options = this.options.slice().concat([''])
      }
    },

    updateOption(index, event) {
      const options = this.options.slice()
      options[index] = event.target.value
      this.options = options

      this.updatePreventReload()
    },

    updatePreventReload() {
      const hasOptions = this.options.filter(option => option !== '').length !== 0
      const hasQuestion = this.question !== ''
      if (!hasOptions && !hasQuestion) {
        this.$store.commit('SET_PREVENT_RELOAD', false)
      } else {
        this.$store.commit('SET_PREVENT_RELOAD', true)
      }
    },

    getMajuTitle (index) {
      const majority = 'majority '
      const judgement = 'judgement'
      return majority.substr(0, Math.floor(index / 2))
        + judgement.substr(0, Math.floor((index - 1) / 2))
    },

    handleMajuClick (event) {
      if (this.majuTitleStep < FINAL_TITLE_INDEX) {
        this.majuInterval = window.setInterval(() => {
          if (this.majuTitleStep < FINAL_TITLE_INDEX)
            this.majuTitleStep = this.majuTitleStep + 1
          else window.clearInterval(this.majuInterval)
        }, 70)
      } else {
        const faq = document.getElementById('faq')
        if (typeof faq.scrollIntoView !== 'function') return;
        event.preventDefault();
        faq.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    },

    handleSubmit(event) {
      event.preventDefault();
      if (this.getOptions().length < 2)
        return this.notifyError('Give two different options or more.', 5000)

      if (this.isProduction) {
        this.$refs.recaptcha.execute()
      } else {
        this.postFormData()
      }
    },

    getOptions() {
      return this.options
        .filter(option => option !== '')
        .reduce((memo, option) =>
          memo.includes(option) ? memo : [...memo, option], [])
    },

    getSettings() {
      return {}
      // return this.settings.current.getSettings()
    },

    async postFormData (token) {
      // const token = this.isProduction ? this.recaptcha.getResponse() : null;
      const response = await fetch('/api/new', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          question: this.question,
          options: this.getOptions(),
          settings: this.getSettings(),
          token
        })
      });
      const body = await response.json();
      if (response.status !== 200) {
        return this.notifyError(body.message, 5000)
      }
      this.$store.commit('SET_PREVENT_RELOAD', false)
      this.$router.push({
        path: `/${body.uid}`
      })
    }
  }
}
</script>
<style lang="less" scoped>
.poll-form {
  text-align: center;
  .hidden {
    display: none;
  }
  .submit-container {
    text-align: left;
    button {
      margin-left: 20px;
      margin-top: 20px;
      background-color: green;
      border: 1px solid lightgray;
      font-size: 20px;
      padding: 5px 20px;
      font-family: 'Open Sans', sans-serif;
      color: white;
      cursor: pointer;
      transition: background-color 400ms;
      &.error {
        float: left;
        background-color: red;
      }
    }
  }
  div.error {
    float: left;
    margin: 25px 0 0 25px;
    color: darkred;
  }
  .more-options {
    user-select: none;
    text-align: left;
    cursor: pointer;
    &:hover {
      font-weight: bold;
    }
    i {
      margin: 5px;
    }
  }

  input[type='text'] {
    font-size: 22px;
    border-radius: 10px;
    padding: 10px;
    border: 2px solid lightgray;
    width: calc(100% - 30px);
    &:focus {
      outline: none;
      border: 2px solid green;
    }
  }
  h2 a {
    user-select: none;
    font-size: 25px;
    font-style: normal;
    color: green;
    text-decoration: none;
  }
  ol {
    input[type='text'] {
      border: none;
      &:focus {
        border: none;
      }
    }
  }
}
</style>
