<template>
  <Card class="test-mode" @click="toggleTestMode">
    <div class="button-container">
      <div>{{ $t('test_maju_title') }}</div>
      <toggle-button
        class="jelly"
        @change="toggleTestMode"
        :value="settings.testMode"
        :sync="true"
        :labels="{ checked: 'On', unchecked: 'Off' }"
      />
    </div>
    <div>{{ $t('test_maju') }}</div>
  </Card>
</template>
<script>
import Card from '../components/Card'
import ToggleButton from './ToggleButton'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    Card,
    ToggleButton,
  },
  computed: {
    ...mapState(['settings']),
  },
  methods: {
    ...mapActions(['toggleTestMode']),
  },
}
</script>
<style lang="less" scoped>
.test-mode {
  border: 1px solid green;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-items: stretch;
  text-align: center;
  font-size: 1.2em;

  .button-container {
    width: 400px;
    margin-right: 30px;
    font-size: 1em;
    font-weight: bold;
  }
}
</style>
