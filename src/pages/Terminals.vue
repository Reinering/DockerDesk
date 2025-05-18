<template>
<!--  <q-layout container :style="background" class="shadow-2 rounded-borders">-->
<!--    -->
<!--  </q-layout>-->
  <q-page q-pa-md>
    <q-card>
      <q-tabs
        inline-label
        switch-indicator
        indicator-color="primary"
        class="bg-lime shadow-2"
        align="left"
        v-model="tab"
      >
        <rtab
          v-for="item in tabs"
          :key="item.id"
          :name="item.id"
          :icon="item.icon"
          :label="item.label"
          @click="deleteTab(item.id)"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated style="height: 100%" keep-alive>
<!--        class="grey-9 text-white"-->
        <q-tab-panel
          v-for="item in tabs"
          :key="item.id"
          :name="item.id"
          class="no-padding"
        >
          <Xterm
            :terminal-id="item.id"
            :data="item.data"
            :ref="(el) => (xtermRefs[item.id] = el)"
            :style="cardStyle"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <CommandBar v-if="isShowCmdBar"  :send="submitCmd" fixed-bottom/>

    <q-page-sticky position="bottom-right" :offset="fabPos">
      <q-fab
        icon="add"
        direction="up"
        color="accent"
        :disable="draggingFab"
        v-touch-pan.prevent.mouse="moveFab"
      >
        <q-fab-action @click="showCmdBar" color="primary" icon="keyboard_command_key" :disable="draggingFab">
          <q-tooltip>
            CMD Bar
          </q-tooltip>
        </q-fab-action>
        <q-fab-action @click="showFileSystem" color="primary" icon="storage" :disable="draggingFab">
          <q-tooltip>
            FileSystem
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'Terminals',
})

import { inject, onMounted, onActivated, reactive, ref, nextTick, watch, onUnmounted } from 'vue'
import CommandBar from 'components/CommandBar.vue'
import Xterm from 'components/Xterm.vue'
import rtab from 'components/RTab.vue'
import { generateUuid, isEmptyObj } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")


const background = reactive({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: window.innerHeight - 70 + "px"
})

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 151 + "px" : window.innerHeight - 70 + "px"
  // height: "100%",
})

const fabPos = ref([ 30, 200 ])
const draggingFab = ref(false)

const moveFab = (ev) => {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true

  fabPos.value = [
    fabPos.value[ 0 ] - ev.delta.x,
    fabPos.value[ 1 ] - ev.delta.y
  ]
}

const tab = ref('')

const tabs = reactive([
  // { id: 'mails', label: 'Mails', icon: 'check', data: {}},
  // { id: 'alarms', label: 'Alarms', icon: 'unfold_less', data: {}},
  // { id: 'movies', label: 'Movies', icon: 'movie', data: {}},
])

const xtermRefs = reactive({}); // 存储 xterm 实例的 ref

const isShowCmdBar = ref(false)

const showCmdBar = () => {
  if (tab.value === '') {
    isShowCmdBar.value = false
    return
  }

  isShowCmdBar.value = ! isShowCmdBar.value
  if (isShowCmdBar.value) {
    if (process.env.MODE === 'electron') {
      cardStyle.height = window.innerHeight - 230 - 66 - 5 + "px"
    } else {
      cardStyle.height = window.innerHeight - 222 - 42 - 5 + "px"
    }
  } else {
    if (process.env.MODE === 'electron') {
      cardStyle.height = window.innerHeight - 151 + "px"
    } else {
      cardStyle.height = window.innerHeight - 70 + "px"
    }
  }
}

const showFileSystem = () => {
  if (tab.value === '') {
    isShowCmdBar.value = false
    return
  }
}

// 按键发送命令
const numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const handleKeyDown = (event) => {
  // 标签页切换，快捷键 alt + 数字键
  if (event.altKey) {
    if (numberKeys.includes(event.key)) {
      if (parseInt(event.key) <= tabs.length) {
        tab.value = tabs[parseInt(event.key) - 1].id
      }
    }
  }
}

const submitCmd = (cmd) => {
  xtermRefs[tab.value].send(cmd + '\r')
}

const checkScreenSize = () => {
  // console.log('check screenHeightSize', window.innerHeight)

  if (isShowCmdBar.value) {
    if (process.env.MODE === 'electron') {
      cardStyle.height = window.innerHeight - 230 - 66 - 5 + "px"
    } else {
      cardStyle.height = window.innerHeight - 222 - 42 - 5 + "px"
    }
  } else {
    if (process.env.MODE === 'electron') {
      cardStyle.height = window.innerHeight - 151 + "px"
    } else {
      cardStyle.height = window.innerHeight - 70 + "px"
    }
  }

}

const deleteTab = (id) => {
  $q.dialog({
    title: t('confirm'),
    message: t('terminal.closeMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    for (let i = 0; i < tabs.length; i++) {
      if ( tabs[i].id === id) {
        window.terminal.closeTerminal()

        tabs.splice(i, 1)
        tab.value = tabs[0].id
        return
      }
    }
  })
}

onMounted(() => {
  window.addEventListener('resize', checkScreenSize)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  window.removeEventListener('keydown', handleKeyDown)
})

onActivated(() => {
  try {
    const data = JSON.parse(route.query.data).data
    if (data) {
      const uuid = generateUuid()
      tabs.push({
        id: uuid,
        label: data.serviceName,
        icon: 'terminal',
        data: data
      })
      tab.value = uuid
    }
  } catch (e) {
    // console.error(e)
  }
})

watch(tabs, (newVal, oldVal) => {
  if (tabs.length === 0) {
    isShowCmdBar.value = false
  }
})

</script>

<style scoped>
.tab-panels {
  flex: 1;
  height: 100%;
}

.q-tab-panel {
  flex: 1;
  overflow: hidden;
}
</style>
