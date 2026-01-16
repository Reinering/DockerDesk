<template>
  <q-dialog>
    <q-card style="min-width: 90%">
      <q-card-section>
        <q-item-label class="text-h6">{{t('wsl.wslDetail')}}</q-item-label>
      </q-card-section>

      <q-tabs
        v-model="tab"
        inline-label
        mobile-arrows
        dense
        class="bg-teal text-white shadow-2"
      >
        <q-tab name="network" icon="link" :label="t('wsl.network')" />
        <q-tab name="settings" icon="settings" :label="t('wsl.settings')" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="network">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
