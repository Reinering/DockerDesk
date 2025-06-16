<template>
  <q-card
    bordered
    class="container-card"
    :style="templates[data.templateId]"
  >

    <q-item clickable v-ripple class="bg-blue-grey-3">
      <q-item-section side top>
        <q-icon name="class"  />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-bold text-teal" lines="1">{{ props.data["data"]["names"] }}</q-item-label>
        <q-item-label caption lines="1">{{ props.data["data"]["image"] }}</q-item-label>
      </q-item-section>
    </q-item>

    <div>
      <q-badge col floating :color="stateColor" rounded/>
    </div>

    <q-separator />

    <q-card-actions class="q-pt-md" align="center">
      <div class="row flex flex-center">
        <q-btn
          :disabled="isStart"
          class="text-h8"
          :text-color="templates[props.data.templateId].btn.color"
          unelevated
          icon="play_arrow"
          size="sm"
          dense
          @click="onStart"
        >
          <q-tooltip class="bg-amber text-black shadow-4">
            {{t('panel.container.run')}}
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
            {{t('panel.container.stop')}}
          </q-tooltip>
        </q-btn>

        <q-btn
          :disabled="isRestart"
          class="text-h8"
          text-color="deep-orange"
          unelevated
          icon="restart_alt"
          size="sm"
          @click="onRestart"
        >
          <q-tooltip class="bg-amber text-black shadow-4">
            {{t('panel.container.restart')}}
          </q-tooltip>
        </q-btn>

        <q-btn-dropdown
          class="text-h8"
          :text-color="templates[props.data.templateId].btn.color"
          unelevated
          icon="more_horiz"
          color="blue-grey-3"
          size="sm"
        >
          <q-list dense :style="`backgroundColor:${templates[props.data.templateId].backgroundColor}`">
            <q-item clickable v-close-popup size="sm" @click="onDetail">
              <q-item-section>
                <q-icon name="info" color="blue" />
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('panel.container.detail')}}
                </q-tooltip>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup size="sm" @click="onDelete">
              <q-item-section>
                <q-icon name="delete" color="red" />
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('panel.container.delete')}}
                </q-tooltip>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup size="sm" @click="showPackImageDialog = !showPackImageDialog">
              <q-item-section>
                <q-icon name="archive" :color="templates[props.data.templateId].btn.color" />
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('panel.container.pack')}}
                </q-tooltip>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup size="sm" @click="onSettings">
              <q-item-section>
                <q-icon name="settings" :color="templates[props.data.templateId].btn.color" />
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('panel.container.settings')}}
                </q-tooltip>
              </q-item-section>
            </q-item>
          </q-list>

        </q-btn-dropdown>
      </div>
    </q-card-actions>

    <q-card-actions align="center">
      <q-btn-dropdown
        :disable="isOpenWeb"
        split
        color="pink"
        label="Open Web"
        dropdown-icon="change_history"
        size="sm"
        @click="openFirstPort"
      >
        <q-list dense :style="`backgroundColor:${templates[props.data.templateId].backgroundColor}`">
          <q-item
            v-for="(item, index) in ports"
            :key="index"
            clickable
            v-close-popup
            size="sm"
            @click="openCurrentPort(item)"
          >
            <q-item-section>
              <q-item-label class="text-pink">{{item}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-card-actions>

  </q-card>

  <q-dialog v-model="showPackImageDialog">
    <q-card class="q-gutter-sm" style="min-width: 60%; height: 270px;" >
      <q-card-section>
        <div class="text-h6">{{t('panel.container.packImageTitle')}}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">

      </q-card-section>

      <div class="row justify-center q-gutter-sm">
        <q-input
          filled
          v-model="newTag.repository"
          :label="t('panel.container.repository')"
          :rules="[
            val => !!val || t('verifyMessage.dataNotNull'),
            val => val.length <= 255 || t('verifyMessage.dataLenNotMax') + '255',
            val => /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*$/.test(val) || t('verifyMessage.invalidRepositoryName'),
            val => !val.startsWith('/') && !val.endsWith('/') || t('verifyMessage.repositoryNameSlash'),
            val => !val.includes('//') || t('verifyMessage.repositoryNameDoubleSlash')
          ]"
        />
        <q-input
          filled
          v-model="newTag.tag"
          :label="t('panel.container.tag')"
          :rules="[
            val => !!val || t('verifyMessage.dataNotNull'),
            val => val.length <= 128 || t('verifyMessage.dataLenNotMax') + '128',
            val => /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(val) || t('verifyMessage.invalidImageTag'),
            val => !val.startsWith('.') && !val.startsWith('-') || t('verifyMessage.tagStartChar'),
            val => !val.includes('..') || t('verifyMessage.tagDoubleDot')
          ]"
        />
      </div>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="showPackImageDialog = !showPackImageDialog" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onPack" />
      </q-card-actions>

    </q-card>
  </q-dialog>

  <q-dialog v-model="isClick">
    <ContainerSetting />
  </q-dialog>
