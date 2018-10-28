export const state = () => ({
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
  locale: 'en'
})

export const mutations = {
  SET_LANG (state, locale) {
    if (state.locales.find(el => el.code === locale)) {
      state.locale = locale
    }
  },

  SET_PREVENT_RELOAD (state, flag) {
    state.preventLanguageReload = flag
  }
}
