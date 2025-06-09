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

    <q-scroll-area :style="scrollStyle">
      <div class="q-gutter-x-md q-gutter-y-md row justify-center">
        <component :is="'Container' + item.templateId" v-for="(item, index) in containerDatas" :key="index" :data="item" />
      </div>
    </q-scroll-area>

  </q-card>

  <ContainerDialog v-model="ShowContainerDialog" :onClose="onShowContainerDialog"/>
</template>


<script setup>
defineOptions({

  components: {
    Container0: Container,
    Container1: Container,
  }
})

import { inject, onActivated, onMounted, onUnmounted, reactive, ref } from 'vue'
import Container from 'components/Container.vue'
import ContainerDialog from 'components/dialog/ContainerDialog.vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const service = inject("service")

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 150 + "px" : window.innerHeight - 149 + "px",
})
const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 183 - 55 + "px" : window.innerHeight - 149 - 122 + "px",
})


const ShowContainerDialog = ref(false)
const onShowContainerDialog = () => {
  ShowContainerDialog.value = !ShowContainerDialog.value
}

const containerDatas = [
  {
    templateId: 1,
    nodeId: 1,
    servername: "Node 1",
    description: "This is a node",
    state: "offline"
  },
  {
    templateId: 1,
    nodeId: 2,
    servername: "Node 2",
    description: "This is a node",
    state: "online"
  },
  {
    templateId: 1,
    nodeId: 3,
    servername: "Node 2",
    description: "This is a node",
    state: "online"
  },
  {
    templateId: 1,
    nodeId: 4,
    servername: "Node 2",
    description: "This is a node",
    state: "online"
  },
  {
    templateId: 1,
    nodeId: 4,
    servername: "Node 2",
    description: "This is a node",
    state: "online"
  },
  {
    templateId: 1,
    nodeId: 5,
    servername: "Node 2",
    description: "This is a node",
    state: "online"
  },
  {
    templateId: 1,
    servername: "Node 2",
    description: "This is a node",
    state: "online"
  },
  {
    templateId: 1,
    nodeId: 6,
    servername: "Node 2",
    description: "This is a node",
    state: "online"
  },
  {
    templateId: 1,
    nodeId: 7,
    servername: "Node 2",
    description: "This is a node",
    state: "online"
  }
]

const data = { id: 'mails', label: 'Mails', icon: 'check', data: service}


const search = ref('')

console.log("props.data", data)

const init = () => {
  if (data.connectionType === t('node.remoteNode') && data.serviceType === "Docker" && data.protocol === 'SSH') {
    window.dockerTerminal.connect({
      uuid: data.id,
      connID: data.id
    }).then((result) => {
      console.log(result)

    })


  } else if (data.connectionType === t('node.remoteNode') && data.serviceType === "Podman" && data.protocol === 'SSH') {

  }
}

const checkScreenSize = () => {
  console.log('check screenSize', window.innerHeight)

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



onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})


</script>


<style scoped>

</style>
