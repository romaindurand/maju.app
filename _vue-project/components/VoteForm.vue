<template>
  <Card class="vote-form">
    <div v-if="poll.question" class="question">{{ poll.question }}</div>
    <no-ssr v-if="poll.endDate && !poll.hasEnded && canVote">
      <span class="end">{{ $t('poll_ends_in') }}</span>
      <Countdown
        :end="poll.endDate"
        @finished="refreshResults"
        :i18n="$t('countdown')"/>
    </no-ssr>
    <div v-if="canVote && !poll.hasEnded" ref="optionsList" class="options-list">
      <OptionVoteForm
        v-for="(option, index) in poll.options"
        :name="option"
        :selectedValue="selectedValues[option]"
        :key="index"
        :updateSelectedValue="updateSelectedValue"
      />
      <div v-if="!isVoteValid" class="instructions">{{ $t('vote.instructions') }}</div>
      <button class="vote-button jelly"
        v-if="isVoteValid"
        @click="handleVoteClick">
        {{ $t('vote_button') }}
      </button>
      <vue-recaptcha
        ref="recaptcha"
        @verify="postFormData"
        @expired="onExpired"
        size="invisible"
        :sitekey="recaptchaSiteKey">
        </vue-recaptcha>
    </div>
    <div v-if="!canVote && !poll.hasEnded">
      <div v-if="poll.settings.testMode" @click="reloadPage">
        <div>{{ $t('has_voted_test_mode')[0] }}</div>
        <div class="test-refresh">
          {{ $t('has_voted_test_mode')[1] }}
        </div>
      </div>
      <div v-else>
        {{ $t('has_voted') }}
      </div>
    </div>
    <div v-if="poll.hasEnded" class="end">
      {{ $t('has_ended') }}
    </div>
  </Card>
</template>

<script>
import Countdown from 'vuejs-countdown'
import NoSsr from 'vue-no-ssr'
import VueRecaptcha from 'vue-recaptcha'
import Card from '../components/Card'
import OptionVoteForm from './OptionVoteForm'
import voteAuth from '../lib/voteAuth'
import slide from '../lib/slide'
import { mapActions, mapState } from 'vuex'

export default {
  components: { Card, OptionVoteForm, VueRecaptcha, Countdown, NoSsr },
  props: {
    poll: Object,
    refreshResults: Function
  },
  data() {
    const selectedValues = this.$props.poll.options.reduce((memo, option) => ({...memo, [option]: null}), {})
    return {
      selectedValues,
      canVote: false,
      recaptchaSiteKey: process.env.RECAPTCHA_SITEKEY
    }
  },
  mounted() {
    const hasVoted = voteAuth(this.$cookies).hasVoted(this.$props.poll.id)
    this.canVote = !hasVoted
  },
  methods: {
    ...mapActions(['notifyError']),
    updateSelectedValue (optionName, value) {
      this.selectedValues = Object.assign({}, this.selectedValues, { [optionName]: value })
    },

    handleVoteClick () {
      if (process.env.isProduction && !this.poll.settings.testMode) {
        this.$refs.recaptcha.execute()
      } else {
        this.postFormData()
      }
    },

    async postFormData (token) {
      const Fingerprint2 = require('fingerprintjs2')
      new Fingerprint2().get(async fingerprint => {
        const response = await fetch(`/api/vote/${this.poll.id}`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            vote: this.selectedValues,
            fingerprint,
            token
          })
        });
        const body = await response.json()
        if (response.status !== 200) {
          switch(response.status) {
            case 410:
              this.poll.hasEnded = true
            break
          }
          return this.notifyError({ message: body.message, duration: 5000 })
        }

        await slide.up(this.$refs.optionsList, 400)

        this.canVote = false
        this.refreshResults()
        if (this.poll.settings.testMode) return;
        voteAuth(this.$cookies).setVote(this.poll.id)
      })
    },

    reloadPage: () => window.location.reload(),

    onExpired: function () {
      // console.log('Expired')
    },
  },
  computed: {
    isVoteValid () {
      return Object.values(this.selectedValues).every(value => value !== null)
    }
  }
}
</script>

<style lang="less" scoped>
.vote-form {
  text-align: center;

  .question {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .instructions {
    font-size: 1.2em;
    margin-top: 20px;
    color: green;
  }

  .test-refresh {
    cursor: pointer;
    font-weight: bolder;
    color: green;
  }

  .end {
    margin-top: 10px;
    font-style: oblique;
    font-weight: lighter;
  }

  .options-list {
    margin-top: 20px;
    overflow: hidden;
  }

  .vote-button {
    position: relative;
    left: 10px;
    font-size: 1.5em;
    background-color: #00aa00;
    border-radius: 5px;
    color: white;
    border: 1px solid #00ff00;
    padding: 5px 20px;
    cursor: pointer;
    margin-top: 10px;
  }
}
</style>
