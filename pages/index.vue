<template>
  <div>
    <PollForm />
    <Card class="instructions">
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

