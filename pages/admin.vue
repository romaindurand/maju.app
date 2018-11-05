<template>
  <div>
    <Card class="login" v-if="!authToken">
      <h1>Administration Panel</h1>
      <div>Admin password</div>
      <form @submit.prevent="handlePasswordSubmit">
        <input type="password" v-model="password">
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
    <Card class="admin" v-if="authToken">logged in</Card>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'
import Card from '../components/Card'
import cookies from '../lib/cookies'

export default {
  components: { Card, VueRecaptcha },
  async asyncData({ app }) {
    return {
      authToken: cookies(app.$cookies).getAuthToken()
    }
  },
  data() {
    return {
      password: '',
      recaptchaSiteKey: process.env.RECAPTCHA_SITEKEY
    }
  },
  computed: {
    ...mapState(['isProduction']),
  },
  methods: {
    ...mapActions(['notifyError']),
    handlePasswordSubmit() {
      if (this.isProduction) {
        return this.$refs.recaptcha.execute()
      }
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
      cookies(this.$cookies).setAuth(body.token)
      this.authToken = body.token

    },
    onExpired: function () {
      // console.log('Expired')
    },
  }
}
</script>
<style lang="less" scoped>
.admin {
  max-width: 85%;
}
</style>
