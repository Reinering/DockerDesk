<template>
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
          <q-card>
            <q-card-section>
              <div class="row items-center justify-between">
                <div class="text-h6">{{item.data.serviceType}} {{t('management')}}({{item.label}})</div>
<!--                <q-btn :label="t('node.addService')" color="primary" @click="showDialog = true" />-->
              </div>
            </q-card-section>
            <q-table
              :rows="services"
              :columns="columns"
              row-key="id"
              virtual-scroll
              v-model:pagination="pagination"
              :rows-per-page-options="[0]"
              :visible-columns="visibleColumns"
              flat
              bordered
              :style="tableStyle"
            >
<!--              <template v-slot:body-cell-actions="props">-->
<!--                <q-btn-->
<!--                  icon="edit"-->
<!--                  color="primary"-->
<!--                  dense-->
<!--                  flat-->
<!--                  @click="showEdit(props.row)"-->
<!--                >-->
<!--                  <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                    {{t('edit')}}-->
<!--                  </q-tooltip>-->
<!--                </q-btn>-->
<!--                <q-btn-->
<!--                  icon="delete"-->
<!--                  color="negative"-->
<!--                  dense-->
<!--                  flat-->
<!--                  @click="deleteService(props.row.id)"-->
<!--                >-->
<!--                  <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                    {{t('delete')}}-->
<!--                  </q-tooltip>-->
<!--                </q-btn>-->
<!--                <q-btn-->
<!--                  v-if="props.row.connectionType === t('node.remoteNode')"-->
<!--                  icon="link"-->
<!--                  color="negative"-->
<!--                  dense-->
<!--                  flat-->
<!--                  @click="connectService(props.row)"-->
<!--                >-->
<!--                  <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                    {{t('connect')}}-->
<!--                  </q-tooltip>-->
<!--                </q-btn>-->

<!--              </template>-->
            </q-table>
          </q-card>
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
import { useNavigatorStore } from 'stores/navigator.js'

defineOptions({
  name: 'DockerNodes',
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
const navigatorStore = useNavigatorStore()

const tableStyle = reactive({
  height: window.innerHeight - 210 + "px",
})
const pagination = ref({
  rowsPerPage: 0
})


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

const isShowCmdBar = ref(false)

const columns = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'serviceName', label: t('node.serviceName'), align: 'left', field: 'serviceName' },
  { name: 'connectionType', label: t('node.connectionType'), align: 'left', field: 'connectionType' },
  { name: 'serviceType', label: t('node.serviceType'), align: 'left', field: 'serviceType' },
  { name: 'address', label: t('node.address'), align: 'left', field: 'address' },
  { name: 'port', label: t('node.port'), align: 'left', field: 'port' },
  { name: 'actions', label: t('node.action'), align: 'center' }
]

const visibleColumns = ['serviceName', 'connectionType', 'serviceType', 'address', 'port', 'actions']

const services = reactive([
  { id: '111111', serviceName: '本地 Docker', connectionType: '本地节点', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { id: '111112', serviceName: '远程 Podman', connectionType: '远程节点', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
])

const submitCmd = () => {

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
