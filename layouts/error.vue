<template>
  <div class="container">
    <Card class="not-found">
      <h1 v-if="error.statusCode === 404">{{ $t('404_title') }}</h1>
      <h1 v-else>An error occurred</h1>
    </Card>
  </div>
</template>

<script>
import Card from '../components/Card'

export default {
  components: { Card },
  props: ['error'],
}
</script>
<style lang="less" scoped>
.not-found {
  text-align: center;
}
</style>