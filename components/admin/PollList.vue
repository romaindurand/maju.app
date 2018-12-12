<template>
  <Card class="admin">
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
        <div class="vote-count">{{ poll.date }}</div>
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
</template>
<script>
import Card from '../Card'
import pollsSort from '../../lib/pollsSort'

export default {
  components: { Card },
  data() {
    return {
      filter: '',
    }
  },
  props: ['polls', 'fetchData'],
  computed: {
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
    sortPolls(sort) {
      this.polls = this.polls.sort(pollsSort[sort])
    },
    async deletePoll(poll) {
      const confirm = window.confirm(`Are you sure you want to delete this poll '${poll.question}' and its ${poll.voteCount} votes ?`)
      if (!confirm) return
      const deleteResponse = await this.$axios.delete(`/api/admin/poll/${poll.uid}`)
      this.fetchData()
    }
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
}
</style>
