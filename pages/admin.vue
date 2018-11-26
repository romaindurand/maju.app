<template>
  <div>
    <Card class="login" v-if="!authToken">
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
    <Card class="admin" v-if="loggedIn">
      <div class="tools">
        <div class="filters">
          <span
            v-for="(sort, index) in ['alphabetical', 'date', 'votes']"
            :key="index"
            @click="sortPolls(sort)">
            {{ sort }}
          </span>
        </div>
        <div>
          <input type="text" placeholder="filter" v-model="filter" />
        </div>
      </div>
      <Card class="poll-item"
        v-for="(poll, index) in filteredPolls"
        :key="index">
        <div class="header">
          <div class="vote-count">{{ poll.voteCount }} 🗳️</div>
          <div class="question"><span>{{ poll.question }}</span></div>
          <nuxt-link class="poll-id" :to="`/${poll.uid}`" target="_blank">
            &lt;{{ poll.uid }}&gt;
          </nuxt-link>
        </div>
        <div class="options">
          <span
            class="option"
            v-for="(option, optionIndex) in poll.options"
            :key="optionIndex">{{option}}</span>
        </div>
        <div class="footer">
          <button @click="() => deletePoll(poll)">delete ❌</button>
        </div>
      </Card>
    </Card>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'
import Card from '../components/Card'
import cookies from '../lib/cookies'
import pollsSort from '../lib/pollsSort'

export default {
  components: { Card, VueRecaptcha },
  async asyncData({ app }) {
    try {
      const { polls } = await app.$axios.$get(`/api/admin/polls`)
      const sortedPolls = polls.sort(pollsSort.alphabetical)
      const authToken = cookies(app.$cookies).getAuthToken()
      return {
        loggedIn: true,
        authToken,
        polls: sortedPolls
      }
    } catch (ex) {
      return {
        loggedIn: false,
        polls: null,
        authToken: null,
      }
    }
  },
  data() {
    return {
      filter: '',
      password: '',
      recaptchaSiteKey: process.env.RECAPTCHA_SITEKEY,
    }
  },
  computed: {
    ...mapState(['isProduction']),
    filteredPolls() {
      if (!this.polls) return []
      return this.polls.filter(poll => {
        if (poll.uid.includes(this.filter)) return true
        if (poll.question.includes(this.filter)) return true
        if (poll.options.some(option => option.includes(this.filter)))
          return true
        return false
      })
    }
  },
  methods: {
    ...mapActions(['notifyError']),
    handlePasswordSubmit() {
      if (this.isProduction) return this.$refs.recaptcha.execute()
      this.postFormData()
    },
    async fetchPolls() {
      const {polls} = await this.$axios.$get(`/api/admin/polls`)
      this.polls = polls.sort(pollsSort.alphabetical)
    },
    sortPolls(sort) {
      this.polls = this.polls.sort(pollsSort[sort])
    },
    async deletePoll(poll) {
      const confirm = window.confirm(`Are you sure you want to delete this poll '${poll.question}' and its ${poll.voteCount} votes ?`)
      if (!confirm) return
      const deleteResponse = await this.$axios.delete(`/api/admin/poll/${poll.uid}`)
      this.fetchPolls()
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
      this.loggedIn = true
      this.fetchPolls()
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

  .tools {
    margin-bottom: 50px;
    .filters {
      display: flex;
      justify-content: space-evenly;
      margin-bottom: 20px;
      span {
        border: 1px solid black;
        cursor: pointer;
        border-radius: 5px;
        padding: 5px;
        &:hover {
          border: 1px solid greenyellow;
        }
      }
    }
    input[type="text"] {
      width: 100%;
      border-radius: 5px;
      border: 1px solid lightgray;
      padding: 5px;
      outline: none;
    }
  }
}
.poll-item {
  margin: 10px;
  padding: 10px;
  max-width: 100%;

  .footer {
    max-width: 100%;
    display: flex;
    justify-content: space-between;

    button {
      background-color: transparent;
      border: 1px solid black;
      cursor: pointer;
      height: 30px;
      margin: 5px;
      border-radius: 5px;
    }
  }

  .header {
    max-width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid lightgray;
    margin-bottom: 5px;
    padding-bottom: 5px;

    .vote-count {
      flex: 0;
      white-space: nowrap;
      margin-right: 10px;
    }
    .question {
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: bold;
    }
    .poll-id {
      flex: 0;
      text-decoration: none;
      color: black;
      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .option {
    display: inline-block;
    padding: 3px 5px;
    margin: 3px;
    border-radius: 3px;
    border: 1px solid lightgray;
  }
}
</style>