</template>


<script setup>
defineOptions({
  name: 'Container',
})

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      templateId: 0,
      nodeId: 0,
      servername: '',
      description: '',
      data: {}
    }),
  },
  update: {
    type: Function,
    default: () => {}
  },
  delete: {
    type: Function,
    default: () => {}
  }
})

import { inject, reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import ContainerSetting from "./ContainerSetting.vue"
import { parseDockerContainer, getExPortsByContainer } from 'src/utils/wsl.js'
import { clientConfig } from 'src/common/config.js'
import { isEmptyObj, isEmptyStr } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

let notify = ref(null)
let monitorInterval = null

const showPackImageDialog = ref(false)
const newTag = reactive({
  repository: '',
  tag: '',
})

const templates = [
  {
    backgroundColor: "#A2D0EF",
    width: "220px",
    height: "150px",
    margin: "20px",
    btn: {
      color: "blue-grey-5",
    },
  },
  {
    backgroundColor: "#A2D9CE",
    width: "200px",
    height: "200px",
    margin: "20px",
    btn: {
      color: "teal-9",
    },
  },
  {
    backgroundColor: "#A2D9CE",
    width: "250px",
    height: "200px",
    margin: "20px",
    btn: {
      color: "teal-9",
    },
  },
  {
    backgroundColor: "#A2D0EF",
    width: "150px",
    height: "100px",
    margin: "20px",
    btn: {
      color: "blue-grey-5",
    },
  },
]

const isClick = ref(false)

const state = ref('')
const stateColor = ref('')

const isStart = ref(false)
const isStop = ref(false)
const isRestart = ref(false)
const isMore = ref(false)
const isOpenWeb = ref(false)
const ports = reactive([])

const onStart = async () => {
  if (isEmptyObj(props.data)) {
    return
  }

  window.wslTerminal.execWSL([
    '-d', "DockerDesk", '--user', "root", '-e', `${props.data.serviceCmd} start ${props.data["data"]["names"]}`
  ]).then((result) => {
    if (result.success) {
      notify.value({
        type: 'positive',
        group: false,
        icon: 'done',
        spinner: false,
        message: `${t('panel.container.startSuccess')}`,
        timeout: 10000
      })

      containerStateMonitor()
    } else {
      notify.value({
        type: 'negative',
        icon: 'done',
        spinner: false,
        message: `${t('panel.container.startFail')}`,
        timeout: 10000
      })
    }
  })

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('panel.container.starting'),
  })
}
const onStop = () => {
  if (isEmptyObj(props.data)) {
    return
  }

  window.wslTerminal.execWSL([
    '-d', "DockerDesk", '--user', "root", '-e', `${props.data.serviceCmd} stop ${props.data["data"]["names"]}`
  ]).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.container.stopSuccess')}`,
      })

      if (monitorInterval !== null) {
        clearInterval(monitorInterval)
        monitorInterval = null
      }
      getContainerState()
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.container.stopFail')}`
      })
    }
  })
}
const onRestart = () => {
  if (isEmptyObj(props.data)) {
    return
  }

  window.wslTerminal.execWSL([
    '-d', "DockerDesk", '--user', "root", '-e', `${props.data.serviceCmd} restart ${props.data["data"]["names"]}`
  ]).then((result) => {
    if (result.success) {
      notify.value({
        type: 'positive',
        group: false,
        icon: 'done',
        spinner: false,
        message: `${t('panel.container.restartSuccess')}`,
        timeout: 10000
      })

      containerStateMonitor()
    } else {
      notify.value({
        type: 'negative',
        icon: 'done',
        spinner: false,
        message: `${t('panel.container.restartFail')}`,
        timeout: 10000
      })
    }
  })

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('panel.container.restarting'),
  })
}
const onDetail = () => {}
const onDelete = () => {
  if (isEmptyObj(props.data)) {
    return
  }

  $q.dialog({
    title: t('confirm'),
    message: t('panel.container.deleteMessage'),
    options: {
      type: 'checkbox',
      model: [],
      // inline: true
      items: [
        { label: t('panel.container.forceDelete'), value: 'force', color: 'red' },
      ]
    },
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(async (data) => {
    let force = ''
    if (data.length > 0) {
      force = '-f'
    }

    window.wslTerminal.execWSL([
      '-d', "DockerDesk", '--user', "root", '-e', `${props.data.serviceCmd} rm ${force} ${props.data["data"]["names"]}`
    ]).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.container.deleteSuccess')}`,
        })

        props.delete(props.data.nodeId)
        if (monitorInterval !== null) {
          clearInterval(monitorInterval)
          monitorInterval = null
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.container.deleteFail')}`
        })
      }
    })
  })
}
const onPack = () => {
  if (isEmptyObj(props.data)) {
    return
  }


  if (newTag.repository === '' || newTag.repository === '') {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('verifyMessage.dataNotNull')}`
    })
  }

  window.wslTerminal.execWSL([
    '-d', "DockerDesk", '--user', "root", '-e', `${props.data.serviceCmd} commit ${props.data["data"]["names"]} ${newTag.repository}:${newTag.tag}`
  ]).then((result) => {
    if (result.success) {
      notify.value({
        type: 'positive',
        group: false,
        icon: 'done',
        spinner: false,
        message: `${t('panel.container.packSuccess')}`,
        timeout: 10000
      })

      showPackImageDialog.value = false
    } else {
      notify.value({
        type: 'negative',
        icon: 'done',
        spinner: false,
        message: `${t('panel.container.packFail')}`,
        timeout: 10000
      })
    }

    newTag.repository = ''
    newTag.tag = ''
  })

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('panel.container.packing'),
  })
}
const onSettings = () => {}

const openFirstPort = () => {
  window.client.openUrlOnBrowser(`http://localhost:${ports[0]}`)
}

