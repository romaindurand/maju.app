<template>
  <div class="settings">
    <div class="settings-header" @click="toggle">
      <i class="fold-arrow"><font-awesome-icon :icon="foldArrow"/></i>
      <span>{{ $t('more_options') }}</span>
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
          </div>
          <div v-if="endDate" class="end-time">
            <input type="time" @change="endTimeChanged" v-model="endTime" step="1" required/>
          </div>
          <div>
            <span
              v-if="endDate"
              class="reset"
              @click="resetEndDate"
            >{{ $t('settings.reset') }}</span>
          </div>
        </div>
        <div v-if="endDate" class="setting-item">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="hideResults"
              @change="hideResultsChanged"> {{ $t('settings.results_visible_date') }}
          </label>
        </div>
        <div class="setting-item">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="hideVoteCount"
              @change="hideVoteCountChanged"> {{ $t('settings.hide_vote_count') }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker'
import slide from '../lib/slide'
import { fr, en } from '../node_modules/vuejs-datepicker/dist/locale'
import { formatRelative } from 'date-fns'
import dateFnsFr from 'date-fns/locale/fr'
import dateFnsEn from 'date-fns/locale/en-US'

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      endDate: null,
      open: false,
      endTime: '23:59:59',
      hideResults: true,
      hideVoteCount: false,
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
      this.$store.commit('SET_PREVENT_RELOAD', false)
      this.$refs.endDatepicker.selectedDate = null
      this.endDate = null
      this.endTime = '23:59:59'
      this.$store.commit('SET_SETTINGS', {
        endDate: null,
        hideResults: true
      })
      this.hideResults = true
    },
    endTimeChanged (event) {
      this.updateEndDate(this.endDate)
    },
    updateEndDate (date) {
      this.$store.commit('SET_PREVENT_RELOAD', true)
      const endTime = this.endTime.split(':')
      this.endDate = new Date(date.setHours(endTime[0], endTime[1], endTime[2]))
      this.$store.commit('SET_SETTINGS', { endDate: this.endDate })
    },
    hideResultsChanged () {
      this.$store.commit('SET_SETTINGS', { hideResults: this.hideResults })
    },
    hideVoteCountChanged () {
      this.$store.commit('SET_SETTINGS', { hideVoteCount: this.hideVoteCount })
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

      .end-time, .end-date {
        display: inline-block;
        margin-bottom: 10px;
        span {
          display: inline-block;
          width: 55px;
        }
      }

      .checkbox-label {
        cursor: pointer;
        input {
          zoom: 1.5;
          vertical-align: middle;
        }
      }

      .reset {
        cursor: pointer;
        border: 1px solid rgb(116, 0, 0);
        border-radius: 3px;
        padding: 3px 6px;

        &:active {
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
