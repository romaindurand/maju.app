export const state = () => ({
  isProduction: process.env.NODE_ENV === 'production',
  preventLanguageReload: false,
  locales: [
    {
      code: 'en',
      name: 'EN'
    },
    {
      code: 'fr',
      name: 'FR'
    }
  ],
  locale: 'en',
  settings: {},
  error: null
})

export const actions = {
  notifyError ({ commit }, { message, duration }) {
    commit('SET_ERROR', message)
    window.setTimeout(() => {
      commit('SET_ERROR', null)
    }, duration)
  }
}

export const mutations = {
  SET_LANG (state, locale) {
    if (state.locales.find(el => el.code === locale)) {
      state.locale = locale
    }
  },

  SET_ERROR (state, message) {
    state.error = message
  },

  SET_SETTINGS (state, settings) {
    state.settings = {
      ...state.settings,
      ...settings
    }
  },

  SET_PREVENT_RELOAD (state, flag) {
    state.preventLanguageReload = flag
  }
}
