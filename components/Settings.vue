<template>
  <div class="settings">
    <div class="settings-header" @click="toggle">
      <i class="fold-arrow"><font-awesome-icon :icon="foldArrow"/></i>
      <span>{{ $t('more_options') }}</span>
    </div>
    <div v-show="open" ref="settingsContainer">
      <div class="settings-container">
        <div class="setting-item">
          <span class="setting-title"
            >{{ $t('settings.end_date') }} : {{ formatedEndDate }}</span
          >
          <div class="end-date">
            <no-ssr>
              <date-picker
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
            </no-ssr>
          </div>
          <div v-if="settings.endDate" class="end-time">
            <input
              type="time"
              @change="endTimeChanged"
              v-model="endTime"
              step="1"
              required
            />
          </div>
          <div>
            <span v-if="settings.endDate" class="reset" @click="resetEndDate">{{
              $t('settings.reset')
            }}</span>
          </div>
        </div>
        <div v-if="settings.endDate" class="setting-item">
          <label class="checkbox-label">
            <div>
              <toggle-button
                class="jelly"
                @change="hideResultsChanged"
                :value="settings.hideResults"
                :sync="true"
                :labels="{ checked: 'On', unchecked: 'Off' }"
              />
            </div>
            {{ $t('settings.results_visible_date') }}
          </label>
        </div>
        <div class="setting-item">
          <label class="checkbox-label">
            <div>
              <toggle-button
                class="jelly"
                @change="hideVoteCountChanged"
                :value="settings.hideVoteCount"
                :sync="true"
                :labels="{ checked: 'On', unchecked: 'Off' }"
              />
            </div>
            {{ $t('settings.hide_vote_count') }}
          </label>
        </div>
        <div class="setting-item">
          <label class="checkbox-label">
            <div>
              <toggle-button
                class="jelly"
                @change="testModeChanged"
                :value="settings.testMode"
                :sync="true"
                :labels="{ checked: 'On', unchecked: 'Off' }"
              />
            </div>
            {{ $t('settings.test_mode') }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ToggleButton from './ToggleButton'
import slide from '../lib/slide'
import { fr, en } from '../node_modules/vuejs-datepicker/dist/locale'
import { formatRelative } from 'date-fns'
import dateFnsFr from 'date-fns/locale/fr'
import dateFnsEn from 'date-fns/locale/en-US'
import { mapState } from 'vuex'
import NoSsr from 'vue-no-ssr'

export default {
  components: {
    ToggleButton,
    NoSsr,
  },
  data() {
    return {
      open: false,
      endTime: '23:59:59',
      disabledFn: {
        customPredictor(date) {
          // disable dates before current date
          return +date < +new Date() - 360000 * 24
        },
      },
    }
  },
  methods: {
    scrollToDatepicker() {
      this.$refs.endDatepicker.$el
      const endDatepicker = this.$refs.endDatepicker.$el
      if (typeof endDatepicker.scrollIntoView !== 'function') return
      event.preventDefault()
      endDatepicker.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
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

    resetEndDate() {
      this.$refs.endDatepicker.selectedDate = null
      this.endTime = '23:59:59'
      this.$store.commit('SET_SETTINGS', {
        endDate: null,
        hideResults: false,
      })
    },
    endTimeChanged(event) {
      this.updateEndDate(this.settings.endDate)
    },
    updateEndDate(date) {
      this.$store.commit('SET_PREVENT_RELOAD', true)
      const endTime = this.endTime.split(':')
      const newDate = new Date(
        date.setHours(endTime[0], endTime[1], endTime[2])
      )
      const shouldActivateHideResults = this.settings.endDate
        ? this.settings.hideResults
        : true
      this.$store.commit('SET_SETTINGS', {
        endDate: newDate,
        hideResults: shouldActivateHideResults,
      })
    },
    hideResultsChanged(event) {
      this.$store.commit('SET_SETTINGS', { hideResults: event.value })
    },
    hideVoteCountChanged(event) {
      this.$store.commit('SET_SETTINGS', { hideVoteCount: event.value })
    },
    testModeChanged(event) {
      this.$store.commit('SET_SETTINGS', { testMode: event.value })
    },
  },
  computed: {
    ...mapState(['settings']),
    datepickerLanguage() {
      return { fr, en }[this.$i18n.locale]
    },
    foldArrow() {
      return this.open ? 'chevron-down' : 'chevron-right'
    },
    formatedEndDate() {
      if (!this.settings.endDate) return this.$t('settings.no_end_date')
      const locale = {
        fr: dateFnsFr,
        en: dateFnsEn,
      }[this.$i18n.locale]
      return formatRelative(this.settings.endDate, new Date(), { locale })
    },
  },
}
</script>

<style lang="less" scoped>
.settings {
  text-align: left;

  .settings-container {
    margin: 10px 20px;

    .setting-item {
      border: 1px solid lightgrey;
      border-radius: 5px;
      padding: 10px 20px;
      margin-bottom: 5px;

      .datepicker {
        input {
          text-align: center;
        }
        display: inline-block;
        margin-right: 10px;
        margin-top: 5px;
      }

      .setting-title {
        font-size: 1.1em;
        display: block;
        margin-bottom: 10px;
      }

      .end-time,
      .end-date {
        display: inline-block;
        margin-bottom: 10px;
        span {
          display: inline-block;
          width: 55px;
        }
      }

      .checkbox-label {
        display: flex;
        cursor: pointer;
        user-select: none;
        label {
          margin-right: 10px;
        }
      }

      .reset {
        font-size: 0.8em;
        cursor: pointer;
        border: 1px solid rgb(116, 0, 0);
        border-radius: 3px;
        padding: 2px 8px;

        &:active,
        &:hover {
          color: red;
        }
      }
    }
  }

  .settings-header {
    cursor: pointer;
    user-select: none;
    margin-left: -9px;
    transition: all 400ms ease-in-out;

    span {
      margin-left: -5px;
    }

    .fold-arrow {
      display: inline-block;
      width: 20px;
      font-size: 1.2em;
      margin: 5px;
    }

    &:hover {
      letter-spacing: 0.5px;
    }
  }
}
</style>
