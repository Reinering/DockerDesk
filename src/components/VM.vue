<template>
  <q-card
    bordered
    class="vm-card"
    :style="templates[data.templateId]"
  >
    <div>
      <q-badge col floating :color="color" rounded/>
    </div>

    <div class="col text-subtitle1 text-weight-bold text-center">{{ props.data.servername }}</div>

    <q-separator />

    <q-card-section class="q-gutter-y-sm">
      <div class="text-caption">wsl2</div>

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
            :text-color="templates[props.data.templateId].btn.color"
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
            :text-color="templates[props.data.templateId].btn.color"
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
            :text-color="templates[props.data.templateId].btn.color"
            unelevated
            icon="more_horiz"
            size="sm"
          >

            <q-list dense :style="`backgroundColor:${templates[props.data.templateId].backgroundColor}`">
              <q-item
                :disable="isDetail"
                clickable
                v-close-popup
                size="sm"
                @click="onDetail"
              >
                <q-item-section>
                  <q-icon name="details" color="brown" />
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('wsl.detail')}}
                  </q-tooltip>
                </q-item-section>
              </q-item>

              <q-item
                :disable="isBGStart"
                :clickable="isBGStartClick"
                v-close-popup
                size="sm"
                @click="onBackgroundStart"
              >
                <q-item-section>
                  <q-icon name="play_arrow" color="amber" />
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('wsl.bgStart')}}
                  </q-tooltip>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup size="sm" @click="onDelete">
                <q-item-section>
                  <q-icon name="delete" color="red" />
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
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-card-actions>
    </q-card-section>
  </q-card>

  <WSLDetailDialog
    v-if="showDetailDialog"
    v-model="showDetailDialog"
    :data="props.data"
    :onClose="() => showDetailDialog = false"
  />

</template>


<script setup>
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
  },
  onUpdateState: {
    type: Function,
    default: () => {}
  }
})

import { inject, reactive, ref, watch, onMounted, defineEmits } from 'vue'
import WSLDetailDialog from 'src/components/dialog/WSLDetailDialog.vue'
import { changeNavigatorGoto } from "src/utils/router.js"
import { useNavigatorStore } from 'stores/navigator.js'
import { findNaviItemByName, isEmptyObj } from 'src/utils/common.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")
const deviceInfo = inject("deviceInfo")
const navigatorStore = useNavigatorStore()

const emit = defineEmits(['update:value'])

let notify = ref(null)

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
  cpuValue: 0,
  memoryValue: 0,
  diskValue: 0,
})

const isDetail = ref(false)
const isStart = ref(false)
const isStop = ref(false)
const isRestart = ref(false)
const isMore = ref(false)
const isBGStart = ref(false)
const isBGStartClick = ref(false)

const color = ref("yellow")

const changeState = (newVal) => {
  if (newVal === "Running") {
    color.value = "green"
    isStart.value = true
    isStop.value = false
    isRestart.value = false
    isMore.value = false
    isBGStart.value = true
    isBGStartClick.value = false
  } else if (newVal === "Stopped") {
    color.value = "red"
    isStart.value = false
    isStop.value = true
    isRestart.value = true
    isMore.value = false
    isBGStart.value = false
    isBGStartClick.value = "clickable"
  } else {
    color.value = "yellow"
    isStart.value = true
    isStop.value = true
    isRestart.value = true
    isMore.value = true
    isBGStart.value = true
    isBGStartClick.value = "clickable"
  }
}

const showDetailDialog = ref(false)

changeState(props.data.state)

const onStart = async () => {
  window.wslTerminal.startWSL({
    name: props.data.servername
  })

  setTimeout(() => {
    props.onUpdateState()
  }, 5000)
}

const onStop = () => {
  window.wslTerminal.stopWSL({
    name: props.data.servername
  }).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('wsl.stopSuccess')
      })

      emit('update:value', {name: props.data.servername, state: "Stopped"})
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('wsl.stopFail')}: ${props.data.servername}: ${result.error}`
      })
    }
  })
}
const onRestart = () => {
  window.wslTerminal.restartWSL({
    name: props.data.servername
  }).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('wsl.restartSuccess')
      })

      emit('update:value', {name: props.data.servername, state: "Running"})
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('wsl.restartFail')}: ${props.data.servername}: ${result.error}`
      })
    }
  })

  emit('update:value', {name: props.data.servername, state: "Stopped"})
}

const onDetail = () => {
  showDetailDialog.value = true
}

const onBackgroundStart = async () => {
  window.wslTerminal.startBGWSL({
    name: props.data.servername
  }).then((result) => {
    if (!result.success) {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('wsl.startFail')}: ${props.data.servername}: ${result.error}`
      })

      emit('update:value', {name: props.data.servername, state: "Stopped"})
    } else {
      emit('update:value', {name: props.data.servername, state: "Running"})
    }
  })
}
const onDelete = () => {
  $q.dialog({
    title: t('wsl.confirmDel'),
    message: t('wsl.deleteMessage1'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    window.wslTerminal.deleteWSL({
      name: props.data.servername
    }).then((result) => {
      if (result.success) {
        props.onDelete(props.data.servername)

        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('wsl.deleteSuccess')
        })
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('wsl.deleteFail')}: ${props.data.servername}: ${result.error}`
        })
      }
    })
  })
}
const onTerminal = () => {
  // window.wslTerminal.termimalWSL({
  //   name: props.data.servername
  // }).then((result) => {
  //   if (result.success) {
  //
  //   }
  // })

  let item

  item = findNaviItemByName(navigatorStore.naviItems, "Terminal")
  if (isEmptyObj(item)) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: t('node.connectError1')
    })
  }

  return changeNavigatorGoto(router, item[0], item[1],
    {data: {
        serviceName: props.data.servername,
        connectionType: t('node.localNode'),
        serviceType: "WSL"
      }})
}


const init = () => {
  if (process.env.MODE === 'electron' && deviceInfo.value.platform === "win32" && props.data.servername) {
    // window.wslTerminal
  }

}

onMounted(() => {
  init()
})

watch(() => props.data.state, (newVal) => {
  changeState(newVal)
})

</script>



<style scoped>

</style>
