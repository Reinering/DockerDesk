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
          :label="t('setting.hotKeyMsg')"
          header-class="text-grey-6"
          style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; font-size: 16px; "
        >
          <div class="q-pa-md q-gutter-sm">
            <q-item
              class="bg-grey-4"
            >
              <q-item-section>
                <q-item-label >{{t('setting.restoreHotKeys')}}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-btn flat dense color="red" icon="restore_page" @click="resetHotKeys" />
              </q-item-section>
            </q-item>

            <q-item
              class="bg-grey-4"
              v-for="(item, index) in settings.hotKeys"
              :key="index"
            >
              <q-item-section>
                <q-item-label >{{t(item.desc)}}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ formatDisplay(item.keys) }}
                  <q-popup-edit
                    v-if="item.isEdit"
                    v-model="editLabel"
                    v-slot="scope"
                    @before-show="showEditLabel(item)"
                  >
                    <q-input
                      v-model="editLabel"
                      dense
                      autofocus
                      @keyup.enter="scope.set"
                      @focus="startCapture(item)"
                      @focusout="stopCapture"
                    >
                      <template v-slot:after>
                        <q-btn
                          flat dense color="negative" icon="cancel"
                          @click.stop.prevent="scope.cancel"
                        />
                        <q-btn
                          flat dense color="positive" icon="check_circle"
                          @click.stop.prevent="scope.set"
                          @click="onEditHotKey(item)"
                        />
                      </template>
                    </q-input>
                  </q-popup-edit>
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-toggle color="green" v-model="item.enable" @update:model-value="onChangeHotkeyState(item)"/>
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
import { inject, ref, watch, onMounted, onUnmounted, reactive, computed } from 'vue'
import languages from 'quasar/lang/index.json'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from 'stores/config.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const t = inject("t")
const deviceInfo = inject("deviceInfo")

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
  },
  hotKeys: [
    {
      name: 'test',
      enable: false,
      keys: 'ctrl + k',
      isEdit: true,
      desc: ''
    }
  ]
})

const onUserModeUpdate = () => {
  configStore.userMode = userMode.value
}

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

const editLabel = ref('')

const showEditLabel = (item) => {
  editLabel.value = formatDisplay(item.keys)
}

const isCapturing = ref(false)
const capturedKeys = ref([])
const currentAccelerator = ref('')
const capturingItem = ref(null)
const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta']
// 映射 Electron 识别的特殊键名
const keyMap = {
  ' ': 'Space',
  '+': 'Plus',
  'ArrowUp': 'Up',
  'ArrowDown': 'Down',
  'ArrowLeft': 'Left',
  'ArrowRight': 'Right',
}
const modifiers = []

function formatDisplay(accel) {
  let txt
  if (accel instanceof Array) {
    txt = accel.join('+')
  } else {
    txt = accel
  }

  const isMac = deviceInfo.value.platform.indexOf('darwin') >= 0
  return txt
    .replace(/CommandOrControl/g, isMac ? '⌘' : 'Ctrl')
    .replace(/Control/g, isMac ? '⌘' : 'Ctrl')
    .replace(/Command/g, isMac ? '⌘' : 'Ctrl')
    .replace(/Alt/g, isMac ? '⌥' : 'Alt')
    .replace(/Shift/g, '⇧')
    .replace(/\+/g, ' + ')
}

// 开始捕获模式（用户点击输入框或按钮时触发）
function startCapture(item) {
  console.log("startCapture")
  isCapturing.value = true
  capturedKeys.value.length = 0
  capturingItem.value = item

  window.addEventListener('keydown', handleKeyDown, { capture: true })
}

function stopCapture() {
  console.log("stopCapture")
  isCapturing.value = false
  capturedKeys.value.length = 0
  window.removeEventListener('keydown', handleKeyDown, { capture: true })
}

const handleKeyDown = (event) => {
  console.log(event)
  if (!isCapturing.value) return

  event.preventDefault()
  event.stopPropagation()

  const { key, ctrlKey, shiftKey, altKey, metaKey } = event

  // 处理退出录制逻辑
  if (key === 'Escape') {
    stopCapture()
    return
  }

  const isModifier = modifierKeys.includes(key)

  if (modifiers.length === 0 && !isModifier) {
    // 如果只按下了修饰键，可以更新 UI 提示用户正在输入（可选）
    console.log('正在按下修饰键...')
  } else if (modifiers.length > 0 && !modifierKeys.includes(modifiers[modifiers.length -1])) {
    modifiers.length = 0
  } else if (isModifier) {
    let tmpKey
    if (ctrlKey) tmpKey = 'Control'
    if (metaKey) tmpKey = 'Command'
    if (shiftKey) tmpKey = 'Shift'
    if (altKey) tmpKey = 'Alt'
    if (modifiers.includes(tmpKey)) return
    modifiers.push(tmpKey)
  } else {
    // 格式化主键
    let mainKey = keyMap[key] || (key.length === 1 ? key.toUpperCase() : key)
    // 组合最终字符串
    const finalAccel = [...modifiers, mainKey].join('+')
    // 更新数据
    currentAccelerator.value = finalAccel
    editLabel.value = formatDisplay(finalAccel)

    modifiers.length = 0
  }
}

const resetHotKeys = () => {
  $q.dialog({
    title: t('alert'),
    message: t('setting.restoreMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
  }).onOk(() => {
    window.client.restoreHotKeys().then((result) => {
      window.client.getSettings("hot_keys").then((result) => {
        if (result.success) {
          settings.hotKeys = JSON.parse(result.data.value)
        }
      })
    })
  })
}

const onEditHotKey = (item) => {
  if (editLabel.value.length === 0) {
    return
  }

  item.keys = editLabel.value
    .replace(/⌘/g, 'CommandOrControl')
    .replace(/Ctrl/g, 'CommandOrControl')
    .replace(/⌥/g, 'Alt')
    .replace(/⇧/g, 'Shift').split(' + ')

  if (item.enable) {
    window.client.unRegistryHotKey(item.name).then((result) => {
      if (!result.success) {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('setting.actionFail')}: ${result.error}`
        })
      }

      window.client.updateSettings({
        field: "hot_keys",
        value: JSON.stringify(settings.hotKeys)
      }).then((result) => {
        if (!result.success) {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('setting.actionFail')}: ${result.error}`
          })
        }

        window.client.registryHotKey(item.name).then((result) => {
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
      })
    })
  } else {
    window.client.updateSettings({
      field: "hot_keys",
      value: JSON.stringify(settings.hotKeys)
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
}

const onChangeHotkeyState = (item) => {
  window.client.updateSettings({
    field: "hot_keys",
    value: JSON.stringify(settings.hotKeys)
  }).then((result) => {
    if (!result.success) {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('setting.actionFail')}: ${result.error}`
      })
    }

    if (item.enable) {
      window.client.registryHotKey(item.name).then((result) => {
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
    } else {
      window.client.unRegistryHotKey(item.name).then((result) => {
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

  window.client.getSettings("hot_keys").then((result) => {
    if (result.success) {
      settings.hotKeys = JSON.parse(result.data.value)
    }
  })
}

const checkScreenHeightSize = () => {
  scrollAreaStyle.height = window.innerHeight - 53 + "px"
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
