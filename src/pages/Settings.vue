<template>
  <q-page q-pa-md>

    <q-scroll-area :style="scrollAreaStyle">
      <div class="q-pa-md">
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
      </div>

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
                {{t('setting.base')}}
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
              label="User Mode"
              borderless
              emit-value
              map-options
              options-dense
              filled
              @update:modelValue="onUserModeUpdate"
            />
          </div>

        </q-card>
      </div>

      <div class="q-pa-md">
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
                <q-toggle color="green" v-model="isAutoLaunch" @update:model-value="changeAutoLaunch"/>
              </q-item-section>
            </q-item>

<!--            <q-item class="bg-grey-4">-->
<!--              <q-item-section avatar top>-->
<!--                <q-icon name="account_tree" color="black" size="34px" />-->
<!--              </q-item-section>-->

<!--              <q-item-section top class="col-2 gt-sm">-->
<!--                <q-item-label class="q-mt-sm">GitHub</q-item-label>-->
<!--              </q-item-section>-->

<!--              <q-item-section top>-->
<!--                <q-item-label lines="1">-->
<!--                  <span class="text-weight-medium">[quasarframework/quasar]</span>-->
<!--                  <span class="text-grey-8"> - GitHub repository</span>-->
<!--                </q-item-label>-->
<!--                <q-item-label caption lines="1">-->
<!--                  @rstoenescu in #1: > The build system-->
<!--                </q-item-label>-->
<!--                <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">-->
<!--                  <span class="cursor-pointer">Open in GitHub</span>-->
<!--                </q-item-label>-->
<!--              </q-item-section>-->

<!--              <q-item-section top side>-->
<!--                <div class="text-grey-8 q-gutter-xs">-->
<!--                  <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />-->
<!--                  <q-btn class="gt-xs" size="12px" flat dense round icon="done" />-->
<!--                  <q-btn size="12px" flat dense round icon="more_vert" />-->
<!--                </div>-->
<!--              </q-item-section>-->
<!--            </q-item>-->

          </div>

        </q-expansion-item>
      </div>

    </q-scroll-area>
    <q-card>


    </q-card>

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

const isAutoLaunch = ref(false)

const changeAutoLaunch = () => {
  window.client.setAutoLaunch(isAutoLaunch.value).then((result) => {
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
      isAutoLaunch.value = result.data
    }
  })
}

const checkScreenHeightSize = () => {
  scrollAreaStyle.height = window.innerHeight - 53 + "px"
}

const onUserModeUpdate = () => {
  console.log(userMode.value)

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
