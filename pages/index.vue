<template>
  <div class="home">
    <PollForm :scrollToFAQ="scrollToFAQ" />
    <TestMode />
    <Card class="instructions" ref="instructions">
      <div>{{ $t('home.instruction_create') }}</div>
      <div>{{ $t('home.instruction_share') }}</div>
      <div>{{ $t('home.instruction_analyze') }}</div>
    </Card>
    <Card class="faq">
      <h2>{{ $t('home.faq_title') }}</h2>
      <div v-html="$t('faq_html_content')"></div>
    </Card>
    <div class="languages-label"></div>
  </div>
</template>

<script>
import Card from '../components/Card'
import PollForm from '../components/PollForm'
import TestMode from '../components/TestMode'
import NoSsr from 'vue-no-ssr'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    Card, PollForm, TestMode
  },
  methods: {
    ...mapActions(['toggleTestMode']),
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
        { name: 'description', content: 'Create your majority judgment poll in seconds !' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Create your majority judgment poll in seconds !' },
        { name: 'twitter:description', content: 'The best way to create polls that really reflects people opinions.' },
        { name: 'twitter:image', content: 'https://maju.app/logo.png' },
        { name: 'twitter:site', content: '@maju_app'},
        //facebook
        { property: 'og:url', content: 'https://maju.app' },
        { property: 'og:title', content: 'Create your majority judgment poll in seconds !' },
        { property: 'og:description', content: 'The best way to create polls that really reflects people opinions.' },
        { property: 'og:image', content: 'https://maju.app/logo.png' },
      ]
    }
  }
}
</script>

<style lang="less">
.home {
  .instructions {
    display: flex;
    justify-content: space-evenly;
    div {
      margin-right: 5px;
    }
  }
  .faq {
    margin-bottom: 100px;

    img {
      width: 100%;
      background-color: yellow;
    }
  }
}
</style>

