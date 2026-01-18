<template>
  <q-page q-pa-md>

    <q-scroll-area :style="scrollAreaStyle">
      <div class="q-pa-md q-gutter-y-md">
        <q-expansion-item
          expand-separator
          flat bordered
          :label="t('setting.basic')"
          header-class="text-grey-6"
          style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; font-size: 16px; "
        >
          <div class="q-pa-md q-gutter-sm">
            <q-select
              class="bg-grey-3"
              color="blue"
              v-model="lang"
              :options="langOptions"
              label="Language"
              borderless
              emit-value
              map-options
              options-dense
              filled
            />

            <q-select
              class="bg-grey-3"
              color="blue"
              v-model="theme"
              :options="themeOptions"
              label="Theme"
              borderless
              emit-value
              map-options
              options-dense
              filled
              @update:modelValue="onThemeUpdate"
            />

            <q-select
              class="bg-grey-3"
              color="blue"
              v-model="userMode"
              :options="userModes"
              :label="t('setting.userMode')"
              borderless
              emit-value
              map-options
              options-dense
              filled
              @update:modelValue="onUserModeUpdate"
            />
          </div>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          flat bordered
          :label="t('setting.display')"
          header-class="text-grey-6"
          style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; font-size: 16px; "
        >
          <div class="q-pa-md q-gutter-sm">
            <q-item class="bg-grey-4">
              <q-item-section>
                <q-item-label caption>SHow Carousel</q-item-label>
                <q-item-label >{{t('setting.show') + t('setting.carousel')}}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-toggle color="green" v-model="settings.display.isShowCarousel" @update:model-value="changeDisplay"/>
              </q-item-section>
            </q-item>

            <q-item class="bg-grey-4">
              <q-item-section>
                <q-item-label caption>Show Search Bar</q-item-label>
                <q-item-label >{{t('setting.show') + t('setting.searchBar')}}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-toggle color="green" v-model="settings.display.isShowSearchBar" @update:model-value="changeDisplay"/>
              </q-item-section>
            </q-item>

          </div>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          flat bordered
          :label="t('setting.system')"
          header-class="text-grey-6"
          style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; font-size: 16px; "
        >
          <div class="q-pa-md q-gutter-sm">
            <q-item class="bg-grey-4">
              <q-item-section>
                <q-item-label caption>Auto Launch</q-item-label>
                <q-item-label >{{t('setting.autoLaunch')}}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-toggle color="green" v-model="settings.isAutoLaunch" @update:model-value="changeAutoLaunch"/>
              </q-item-section>
            </q-item>

          </div>

        </q-expansion-item>
      </div>

    </q-scroll-area>

  </q-page>

</template>

<script setup>
import { inject, ref, watch, onMounted, onUnmounted, reactive } from 'vue'
import languages from 'quasar/lang/index.json'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from 'stores/config.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const t = inject("t")

const scrollAreaStyle = reactive({
  height: window.innerHeight - 53 + "px"
})

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

const userModes = [
  { label: t('setting.mode.normal'), value: 'normal', desc: 'Normal' },
  { label: t('setting.mode.professional'), value: 'professional', desc: 'Professional' }
]

const userMode = ref("normal")

const onThemeUpdate = () => {
  // console.log(theme.value)

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

const settings = reactive({
  isAutoLaunch: false,
  display: {
    isShowCarousel: true,
    isShowSearchBar: true
  }
})

const changeDisplay = () => {
  window.client.updateSettings({
    field: "display_settings",
    type: "json",
    value: JSON.stringify(settings.display),

  }).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('setting.actionSuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('setting.actionFail')}: ${result.error}`
      })
    }
  })
}

const changeAutoLaunch = () => {
  window.client.setAutoLaunch(settings.isAutoLaunch).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('setting.actionSuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('setting.actionFail')}: ${result.error}`
      })
    }
  })
}

const init = () => {
  if (configStore.theme) {
    theme.value = t('setting.theme.' + configStore.theme)
  }

  if (configStore.userMode) {
    userMode.value = configStore.userMode
  }

  window.client.getAutoLaunch().then((result) => {
    if (result.success) {
      settings.isAutoLaunch = result.data
    }
  })

  window.client.getSettings("display_settings").then((result) => {
    if (result.success) {
      const data= JSON.parse(result.data.value)
      if (Object.prototype.hasOwnProperty.call(data, "isShowCarousel")) {
        settings.display.isShowCarousel = data.isShowCarousel
      }
      if (Object.prototype.hasOwnProperty.call(data, "isShowSearchBar")) {
        settings.display.isShowSearchBar = data.isShowSearchBar
      }
    }
  })
}

const checkScreenHeightSize = () => {
  scrollAreaStyle.height = window.innerHeight - 53 + "px"
}

const onUserModeUpdate = () => {
  configStore.userMode = userMode.value
}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenHeightSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenHeightSize)
})

watch(lang, (newVal) => {

  // quasar lang
  modules[`../../node_modules/quasar/lang/${newVal}.js`]().then(lang => {
    $q.lang.set(lang.default)
  })

  // i18
  locale.value = newVal

  // localStorage
  configStore.lang = newVal

  window.myWindowAPI.syncLang(configStore.lang)
})


</script>

<style scoped>

</style>
