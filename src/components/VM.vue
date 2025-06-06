<template>
  <q-card
    bordered
    class="vm-card"
    :style="templates[data.templateId]"
  >
    <div>
      <q-badge col floating :color="color" rounded/>
    </div>

    <div class="col text-subtitle1 text-weight-bold text-center">{{ data.servername }}</div>

<!--    <q-item style="height: 30px">-->
<!--      -->
<!--    </q-item>-->

    <q-separator />

    <q-card-section class="q-gutter-y-sm">
      <div class="text-caption">OS: {{}}</div>

      <div class="row flex flex-center">
        <q-knob
          readonly
          v-model="wslStatus.cpuValue"
          show-value
          size="60px"
          :thickness="0.1"
          color="light-blue-9"
          track-color="cyan-12"
          class="text-light-blue-9 q-ma-sm"
        >
          <div class="text-caption">CPU</div>
          <!--            {{ cpuValue }}%-->
        </q-knob>

        <q-knob
          readonly
          v-model="wslStatus.memoryValue"
          show-value
          size="60px"
          :thickness="0.1"
          color="orange"
          track-color="orange-3"
          class="text-orange q-ma-sm"
        >
          <div class="text-caption">Memory</div>
          <!--            {{ memoryValue }}%-->
        </q-knob>

        <q-knob
          readonly
          v-model="wslStatus.diskValue"
          show-value
          size="60px"
          :thickness="0.1"
          color="orange"
          track-color="orange-3"
          class="text-orange q-ma-sm"
        >
          <div class="text-caption">Disk</div>
          <!--            {{ memoryValue }}%-->
        </q-knob>
      </div>

      <q-card-actions align="center">
        <div class="row flex flex-center">
          <q-btn
            :disabled="isStart"
            class="text-h8"
            :text-color="templates[data.templateId].btn.color"
            unelevated
            icon="play_arrow"
            size="sm"
            @click="onStart"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('wsl.run')}}
            </q-tooltip>
          </q-btn>

          <q-btn
            :disabled="isStop"
            class="text-h8"
            text-color="teal-9"
            unelevated
            icon="stop"
            size="sm"
            @click="onStop"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('wsl.stop')}}
            </q-tooltip>
          </q-btn>

          <q-btn
            :disabled="isRestart"
            class="text-h8"
            :text-color="templates[data.templateId].btn.color"
            unelevated
            icon="restart_alt"
            size="sm"
            @click="onRestart"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('wsl.restart')}}
            </q-tooltip>
          </q-btn>

          <q-btn-dropdown
            :disabled="isMore"
            class="text-h8"
            :text-color="templates[data.templateId].btn.color"
            unelevated
            icon="more_horiz"
            size="sm"
          >
            <q-list :style="`backgroundColor:${templates[data.templateId].backgroundColor}`">
              <q-item clickable v-close-popup size="sm" @click="onDelete">
                <q-item-section>
                  <q-icon name="delete" color="teal-9" />
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('wsl.delete')}}
                  </q-tooltip>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup size="sm" @click="onTerminal">
                <q-item-section>
                  <q-icon name="terminal" color="teal-9" />
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('wsl.terminal')}}
                  </q-tooltip>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup size="sm" @click="onExport">
                <q-item-section>
                  <q-icon name="archive" color="teal-9" />
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('wsl.export')}}
                  </q-tooltip>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup size="sm" @click="onMove">
                <q-item-section>
                  <q-icon name="drive_file_move" color="teal-9" />
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('wsl.move')}}
                  </q-tooltip>
                </q-item-section>
              </q-item>
            </q-list>

          </q-btn-dropdown>
        </div>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>


<script setup>
import { clientConfig } from 'src/common/config.js'

defineOptions({
  name: 'VM',
})

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  style: {
    type: Object,
    default: () => {}
  },
  onDelete: {
    type: Function,
    default: () => {}
  }
})

