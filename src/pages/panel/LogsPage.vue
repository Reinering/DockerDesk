<template>
  <q-card :style="cardStyle">
    <q-tabs
      inline-label
      switch-indicator
      indicator-color="primary"
      active-color="purple"
      class="bg-lime"
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
          :style="xtermStyle"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
defineOptions({
  name: 'Terminals',
})

import { provide, inject, onMounted, onActivated, reactive, ref, nextTick, watch, onUnmounted } from 'vue'
import Xterm from 'components/Xterm.vue'
import rtab from 'components/RTab.vue'
import { generateUuid, isEmptyObj } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 98 + "px" : window.innerHeight - 97 + "px",
})

const xtermStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 99 - 45 + "px" : window.innerHeight - 70 + "px",
})

const tab = ref('')

const tabs = reactive([])

const xtermRefs = reactive({}); // 存储 xterm 实例的 ref

const isShowCmdBar = ref(false)

const isShowSettingsDialog = ref(false)

const fsData = ref({})


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

        if (tabs[i].data.connectionType === t('node.remoteNode') && tabs[i].data.protocol === 'SSH') {
          window.sshTerminal.closeSSHTerminal(id)
        } else {
          window.terminal.closeTerminal(id)
        }

        tabs.splice(i, 1)
        if (tabs.length === 0) break
        tab.value = tabs[0].id
        return
      }
    }
  })
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

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 98 + "px"
    xtermStyle.height = window.innerHeight - 99 - 45 + "px"
  } else {
    cardStyle.height = window.innerHeight - 97 + "px"
    xtermStyle.height = window.innerHeight - 70 + "px"
  }
}

onMounted(() => {
  window.addEventListener('resize', checkScreenSize)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  window.removeEventListener('keydown', handleKeyDown)


  // 关闭所有后台terminal
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].data.connectionType === t('node.remoteNode') && tabs[i].data.protocol === 'SSH') {
      window.sshTerminal.closeSSHTerminal(tabs[i].id)
    } else {
      window.terminal.closeTerminal(tabs[i].id)
    }

    tabs.splice(i, 1)
    if (tabs.length === 0) break
    tab.value = tabs[0].id
    return
  }

})

onActivated(() => {
  try {
    const data = JSON.parse(route.query.data)

    if (data) {
      const uuid = generateUuid()
      tabs.push({
        id: uuid,
        label: data.label,
        icon: data.icon,
        data: data.data
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
    isShowSettingsDialog.value = false
    checkScreenSize()
  } else {
    for (let i = 0; i < tabs.length; i++) {

    }
    fsData.value = oldVal
  }
})

watch(tab, (newVal, oldVal) => {
  if (isEmptyObj(newVal)) {
    isShowSettingsDialog.value = false
    isShowSettingsDialog.value = false
    checkScreenSize()
  } else {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].id === newVal) {
        fsData.value = tabs[i]
        return
      }
    }
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
