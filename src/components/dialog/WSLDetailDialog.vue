<template>
  <q-dialog>
    <q-card style="min-width: 90%">
      <q-card-section>
        <q-item-label class="text-h6">{{props.data.servername + ' ' + t('wsl.detail')}}</q-item-label>
      </q-card-section>

      <q-tabs
        v-model="tab"
        inline-label
        mobile-arrows
        dense
        class="bg-teal text-white shadow-2"
      >
        <q-tab name="network" icon="link" :label="t('wsl.network')" />
        <q-tab name="tool" icon="build" :label="t('wsl.tool')" />
        <q-tab name="settings" icon="settings" :label="t('wsl.settings')" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="network">

        </q-tab-panel>

        <q-tab-panel name="tool">
          <q-expansion-item
            expand-separator
            flat bordered
            :label="t('wsl.action')"
            header-class="text-grey-6"
            style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; font-size: 16px; "
          >
            <div class="q-pa-md q-gutter-sm">
              <q-item dense class="bg-grey-4">
                <q-item-section>
                  <q-item-label caption>Export</q-item-label>
                  <q-item-label >{{t('wsl.export')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat color="red" icon-right="send" @click="onExport"/>
                </q-item-section>
              </q-item>

              <q-item dense class="bg-grey-4">
                <q-item-section>
                  <q-item-label caption>Move</q-item-label>
                  <q-item-label >{{t('wsl.move')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat color="red" icon-right="send" @click="onMove"/>
                </q-item-section>
              </q-item>


            </div>
          </q-expansion-item>
        </q-tab-panel>

        <q-tab-panel name="settings">
          <q-expansion-item
            expand-separator
            flat bordered
            :label="t('wsl.startupBehavior')"
            header-class="text-grey-6"
            style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; font-size: 16px; "
          >
            <div class="q-pa-md q-gutter-sm">
              <q-item dense class="bg-grey-4">
                <q-item-section>
                  <q-item-label caption>Start With App</q-item-label>
                  <q-item-label >{{t('wsl.startWithApp')}}</q-item-label>
                </q-item-section>
                <q-item-section top side>
                  <q-toggle
                    v-model="settingsDatas.startWithApp"
                    color="green"
                    @update:model-value="onStartWithApp"
                  />
                </q-item-section>
              </q-item>

              <q-item dense class="bg-grey-4">
                <q-item-section>
                  <q-item-label caption>Stop With App</q-item-label>
                  <q-item-label >{{t('wsl.stopWithApp')}}</q-item-label>
                </q-item-section>
                <q-item-section top side>
                  <q-toggle
                    v-model="settingsDatas.stopWithApp"
                    color="green"
                    @update:model-value="onStopWithApp"
                  />
                </q-item-section>
              </q-item>
            </div>
          </q-expansion-item>
        </q-tab-panel>
      </q-tab-panels>

      <q-separator />

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="props.onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { clientConfig } from 'src/common/config.js'

const props = defineProps({

  data: {
    type: Object,
    default: () => {}
  },

  onClose: {
    type: Function,
    default: () => {}
  }
})

import { inject, reactive, ref, onMounted, onUnmounted } from 'vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

let notify = ref(null)
const isOK = ref(false)

const tab = ref("settings")

const settingsDatas = reactive({
  startWithApp: false,
  stopWithApp: false
})

const onStartWithApp = () => {
  window.wslTerminal.setWSLLaunch(JSON.stringify({
      wslName: props.data.servername,
      startWithApp: settingsDatas.startWithApp
    })
  ).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('wsl.setSuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('wsl.setFail')}`
      })
    }
  })
}

const onStopWithApp = () => {
  window.wslTerminal.setWSLLaunch(JSON.stringify({
      wslName: props.data.servername,
      stopWithApp: settingsDatas.stopWithApp
    })
  ).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('wsl.setSuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('wsl.setFail')}`
      })
    }
  })
}

const onExport = async () => {
  const folders = await window.myWindowAPI.selectFolders()
  try {
    if (folders.length === 0) {
      return
    }
  } catch (err) {
    return
  }

  $q.dialog({
    title: t('wsl.option'),
    message: t('wsl.selectFormat'),
    options: {
      type: 'radio',
      model: "tar",
      // inline: true
      items: [
        { label: 'TAR', value: 'tar' },
        { label: 'VHD', value: 'vhd' },
      ]
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    // console.log('>>>> OK, received', data)
    exportWSL(data, folders[0])
  })
}
const onMove = async () => {
  const folders = await window.myWindowAPI.selectFolders()
  try {
    if (folders.length === 0) {
      return
    }
  } catch (err) {
    return
  }

  window.wslTerminal.moveWSL({
    name: props.data.servername,
    distDir: folders[0]
  }).then((result) => {
    if (result.success) {
      notify.value({
        type: 'positive',
        icon: 'done',
        spinner: false,
        message: `${t('wsl.movingSuccess')}: ${props.data.servername}`,
        timeout: 3000
      })
    } else {
      notify.value({
        type: 'negative',
        icon: 'done',
        spinner: false,
        message: `${t('wsl.movingFail')}: ${props.data.servername}: ${result.error}`,
        timeout: 3000
      })
    }
  })

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('wsl.moving'),
  })
}

const exportWSL = (format, path) => {
  window.wslTerminal.exportWSL({
    name: props.data.servername,
    format: format,
    distDir: path
  }).then((result) => {
    if (result.success) {
      notify.value({
        type: 'positive',
        icon: 'done',
        spinner: false,
        message: `${t('wsl.exportSuccess')}: ${props.data.servername}`,
        timeout: 3000
      })
    } else {
      notify.value({
        type: 'negative',
        icon: 'done',
        spinner: false,
        message: `${t('wsl.exportFail')}: ${props.data.servername}: ${result.error}`,
        timeout: 3000
      })
    }
  })

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('wsl.exporting'),
  })
}



const init = () => {
  window.wslTerminal.getWSLLaunch(props.data.servername).then((result) => {
    if (result.success) {
      if (Object.prototype.hasOwnProperty.call(result.data, "startWithApp")) {
        settingsDatas.startWithApp = result.data.startWithApp
      }

      if (Object.prototype.hasOwnProperty.call(result.data, "stopWithApp")) {
        settingsDatas.stopWithApp = result.data.stopWithApp
      }
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('wsl.getSettingError')}: ${result.error}`
      })
    }
  })
}

onMounted(() => {
  init()
})

onUnmounted(() => {

})


</script>

<style scoped>

</style>
