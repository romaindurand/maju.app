const locales = {
  'fr-FR': require('./locales/fr-FR'),
  'en-US': require('./locales/en-US')
}

export default function(locale) {
  return locales[locale];
}