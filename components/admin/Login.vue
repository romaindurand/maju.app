<template>
  <Card class="login">
    <h1>Administration Panel</h1>
    <div>Admin password</div>
    <form @submit.prevent="handlePasswordSubmit">
      <input type="password" v-model="password" autoFocus>
      <button>Log in</button>
    </form>
    <vue-recaptcha
      ref="recaptcha"
      @verify="postFormData"
      @expired="onExpired"
      size="invisible"
      :sitekey="recaptchaSiteKey">
    </vue-recaptcha>
  </Card>
</template>
<script>
import Card from '../Card'
import cookies from '../../lib/cookies'
import { mapActions, mapState } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'

export default {
  components: {Card, VueRecaptcha},
  data() {
    return {
      password: '',
      recaptchaSiteKey: process.env.RECAPTCHA_SITEKEY,
    }
  },
  props: ['onLoggedIn'],
  methods: {
    ...mapActions(['notifyError']),
    handlePasswordSubmit() {
      if (process.env.isProduction) return this.$refs.recaptcha.execute()
      this.postFormData()
    },
    async postFormData (token) {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          password: this.password,
          token
        })
      });
      const body = await response.json()
      if (response.status !== 200) {
        return this.notifyError({ message: body.message, duration: 5000 })
      }
      this.onLoggedIn(body.token)
    },
    onExpired: function () {
      // console.log('Expired')
    },
  }
}
</script>