const openCurrentPort = (port) => {
  window.client.openUrlOnBrowser(`http://localhost:${port}`)
}



const containerStateMonitor = (time=60000, interval=5000) => {
  let totalTime = time

  if (monitorInterval !== null) {
    clearInterval(monitorInterval)
    monitorInterval = null
  }

  monitorInterval = setInterval(() => {
    getContainerState()
    totalTime -= interval
    if (totalTime <= 0) {
      clearInterval(monitorInterval)
      monitorInterval = null
    }
  }, interval)
}

const getContainerState = () => {
  window.wslTerminal.execWSL([
    '-d', "DockerDesk", '--user', "root", '-e', `${props.data.serviceCmd} ps -a --filter "name=${props.data["data"]["names"]}"`
  ]).then((result) => {
    if (result.success) {
      const item = parseDockerContainer(result.data)[0]
      Object.keys(item).forEach((key) => {
        props.update(props.data.nodeId, key, item[key])
      })
    }
  })
}

const changeState = (newVal) => {
  if (newVal === "online") {
    stateColor.value = "green"

    isStart.value = true
    isStop.value = false
    isRestart.value = false
    isMore.value = false
    if (ports.length > 0) {
      isOpenWeb.value = false
    } else {
      isOpenWeb.value = true
    }
  } else if (newVal === "offline") {
    stateColor.value = "red"

    isStart.value = false
    isStop.value = true
    isRestart.value = true
    isMore.value = true
    isOpenWeb.value = true
  } else {
    stateColor.value = "yellow"

    isStart.value = true
    isStop.value = true
    isRestart.value = true
    isMore.value = true
    isOpenWeb.value = true
  }
}

changeState(state)

const init = () => {
  if (!isEmptyObj(props.data["data"])) {

    if (!isEmptyStr(props.data["data"]["ports"])) {
      ports.length = 0
      for (const item of getExPortsByContainer(props.data["data"]["ports"])) {
        if (item.port.indexOf('-') === -1 && item.protocol === "tcp") {
          ports.push(item.port)
        }
      }
    }

    if (props.data["data"]["status"].indexOf("Up") !== -1) {
      state.value = "online"
    } else {
      state.value = "offline"
    }
  }
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (monitorInterval !== null) {
    clearInterval(monitorInterval)
    monitorInterval = null
  }
})

watch(() => props.data["data"]["status"], (newVal) => {
  state.value = props.data["data"]["status"].indexOf("Up") !== -1 ? "online" : "offline"
})


watch(state, (newVal) => {
  changeState(newVal)
})

</script>


<style scoped>

</style>
