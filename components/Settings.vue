<template>
  <div class="settings">
    <div class="settings-header" @click="toggle">
      <span class="fold-arrow"><font-awesome-icon :icon="foldArrow"/></span>{{ $t('more_options') }}
    </div>
    <div v-show="open" ref="settingsContainer">
      <div class="settings-container">
        <div class="setting-item">
          <span class="setting-title">{{ $t('settings.end_date') }}</span>
          <datepicker
            @selected="endDateSelected"
            :monday-first="$i18n.locale !== 'en'"
            ref="endDatepicker"
            :language="datepickerLanguage"
            :disabledDates="disabledFn"
            :placeholder="$t('settings.no_end_date')"
            format="dd MMMM yyyy - 23:59"
            class="datepicker"
          />
          <font-awesome-icon
            icon="times-circle"
            class="reset"
            @click="resetEndDate"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker'
import slide from '../lib/slide'
import { fr, en } from '../node_modules/vuejs-datepicker/dist/locale'

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      open: false,
      disabledFn: {
        customPredictor(date) {
          // disable dates before current date
          return +date < (+new Date() - (360000 * 24))
        }
      }
    }
  },
  methods: {
    endDateSelected(selectedDate) {
      selectedDate.setHours(23, 59, 59)
      this.$store.commit('SET_SETTINGS', { endDate: selectedDate })
    },
    async toggle() {
      if (this.open) {
          await slide.up(this.$refs.settingsContainer, 400)
        } else {
          await slide.down(this.$refs.settingsContainer, 400)
      }
      this.open = !this.open
    },

    resetEndDate () {
      this.$refs.endDatepicker.selectedDate = null
      this.$store.commit('SET_SETTINGS', { endDate: null })
    }
  },
  computed: {
    datepickerLanguage() {
      return {
        fr,
        en
      }[this.$i18n.locale]
    },
    foldArrow() {
      return this.open ? 'chevron-down' : 'chevron-right'
    }
  }
}
</script>

<style lang="less" scoped>

.settings {
  text-align: left;

  .settings-container {
    margin: 10px 20px;

    .setting-item {

      .datepicker {
        display: inline-block;
        margin-right: 10px;
      }

      .setting-title {
        font-size: 1.1em;
        display: block;
      }
  
      .reset {
        cursor: pointer;
  
        &:hover {
          color: red;
        }
      }
    }
  }
  

  .settings-header {
    cursor: pointer;
    user-select: none;

    .fold-arrow {
      font-size: 1.2em;
      margin: 5px;
    }
  }
  
}
</style>
