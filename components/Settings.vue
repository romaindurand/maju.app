<template>
  <div class="settings">
    <div class="settings-header" @click="toggle">
      <span class="fold-arrow"><font-awesome-icon :icon="foldArrow"/></span>{{ $t('more_options') }}
    </div>
    <div v-show="open" ref="settingsContainer">
      <div class="settings-container">
        <div class="setting-item">
          <span class="setting-title">{{ $t('settings.end_date') }} : {{ formatedEndDate }}</span>
          <div class="end-date">
            <datepicker
              @selected="updateEndDate"
              @opened="scrollToDatepicker"
              :monday-first="$i18n.locale !== 'en'"
              ref="endDatepicker"
              :language="datepickerLanguage"
              :disabledDates="disabledFn"
              :placeholder="$t('settings.select_end_date')"
              format="dd MMMM yyyy"
              class="datepicker"
            />
            <div v-if="endDate" class="end-time">
              <time-input
                :start-value="endTime[0]"
                :max="23"
                :ctrl-step="10"
                @changed="endHourChanged"
              />:
              <time-input
                :start-value="endTime[1]"
                :max="59"
                :step="5"
                :ctrl-step="1"
                @changed="endMinuteChanged"/>
            </div>
            <font-awesome-icon
              icon="times-circle"
              class="reset"
              @click="resetEndDate"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker'
import TimeInput from './TimeInput'
import slide from '../lib/slide'
import { fr, en } from '../node_modules/vuejs-datepicker/dist/locale'
import { formatRelative } from 'date-fns'
import dateFnsFr from 'date-fns/locale/fr'
import dateFnsEn from 'date-fns/locale/en-US'

export default {
  components: {
    Datepicker,
    TimeInput
  },
  data() {
    return {
      endDate: null,
      open: false,
      endTime: [23, 55, 59],
      disabledFn: {
        customPredictor(date) {
          // disable dates before current date
          return +date < (+new Date() - (360000 * 24))
        }
      }
    }
  },
  methods: {
    scrollToDatepicker() {
      this.$refs.endDatepicker.$el
      const endDatepicker = this.$refs.endDatepicker.$el
      if (typeof endDatepicker.scrollIntoView !== 'function') return;
      event.preventDefault();
      endDatepicker.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
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
      this.endDate = null
      this.$store.commit('SET_SETTINGS', { endDate: null })
    },
    endHourChanged (value) {
      this.endTime[0] = value
      this.updateEndDate(this.endDate)
    },
    endMinuteChanged (value) {
      this.endTime[1] = value
      this.updateEndDate(this.endDate)
    },
    updateEndDate (date) {
      this.endDate = new Date(date.setHours(...this.endTime))
      this.$store.commit('SET_SETTINGS', { endDate: this.endDate })
    }
  },
  computed: {
    datepickerLanguage() {
      return { fr, en }[this.$i18n.locale]
    },
    foldArrow() {
      return this.open ? 'chevron-down' : 'chevron-right'
    },
    formatedEndDate() {
      if (!this.endDate) return this.$t('settings.no_end_date')
      const locale = {
        fr: dateFnsFr,
        en: dateFnsEn
      }[this.$i18n.locale]
      return formatRelative(this.endDate, new Date(), { locale })
    }
  }
}
</script>

<style lang="less" scoped>
.settings {
  text-align: left;

  .end-date {
    display: flex;
    justify-content: space-evenly;
  }

  .end-time {
    display: inline-block;
  }

  .settings-container {
    margin: 10px 20px;

    .setting-item {
      border: 1px solid lightgrey;
      border-radius: 5px;
      padding: 20px;
      margin-bottom: 10px;

      .datepicker {
        input {
          text-align: center;
        }
        display: inline-block;
        margin-right: 10px;
      }

      .setting-title {
        font-size: 1.1em;
        display: block;
        margin-bottom: 20px;
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
