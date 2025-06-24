<template>
<!--  <q-layout view="lHh Lpr lFf" container :style="background" class="shadow-2 rounded-borders">-->
<!--    -->
<!--  </q-layout>-->

  <q-page q-pa-md>
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

    <q-tab-panels v-model="tab" animated style="height: 100%" keep-alive >
      <q-tab-panel
        v-for="item in tabs"
        :key="item.id"
        :name="item.id"
      >
        <Containers
          :container-id="item.id"
          :data="item.data"
        />
      </q-tab-panel>
    </q-tab-panels>

    <q-page-sticky position="bottom-right" :offset="fabPos">
      <q-fab
        icon="add"
        direction="up"
        color="accent"
        :disable="draggingFab"
        v-touch-pan.prevent.mouse="moveFab"
      >
        <!--        <q-fab-action @click="showCmdBar" color="primary" icon="keyboard_command_key" :disable="draggingFab">-->
        <!--          <q-tooltip>-->
        <!--            CMD Bar-->
        <!--          </q-tooltip>-->
        <!--        </q-fab-action>-->
        <!--        <q-fab-action @click="showFileSystem" color="primary" icon="storage" :disable="draggingFab">-->
        <!--          <q-tooltip>-->
        <!--            FileSystem-->
        <!--          </q-tooltip>-->
        <!--        </q-fab-action>-->
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'DockerNodes',
})

import { inject, onMounted, onActivated, reactive, ref, nextTick, watch, onUnmounted } from 'vue'
import rtab from 'components/RTab.vue'
import Containers from 'src/components/Containers.vue'
import { useNavigatorStore } from 'stores/navigator.js'
import { generateUuid, isEmptyObj } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")
const navigatorStore = useNavigatorStore()

const background = reactive({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: window.innerHeight - 70 + "px"
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
  // { id: 'alarms', label: 'Alarms', icon: 'unfold_less', data: {}},
  // { id: 'movies', label: 'Movies', icon: 'movie', data: {}},
])


const checkScreenSize = () => {
  console.log('check screenSize', window.innerHeight, background.height)

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
        if (tabs[i].data.connectionType === t('node.remoteNode') && tabs[i].data.serviceType === "Docker" && tabs[i].data.protocol === 'SSH') {
          window.dockerTerminal.close(id)
        }

        tabs.splice(i, 1)
        if (tabs.length === 0) break
        tab.value = tabs[0].id
        return
      }
    }
  })
}

onMounted(() => {
  window.addEventListener('resize', checkScreenSize)

})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

onActivated(() => {
  try {
    const data = JSON.parse(route.query.data).data
    if (data) {
      const uuid = generateUuid()
      tabs.push({
        id: uuid,
        label: data.serviceName,
        icon: 'view_comfy',
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
