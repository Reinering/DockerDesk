
<template>
  <q-card :style="cardStyle">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="text-h6">{{ props.data.serviceType + t('filesystem.title') }}</div>
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
</template>


<script setup>
defineOptions({
  name: 'Containers',

  components: {
    Container0: Container,
    Container1: Container,
    Container2: Container
  }
})

const props = defineProps({
  containerId: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    default: () => {},
  }
})

import { inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import Container from './Container.vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 183 + "px" : window.innerHeight - 149 + "px",
})

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

const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 183 - 122 + "px" : window.innerHeight - 149 - 122 + "px",
})

const search = ref('')

console.log("props.data", props.data)

const init = () => {
  if (props.data.connectionType === t('node.remoteNode') && props.data.serviceType === "Docker" && props.data.protocol === 'SSH') {
    window.dockerTerminal.connect({
      uuid: props.containerId,
      connID: props.data.id
    }).then((result) => {
      console.log(result)

    })


  } else if (props.data.connectionType === t('node.remoteNode') && props.data.serviceType === "Podman" && props.data.protocol === 'SSH') {

  }
}


const checkScreenSize = () => {
  console.log('check screenSize', window.innerHeight)

  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 183 + "px"
    scrollStyle.height = window.innerHeight - 183 - 122 + "px"
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
