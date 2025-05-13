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

      <q-tab-panels v-model="tab" animated style="height: 100%">
<!--        class="grey-9 text-white"-->
        <q-tab-panel
          v-for="item in tabs"
          :key="item.id"
          :name="item.id"
          class="no-padding"
        >
          <Xterm
            :terminal-id="item.id"
            :connection="tab.connection"
            :ref="(el) => (xtermRefs[item.id] = el)"
            :style="cardStyle"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <CommandBar v-if="isShowCmdBar" fixed-bottom/>

    <q-page-sticky position="bottom-right" :offset="fabPos">
      <q-fab
        icon="add"
        direction="up"
        color="accent"
        :disable="draggingFab"
        v-touch-pan.prevent.mouse="moveFab"
      >
        <q-fab-action @click="showCmdBar" color="primary" icon="person_add" :disable="draggingFab">
          <q-tooltip>
            CMD Bar
          </q-tooltip>
        </q-fab-action>
        <q-fab-action @click="onClick" color="primary" icon="mail" :disable="draggingFab">
          <q-tooltip>
            CMD Bar
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

import { inject, onMounted, onActivated, reactive, ref, nextTick, watch } from 'vue'
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
  height: process.env.MODE === 'electron' ? window.innerHeight - 70 + "px" : window.innerHeight - 70 + "px"
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
  { id: 'mails', label: 'Mails', icon: 'check', data: {}},
  { id: 'alarms', label: 'Alarms', icon: 'unfold_less', data: {}},
  { id: 'movies', label: 'Movies', icon: 'movie', data: {}},
])

const xtermRefs = ref({}); // 存储 xterm 实例的 ref

const isShowCmdBar = ref(false)

const showCmdBar = () => {
  console.log('showCmdBar', window.innerHeight)
  isShowCmdBar.value = ! isShowCmdBar.value
  if (isShowCmdBar.value) {
    if (process.env.MODE === 'electron') {
      cardStyle.height = window.innerHeight - 230 - 66 - 5 + "px"
    } else {
      cardStyle.height = window.innerHeight - 222 - 42 - 5 + "px"
    }
  } else {
    if (process.env.MODE === 'electron') {
      cardStyle.height = window.innerHeight - 70 + "px"
    } else {
      cardStyle.height = window.innerHeight - 70 + "px"
    }
  }
}

const checkScreenSize = () => {
  // console.log('check screenHeightSize', window.innerHeight)

  if (isShowCmdBar.value) {
    if (process.env.MODE === 'electron') {
      cardStyle.height = window.innerHeight - 230 - 66 + "px"
    } else {
      cardStyle.height = window.innerHeight - 222 - 42 + "px"
    }
  } else {
    if (process.env.MODE === 'electron') {
      cardStyle.height = window.innerHeight - 70 + "px"
    } else {
      cardStyle.height = window.innerHeight - 70 + "px"
    }
  }

}

const deleteTab = (id) => {
  $q.dialog({
    title: t('confirm'),
    message: t('terminal.closeMessage'),
    cancel: true,
    persistent: true
  }).onOk(() => {
    for (let i = 0; i < tabs.length; i++) {
      if ( tabs[i].id === id) {
        window.terminal.closeTerminal()

        tabs.splice(i, 1)
        return
      }
    }
  })
}

onMounted(() => {
  window.addEventListener('resize', checkScreenSize)

})

onActivated(() => {
  try {
    const data = JSON.parse(route.query.data).data
    if (data) {
      const uuid = generateUuid()
      tabs.push({
        id: uuid,
        label: data.serviceName,
        icon: 'unfold_less',
        data: data
      })
      tab.value = uuid
    }
  } catch (e) {
    // console.error(e)
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
