<template>
  <q-page q-pa-md>

    <q-scroll-area style="height: 500px">
      <div class="q-pa-md">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
            <div class="col">
              <q-btn
                flat
                dense
                color="grey-6"
                style="background-color: #e9ecef; border-radius: 4px; font-size: 16px; padding: 4px 12px;"
              >
                基础用法
              </q-btn>
            </div>
            <div class="col-auto row items-center q-gutter-sm">
              <q-btn color="teal" label="save" size="md"/>
            </div>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">
            <q-select
              class="bg-grey-3"
              color="blue"
              v-model="lang"
              :options="langOptions"
              label="Quasar Language"
              borderless
              emit-value
              map-options
              options-dense
            />

            <q-select
              class="bg-grey-3"
              color="blue"
              v-model="theme"
              :options="themeOptions"
              label="Quasar Language"
              borderless
              emit-value
              map-options
              options-dense
              @update:modelValue="onThemeUpdate"
            />
          </div>

        </q-card>
      </div>

    </q-scroll-area>
    <q-card>


    </q-card>

  </q-page>

</template>

<script setup>
import { inject, ref, watch } from 'vue'
import languages from 'quasar/lang/index.json'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from 'stores/config.js'


const $q = inject("$q")
const t = inject("t")

const configStore = useConfigStore()

// quasar lang
const modules = import.meta.glob('../../node_modules/quasar/lang/(en-US|es|zh-CN).js')
const lang = ref($q.lang.isoName)
const appLanguages = languages.filter(lang =>
  [ 'en-US', 'zh-CN' ].includes(lang.isoName)
)
const langOptions = appLanguages.map(lang => ({
  label: lang.nativeName, value: lang.isoName
}))

// i18
const { locale } = useI18n({ useScope: 'global' })

const themeOptions = [t('setting.theme.auto'), t('setting.theme.light'), t('setting.theme.dark')]


const theme = ref(t('setting.theme.auto'))
if (configStore.theme) {
  theme.value = t('setting.theme.' + configStore.theme)
}

watch(lang, val => {

  // quasar lang
  modules[`../../node_modules/quasar/lang/${val}.js`]().then(lang => {
    $q.lang.set(lang.default)
  })

  // i18
  locale.value = val

  // localStorage
  configStore.lang = val



})

const onThemeUpdate = () => {
  console.log(theme.value)

  if (theme.value === t('setting.theme.dark')) {
    $q.dark.set(true)
    configStore.theme = 'dark'
  } else if (theme.value === t('setting.theme.light')) {
    $q.dark.set(false)
    configStore.theme = 'light'
  } else {
    $q.dark.set(false)
    configStore.theme = 'auto'
  }
}




</script>

<style scoped>

</style>
