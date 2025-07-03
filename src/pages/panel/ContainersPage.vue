<template>
  <q-card :style="cardStyle">
    <q-card-section>
      <div class="row items-center justify-between">
        <q-btn :label="t('panel.containers.create')" color="primary" @click="onShowContainerDialog" />
        <q-input v-model="search" dense label="Search" outlined clearable >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <!--    <q-card-section>-->
    <!--      <q-list bordered>-->
    <!--        <q-item v-for="item in filteredNodes" :key="item.id" clickable v-ripple>-->
    <!--          <q-item-section>{{ item.name }}</q-item-section>-->
    <!--        </q-item>-->
    <!--      </q-list>-->
    <!--    </q-card-section>-->

    <q-separator />

    <q-scroll-area :style="scrollStyle">
      <div class="q-gutter-x-md q-gutter-y-md q-pa-md row justify-center">
        <component
          :is="'Container' + item.templateId"
          v-for="(item, index) in containerDatas"
          :key="index"
          :data="item"
          :update="updateChildData"
          :delete="deleteChild"
          :toLog="toLog"
        />
      </div>
    </q-scroll-area>

  </q-card>

  <q-dialog v-if="showSelectDialog" v-model="showSelectDialog">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Close icon</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-card-section>

      <q-card-section class="q-gutter-x-md">
        <q-btn align="between" class="btn-fixed-width" color="accent" label="Align between" icon="flight_takeoff" />
        <q-btn align="around" class="btn-fixed-width" color="brown-5" label="Align around" icon="lightbulb_outline" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <CreateContainerDialog v-if="showCreateContainerDialog" v-model="showCreateContainerDialog" :onClose="onShowContainerDialog"/>
</template>


<script setup>
defineOptions({

  components: {
    Container0: Container,
    Container1: Container,
  }
})

import { inject, onMounted, onUnmounted, onActivated, onDeactivated, reactive, ref } from 'vue'
import Container from 'components/Container.vue'
import CreateContainerDialog from 'components/dialog/CreateContainerDialog.vue'
import { useComponentsStore } from 'stores/components.js'
import { parseDockerContainer, parsePodmanContainer } from 'src/utils/wsl.js'
import { clientConfig } from 'src/common/config.js'
import { isEmptyObj, firstLower } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const componentsStore = useComponentsStore()

const service = inject("service")
const serviceCmd = ref('')

const connectState = inject('connectState')
const dockerInfo = inject('dockerInfo')
const podmanInfo = inject('podmanInfo')
const wslInfo = inject('wslInfo')

let getContainerListInterval = null

const search = ref('')

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 150 -48  + "px" : window.innerHeight - 149 - 48 + "px",
})
const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 183 - 55 - 48 + "px" : window.innerHeight - 149 - 122 - 48 + "px",
})

const showSelectDialog = ref(false)

const showCreateContainerDialog = ref(false)
const onShowContainerDialog = () => {
  showCreateContainerDialog.value = !showCreateContainerDialog.value
}

const containerDatas = reactive([
  // {
  //   templateId: 1,
  //   nodeId: 1,
  //   servername: "Node 1",
  //   description: "This is a node",
  // },
])

const updateChildData = (nodeId, field, value) => {
  for (const item of containerDatas) {
    if (item["nodeId"] === nodeId) {
      if (field === "names") {
        item["servername"] = value
      }

      item["data"][field] = value
      break
    }
  }
}

const deleteChild = (nodeId) => {
  for (let i=0; i < containerDatas.length; i++) {
    if (containerDatas[i]["nodeId"] === nodeId) {
      containerDatas.splice(i, 1)

      break
    }
  }
}

const toLog = (name) => {
  const command = `${serviceCmd.value} logs  ${name}`

  router.push({
    path: 'logs',
    query: {
      tab: "logs",
      data: JSON.stringify({
        label: name,
        icon: 'terminal',
        data: {
          serviceName: service.address,
          serviceType: 'WSL',
          user: 'root',
          disableStdin: true,
          command
        }
      })
    }
  })
}

