<template>
  <q-page>
    <q-tabs
      no-caps
      inline-label
      switch-indicator
      indicator-color="primary"
      class="bg-lime shadow-2"
      align="left"
      v-model="tab"
    >
      <RTab
        :ref="(el) => (rTabRefs[item.id] = el)"
        v-for="item in tabs"
        :key="item.id"
        :name="item.id"
        :icon="item.icon"
        :label="item.label"
        @click="deleteTab(item.id)"
      />
    </q-tabs>

    <q-tab-panels v-model="tab" animated style="height: 100%" keep-alive>
      <q-tab-panel
        v-for="item in tabs"
        :key="item.id"
        :name="item.id"
        class="q-pa-none"
      >
        <router-view v-slot="{ Component }">
          <keep-alive >
            <component :is="Component" />
          </keep-alive>
        </router-view>
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

    <q-dialog v-if="isShowFileSystemDialog" v-model="isShowFileSystemDialog" >
      <FileSystem  :data="fsData" />
    </q-dialog>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'DockerNodes',
})

import { inject, onMounted, onActivated, reactive, ref, nextTick, watch, onUnmounted } from 'vue'
import RTab from 'components/RTab.vue'
import FileSystem from 'components/FileSystem.vue'
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
  height: window.innerHeight - 22 + "px"
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

const rTabRefs = reactive({})
const tab = ref('')

const tabs = reactive([
  // { id: 'mails', label: 'Mails', icon: 'check', data: {}},
])

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

const isShowFileSystemDialog = ref(false)

const showFileSystem = () => {
  if (tab.value === '') {
    isShowFileSystemDialog.value = false
    return
  }

  isShowFileSystemDialog.value = ! isShowFileSystemDialog.value
}

const fsData = ref({})



const checkScreenSize = () => {
  console.log('check screenSize', window.innerHeight, background.height)

}

onMounted(() => {
  window.addEventListener('resize', checkScreenSize)

})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const addTab = () => {
  try {
    const data = JSON.parse(route.query.data).data
    if (data) {
      for (const item of tabs) {
        if (item.label === data.serviceName) {
          tab.value = item.id
          return
        }
      }

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
}

onActivated(() => {
  addTab()

})

watch(tabs, (newVal, oldVal) => {
  if (tabs.length === 0) {

    checkScreenSize()
  } else {
    for (let i = 0; i < tabs.length; i++) {

    }
    fsData.value = oldVal
  }
})

watch(tab, (newVal, oldVal) => {
  if (!isEmptyObj(oldVal)) {
    rTabRefs[oldVal].showDelete(false)
  }

  if (isEmptyObj(newVal)) {

    checkScreenSize()
  } else {
    try {
      rTabRefs[newVal].showDelete(true)
    } catch (e) {
      // console.log(e)
    }

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
