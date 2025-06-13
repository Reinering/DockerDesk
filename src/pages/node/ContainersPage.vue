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
        />
      </div>
    </q-scroll-area>

  </q-card>

  <CreateContainerDialog v-model="showCreateContainerDialog" :onClose="onShowContainerDialog"/>
</template>


<script setup>
import { isEmptyObj } from 'src/utils/common.js'

defineOptions({

  components: {
    Container0: Container,
    Container1: Container,
  }
})

import { inject, onMounted, onUnmounted, onActivated, onDeactivated, reactive, ref } from 'vue'
import Container from 'components/Container.vue'
import CreateContainerDialog from 'components/dialog/CreateContainerDialog.vue'
import { parseDockerContainer } from 'src/utils/wsl.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const service = inject("service")
const serviceCmd = ref('')

let getContainerListInterval = null

const search = ref('')

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 150 + "px" : window.innerHeight - 149 + "px",
})
const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 183 - 55 + "px" : window.innerHeight - 149 - 122 + "px",
})

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

const getContainerList = () => {
  window.wslTerminal.execWSL([
    '-d', 'DockerDesk', '--user', 'root', '-e', `${serviceCmd.value} ps -a`
  ]).then((result) => {
    if (result.success) {
      containerDatas.length = 0
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
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.networks.getNetworksError')}: ${result.error}`,
      })
    }
  })
}

const init = async () => {
  await setTimeout(() => {}, 500)

  serviceCmd.value = service.serviceType
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
    cardStyle.height = window.innerHeight - 150 + "px"
    scrollStyle.height = window.innerHeight - 183 - 55 + "px"
  } else {
    cardStyle.height = window.innerHeight - 149 + "px"
    scrollStyle.height = window.innerHeight - 149 - 122 + "px"
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

  window.removeEventListener('resize', checkScreenSize)
})


</script>


<style scoped>

</style>