const getContainerList = () => {
  if (getContainerListInterval !== null) {
    clearInterval(getContainerListInterval)
    getContainerListInterval = null
  }

  if (service.connectionType === t('node.remoteNode')) {
    if (!connectState.value) {
      return
    }

    if (serviceCmd.value === "docker" && !dockerInfo.enable) {
      return
    } else if (serviceCmd.value === "podman" && !podmanInfo.enable) {
      return
    }

    window.containerTerminal.exec({
      connID: service.id,
      command: `${serviceCmd.value} ps -a`
    }).then((result) => {
      if (result.success) {
        containerDatas.length = 0

        if (serviceCmd.value === "docker") {
          const items = parseDockerContainer(result.data)
          for (let i=0; i < items.length; i++) {
            containerDatas.push({
              nodeId: i,
              templateId: 0,
              servername: items[i]["names"],
              description: '',
              data: items[i],
              serviceCmd: serviceCmd.value
            })
          }
        } else if (serviceCmd.value === "podman") {
          const items = parsePodmanContainer(result.data)
          for (let i=0; i < items.length; i++) {
            containerDatas.push({
              nodeId: i,
              templateId: 0,
              servername: items[i]["names"],
              description: '',
              data: items[i],
              serviceCmd: serviceCmd.value
            })
          }
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.getNetworksError')}: ${result.error}`,
        })
      }
    })
  } else {
    if (!wslInfo.enable) {
      return
    }

    if (serviceCmd.value === "docker" && !dockerInfo.enable) {
      return
    } else if (serviceCmd.value === "podman" && !podmanInfo.enable) {
      return
    }

    window.wslTerminal.execWSL([
      '-d', service.address, '--user', 'root', '-e', `${serviceCmd.value} ps -a`
    ]).then((result) => {
      if (result.success) {
        containerDatas.length = 0

        if (serviceCmd.value === "docker") {
          const items = parseDockerContainer(result.data)
          for (let i=0; i < items.length; i++) {
            containerDatas.push({
              nodeId: i,
              templateId: 0,
              servername: items[i]["names"],
              description: '',
              data: items[i],
              serviceCmd: serviceCmd.value
            })
          }
        } else if (serviceCmd.value === "podman") {
          const items = parsePodmanContainer(result.data)
          for (let i=0; i < items.length; i++) {
            containerDatas.push({
              nodeId: i,
              templateId: 0,
              servername: items[i]["names"],
              description: '',
              data: items[i],
              serviceCmd: serviceCmd.value
            })
          }
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.getNetworksError')}: ${result.error}`,
        })
      }
    })
  }

  getContainerListInterval = setInterval(() => {
    getContainerList()
  }, 30000)
}

componentsStore.refreshContainers = getContainerList

const init = async () => {
  await setTimeout(() => {}, 500)

  serviceCmd.value = firstLower(service.serviceType)
  if (isEmptyObj(serviceCmd.value)) {
    return
  }

  getContainerList()

  if (getContainerListInterval === null) {
    getContainerListInterval = setInterval(() => {
      getContainerList()
    }, 30000)
  }
}

const checkScreenSize = () => {
  // console.log('check screenSize', window.innerHeight)

  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 150 - 48 + "px"
    scrollStyle.height = window.innerHeight - 183 - 55 - 48 + "px"
  } else {
    cardStyle.height = window.innerHeight - 149 - 48 + "px"
    scrollStyle.height = window.innerHeight - 149 - 122 - 48 + "px"
  }
}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenSize)
})

onActivated(() => {
  if (getContainerListInterval === null) {
    getContainerListInterval = setInterval(() => {
      getContainerList()
    }, 30000)
  }
})

onDeactivated(() => {
  if (getContainerListInterval !== null) {
    clearInterval(getContainerListInterval)
    getContainerListInterval = null
  }
})

onUnmounted(() => {
  if (getContainerListInterval !== null) {
    clearInterval(getContainerListInterval)
  }

  window.removeEventListener('resize', checkScreenSize)
})


</script>


<style scoped>

</style>
