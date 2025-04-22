import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { useConfigStore } from 'stores/config.js'


const configStore = useConfigStore()

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    locale: configStore.lang || 'zh-CN', // set locale
    globalInjection: true,
    messages: {
      'en-US': messages['en-US'],
      'zh-CN': messages['zh-CN']
    }
  })

  // Set i18n instance on app
  app.use(i18n)
})
