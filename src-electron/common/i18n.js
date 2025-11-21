import i18next from 'i18next'
import { createTray } from '../common/tray.js'
import en from '../i18n/en-US/en.json'
import zh from '../i18n/zh-CN/zh.json'

const I18_CONF = {
  LANG: 'zh-CN'
}

const resources = {
  "zh-CN": { translation: zh },  // 命名空间：translation
  "en-US": { translation: en }
}

await i18next.init({
  lng: I18_CONF.LANG,
  fallbackLng: 'zh-CN', // 默认语言
  resources,
  ns: ['translation'],  // 命名空间
  defaultNS: 'translation',
  debug: process.env.NODE_ENV === 'development'
})

export const setLang = (lang) => {
  console.log("setlang", lang)
  I18_CONF.LANG = lang

  i18next.changeLanguage(lang)

  createTray()
}



export const i18n = i18next