import { inject, reactive, ref, watch, onMounted } from 'vue'
import { changeNavigatorGoto } from "src/utils/router.js"

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")
const deviceInfo = inject("deviceInfo")

let notify = ref(null)

const data = reactive(props.data)

const templates = [
  {
    backgroundColor: "#85C1E9",
    width: "200px",
    height: "150px",
    margin: "20px",
    btn: {
      color: "blue-grey-5",
    },
  },
  {
    backgroundColor: "#808B96",
    width: "280px",
    height: "200px",
    margin: "20px",
    btn: {
      color: "teal-9",
    },

  }
]

const wslStatus = reactive({
  cpuValue: '',
  memoryValue: '',
  diskValue: '',
})

const isStart = ref(false)
const isStop = ref(false)
const isRestart = ref(false)
const isMore = ref(false)

const color = ref("yellow")

const changeState = (newVal) => {
  if (newVal === "Running") {
    color.value = "green"
    isStart.value = true
    isStop.value = false
    isRestart.value = false
  } else if (newVal === "Stopped") {
    color.value = "red"
    isStart.value = false
    isStop.value = true
    isRestart.value = true
  } else {
    color.value = "yellow"
    isStart.value = true
    isStop.value = true
    isRestart.value = true
    isMore.value = true
  }
}

changeState(data.state)


const onStart = () => {
  let isCall = true
  window.wslTerminal.startWSL({
    name: data.servername
  }).then((result) => {
    if (! result.success && isCall) {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('assistant.startError')}: ${data.servername}: ${result.error}`
      })

      data.state = "Stopped"
    }
  })

  setTimeout(() => {
    isCall = false
  }, 5000)

  data.state = "Running"
}

const onStop = () => {
  window.wslTerminal.stopWSL({
    name: data.servername
  }).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('assistant.stopSuccess')
      })

      data.state = "Stopped"
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('assistant.stopError')}: ${data.servername}: ${result.error}`
      })
    }
  })
}
const onRestart = () => {
  window.wslTerminal.restartWSL({
    name: data.servername
  }).then((result) => {
    if (result.success) {

    }
  })
}
const onDelete = () => {
  window.wslTerminal.deleteWSL({
    name: data.servername
  }).then((result) => {
    if (result.success) {
      props.onDelete(data.name)

      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('wsl.deleteSuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('wsl.deleteError')}: ${data.servername}: ${result.error}`
      })
    }
  })
}
const onTerminal = () => {
  window.wslTerminal.termimalWSL({
    name: data.servername
  }).then((result) => {
    if (result.success) {

    }
  })

  // return changeNavigatorGoto(router, item[0], item[1], {data: row})
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

  window.wslTerminal.exportWSL({
    name: data.servername,
    distDir: folders[0]
  }).then((result) => {
    if (result.success) {
      notify.value({
        type: 'positive',
        icon: 'done',
        spinner: false,
        message: `${t('wsl.exportSuccess')}: ${data.servername}`,
        timeout: 3000
      })
    } else {
      notify.value({
        type: 'positive',
        icon: 'done',
        spinner: false,
        message: `${t('wsl.exportError')}: ${data.servername}: ${result.error}`,
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
    name: data.servername,
    distDir: folders[0]
  }).then((result) => {
    if (result.success) {
      notify.value({
        type: 'positive',
        icon: 'done',
        spinner: false,
        message: `${t('wsl.movingSuccess')}: ${data.servername}`,
        timeout: 3000
      })
    } else {
      notify.value({
        type: 'positive',
        icon: 'done',
        spinner: false,
        message: `${t('wsl.movingError')}: ${data.servername}: ${result.error}`,
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


const init = () => {
  if (process.env.MODE === 'electron' && deviceInfo.value.platform === "win32" && data.servername) {
    // window.wslTerminal
  }

}

onMounted(() => {
  init()
})


watch(() => data.state, (newVal) => {
  changeState(newVal)
})





</script>



<style scoped>

</style>
