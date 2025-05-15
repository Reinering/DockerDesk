import { defineBoot } from '#q-app/wrappers'
import { LocalStorage, SessionStorage } from 'quasar'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { isEmptyStr } from 'src/utils/common.js'


export default defineBoot(({ app }) => {

  let lang = ''
  if (!isEmptyStr(LocalStorage.getItem('config'))) {
    lang = JSON.parse(LocalStorage.getItem('config')).lang
  }

  const i18n = createI18n({
    locale: lang || 'zh-CN', // set locale
    globalInjection: true,
    messages: {
      'en-US': messages['en-US'],
      'zh-CN': messages['zh-CN']
    }
  })

  // Set i18n instance on app
  app.use(i18n)
})
