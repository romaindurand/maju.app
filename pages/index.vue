<template>
  <div>
    <PollForm :scrollToFAQ="scrollToFAQ" />
    <Card class="instructions" ref="instructions">
      <div>{{ $t('home.instruction_create') }}</div>
      <div>{{ $t('home.instruction_share') }}</div>
      <div>{{ $t('home.instruction_analyze') }}</div>
    </Card>
    <Card class="faq">
      <h2>{{ $t('home.faq_title') }}</h2>
    </Card>
    <div class="languages-label"></div>
  </div>
</template>

<script>
import Card from '../components/Card'
import PollForm from '../components/PollForm'
export default {
  components: {
    Card, PollForm
  },
  methods: {
    scrollToFAQ() {
      const instructions = this.$refs.instructions.$el
      if (typeof instructions.scrollIntoView !== 'function') return;
      event.preventDefault();
      instructions.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  },
  head () {
    return {
      title: 'maju - Let\'s make better choices together !',
      meta: [
        { name: 'description', content: 'Create your majority judgment poll in seconds !' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.instructions {
  display: flex;
  justify-content: space-evenly;
  div {
    margin-right: 5px;
  }
}
.faq {
  margin-bottom: 1500px;
}
</style>

