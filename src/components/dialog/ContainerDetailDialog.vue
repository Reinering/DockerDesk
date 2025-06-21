<template>
  <q-dialog persistent>
    <q-card style="min-width: 80%">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold text-center" >{{`${props.data.names}`}}</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll q-pa-none">
        <q-splitter
          v-model="splitterModel"
          :limits="[80, 80]"
        >
          <template v-slot:before>
            <q-tabs
              v-model="tab"
              dense
              align="left"
              class="text-blue shadow-2"
              :breakpoint="0"
              indicator-color="purple"
            >
              <q-tab name="info" :label="t('panel.container.info')" />
              <q-tab name="env" :label="t('panel.container.env')" />
              <q-tab name="port" :label="t('panel.container.port')" />
              <q-tab name="network" :label="t('panel.container.network')" />
              <q-tab name="volume" :label="t('panel.container.volume')" />
              <q-tab name="link" :label="t('panel.container.link')" />
            </q-tabs>

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="info">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label >image</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label >{{props.data.image}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label >创建时间</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label >{{props.data.created}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label >状态</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label >{{props.data.status}}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label >自启动</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label >{{restartPolicy["name"]}}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label >命令</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label >{{props.data.command}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>

              <q-tab-panel name="env">
                <q-list>
                  <q-item
                    v-for="(item, key, index) in envs"
                    :key="index"
                  >
                    <q-item-section>
                      <q-item-label >{{key}}</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label >{{item}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>

              <q-tab-panel name="port">
                <q-table

                  :rows="ports"
                  :columns="columns_ports"
                  row-key="id"
                  virtual-scroll
                  :rows-per-page-options="[0]"
                  :visible-columns="visibleColumns_ports"
                  flat
                  bordered
                  hide-bottom
                />
              </q-tab-panel>

              <q-tab-panel name="network">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label >Network</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label >{{networks["network"]}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label >IP Address</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label >{{networks["ipAddress"]}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label >Gateway</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label >{{networks["gateway"]}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>

              <q-tab-panel name="volume">
                <q-table
                  :rows="volumes"
                  :columns="columns_vol"
                  row-key="id"
                  virtual-scroll
                  :rows-per-page-options="[0]"
                  :visible-columns="visibleColumns_vol"
                  flat
                  bordered
                  hide-bottom
                />
              </q-tab-panel>

              <q-tab-panel name="link">

              </q-tab-panel>

            </q-tab-panels>

          </template>

          <template v-slot:after>
            <div class="column flex flex-center justify-between">
              <q-knob
                readonly
                v-model="containerUsage.cpu.value"
                show-value
                size="70px"
                :thickness="0.1"
                color="light-blue-9"
                track-color="cyan-12"
                class="text-light-blue-9 q-ma-md"
              >
                {{ containerUsage.cpu.value }}%
              </q-knob>

              <q-knob
                readonly
                v-model="containerUsage.memoryPercent.value"
                show-value
                size="70px"
                :thickness="0.1"
                color="orange"
                track-color="orange-3"
                class="text-orange q-ma-md"
              >
                {{ containerUsage.memoryPercent.value }}%
              </q-knob>
            </div>
          </template>

        </q-splitter>


      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onCreate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
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

  onClose: {
    type: Function,
    default: () => {}
  }
})

import { inject, ref, onMounted, onUnmounted, onActivated, onDeactivated, reactive } from 'vue'
import { useComponentsStore } from 'stores/components.js'
import { isEmptyObj } from 'src/utils/common.js'
import { getPortsByContainer, parseContainerUsage } from 'src/utils/wsl.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const componentsStore = useComponentsStore()

const service = inject("service")
const serviceCmd = ref('info')

let getContainerUsageInterval = null

const splitterModel = ref(80)

const containerUsage = ref({
  cpu: {
    value: 0,
    unit: "%"
  },
  memoryUsage: {
    value: 0,
    unit: "MiB"
  },
  memoryLimit: {
    value: 0,
    unit: "GiB"
  },
  memoryPercent: {
    value: 0,
    unit: "%"
  },
  netIO: {
    input: {
      value: 0,
      unit: "kB"
    },
    output: {
      value: 0,
      unit: "kB"
    }
  },
  blockIO: {
    input: {
      value: 0,
      unit: "B"
    },
    output: {
      value: 0,
      unit: "kB"
    }
  },
  pids: 0
})

const tab = ref('info')

const containerInfo = ref({})
const restartPolicy = ref({
  name: '',
  maximumRetryCount: 0
})
const envs = ref({})
const ports = ref([])
const volumes = ref([])
const networks = reactive({})

const visibleColumns_ports = ['external', 'internal', 'protocol']
const columns_ports = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'external', label: t('panel.container.externalPort'), sortOrder: 'ad', sortable: true, align: 'left', field: 'external' },
  { name: 'internal', label: t('panel.container.internalPort'), align: 'left', field: 'internal' },
  { name: 'protocol', label: t('panel.container.protocol'), align: 'left', field: 'protocol' },
  { name: 'actions', label: t('panel.images.action'), align: 'center' }
]

const visibleColumns_vol = ['localPath', 'containerPath', 'type']
const columns_vol = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'localPath', label: t('panel.container.localPath'), sortOrder: 'ad', sortable: true, align: 'left', field: 'localPath' },
  { name: 'containerPath', label: t('panel.container.containerPath'), align: 'left', field: 'containerPath' },
  { name: 'type', label: t('panel.container.type'), align: 'left', field: 'type' },
  { name: 'actions', label: t('panel.images.action'), align: 'center' }
]


const getContainerUsage = () => {

  window.wslTerminal.execWSL(
    ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} stats ${props.data.names} --no-stream`]
  ).then((result) => {
    console.log(result)
    if (result.success) {
      if (serviceCmd.value === "docker") {
        const data = parseContainerUsage(result.data)

        containerUsage.value = data[0]
      } else {


      }

    } else {

    }
  })
}

const getContainerInfo = () => {
  window.wslTerminal.execWSL(
    ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} inspect ${props.data.names}`]
  ).then((result) => {
    console.log(result)
    if (result.success) {
      containerInfo.value = JSON.parse(result.data)[0]

      restartPolicy.value["name"] = containerInfo.value["HostConfig"]["RestartPolicy"]["Name"]
      restartPolicy.value["maximumRetryCount"] = containerInfo.value["HostConfig"]["RestartPolicy"]["MaximumRetryCount"]

      const Env = containerInfo.value["Config"]["Env"]
      const tmpEnv = {}
      for (const item of Env) {
        const tmp = item.split('=')

        tmpEnv[tmp[0]] = tmp[1]
      }

      envs.value = tmpEnv


      Object.keys(containerInfo.value["NetworkSettings"]["Networks"]).forEach(key => {
        networks["network"] = `${key} - ${containerInfo.value["NetworkSettings"]["Networks"][key]["NetworkID"].slice(0, 12)}`
        networks["ipAddress"] = containerInfo.value["NetworkSettings"]["Networks"][key]["IPAddress"]
        networks["gateway"] = containerInfo.value["NetworkSettings"]["Networks"][key]["Gateway"]
        return
      })

      const Binds = containerInfo.value["HostConfig"]["Binds"]
      if (!isEmptyObj(Binds)) {
        for (const item of Binds) {
          const tmp = {}
          const tmpp = item.split(':')
          tmp["host"] = tmpp[0]
          tmp["container"] = tmpp[1]
          tmp["type"] = tmpp[2]

          volumes.value.push(tmp)
        }
      }
    } else {

    }
  })
}


const init = () => {
  serviceCmd.value = service.serviceType
  if (isEmptyObj(serviceCmd.value)) {
    return
  }

  getContainerUsage()

  if (getContainerUsageInterval === null) {
    getContainerUsageInterval = setInterval(() => {
      getContainerUsage()
    }, 40000)
  }



  getContainerInfo()

  ports.value = getPortsByContainer([props.data["ports"]])[0]
  console.log(ports.value)
}

onMounted(() => {


  init()
})

onUnmounted(() => {
  if (getContainerUsageInterval !== null) {
    clearInterval(getContainerUsageInterval)
    getContainerUsageInterval = null
  }
})


</script>

<style scoped>

</style>
