<template>
  <q-page q-pa-md padding >
    <div class="text-h5 q-mb-md">本地 Docker / Podman</div>

    <div class="q-pa-md row  justify-center">
      <q-card class="bg-primary " style="width: 80%; height: 250px;">
        <div class="q-ma-md row justify-evenly">
          <q-card class="bg-light-blue q-ma-md q-pa-md" style="width: 200px; height: 200px;">
            <div class="column items-center">
              <q-icon name="img:src/static/png/docker-512x512.png" style="width: 80px; height: 80px;" />
              <div class="text-h6">Docker</div>
            </div>

            <div class="column items-center">
              <div class="text-amber">{{ dockerInfo }}</div>
              <q-card-actions align="center">
                <q-btn label="添加" color="primary" />
              </q-card-actions>
            </div>

          </q-card>

          <q-card class="bg-grey-6 q-ma-md q-pa-md"  style="width: 200px; height: 200px;">
            <div class="column items-center">
              <q-icon name="img:src/static/png/podman-512x512.png" style="width: 80px; height: 80px;" />
              <div class="text-h6">Podman</div>
            </div>

            <div class="column items-center">
              <div class="text-amber">{{ podmanInfo }}</div>
              <q-card-actions align="center">
                <q-btn label="添加" color="primary" />
              </q-card-actions>
            </div>
          </q-card>
        </div>
      </q-card>



      <q-card>
        <div class="q-pa-md flex flex-center">
          <q-knob
            readonly
            v-model="cpuValue"
            show-value
            size="90px"
            :thickness="0.22"
            color="light-blue-9"
            track-color="cyan-12"
            class="text-light-blue-9 q-ma-md"
          >
            {{ cpuValue }}%
          </q-knob>

          <q-knob
            readonly
            v-model="memoryValue"
            show-value
            size="90px"
            :thickness="0.22"
            color="orange"
            track-color="orange-3"
            class="text-orange q-ma-md"
          >
            {{ memoryValue }}%
          </q-knob>
        </div>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import {  QSpinnerGears } from 'quasar'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")
const deviceInfo = inject("deviceInfo")

const cpuValue = ref(0)
const memoryValue = ref(0)

const dockerInfo = ref('')
const podmanInfo = ref('')

const showLoading = () => {
  $q.loading.show({
    message: 'First message. Gonna change it in 3 seconds...'
  })

  let timer = setTimeout(() => {
    $q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      messageColor: 'black',
      backgroundColor: 'yellow',
      message: 'Updated message'
    })

    timer = setTimeout(() => {
      $q.loading.hide()
      timer = void 0
    }, 2000)
  }, 2000)
}

const init = () => {
  showLoading ()

  window.dockerTerminal.checkDockerInfo().then((result) => {
    if (result.success && result.data.includes("docker version ")) {
      dockerInfo.value = result.data
    } else {
      dockerInfo.value = 'docker未安装'
    }
  })

  window.podmanTerminal.checkPodmanInfo().then((result) => {
    if (result.success && result.data.includes("podman version ")) {
      podmanInfo.value = result.data
    } else {
      podmanInfo.value = 'podman未安装'
    }
  })

  if (deviceInfo.value.platform === "win32") {
    window.wslTerminal.checkWSLInfo().then((result) => {
      console.log(result.data)
    })

    window.wslTerminal.getWSLList().then((result) => {
      console.log(result.data)
    })
  }


  setInterval(() => {
    window.client.getOSUtilization().then(({cpuUsage, memoryUsage}) => {
      cpuValue.value = parseInt(cpuUsage)
      memoryValue.value = parseInt(memoryUsage * 100)
    })
  }, 5000)
}

onMounted(() => {
  init()
})



</script>

<style scoped>

</style>
