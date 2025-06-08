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
                <q-btn :label="dockerBtn" color="primary" @click="onInstallDocker" />
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
                <q-btn :label="podmanBtn" color="primary" @click="onInstallPodman" />
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

  <DockerSettingsDialog v-model="showDockerSettingsDialog" />
  <PodmanSettingsDialog v-model="showPodmanSettingsDialog"/>
</template>

<script setup>
import { ref, inject, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'
import DockerSettingsDialog from 'components/dialog/DockerSettingsDialog.vue'
import PodmanSettingsDialog from 'components/dialog/PodmanSettingsDialog.vue'
import {  QSpinnerGears } from 'quasar'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")
const deviceInfo = inject("deviceInfo")

let notify = ref(null)

const cpuValue = ref(0)
const memoryValue = ref(0)

const dockerBtn = ref(t('asslocal.install'))
const podmanBtn = ref(t('asslocal.install'))
const dockerInfo = ref('')
const podmanInfo = ref('')

const onInstallDocker = () => {
  if (dockerBtn.value === t('asslocal.install')) {
    window.wslTerminal.execWSL(['-d', "DockerDesk", '--user', "root", '-e', "bash", "-c", "\"curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun systemctl enable --now docker >/dev/null 2>&1\""])
      .then((result) => {
        console.log(result)
        if (result.success) {
          notify.value({
            type: 'positive',
            group: false,
            spinner: false,
            message: `${t('assistant.installSuccess')}`,
            timeout: 10000
          })

          checkDockerInstall()
        } else {
          notify.value({
            type: 'negative',
            icon: 'done',
            spinner: false,
            message: `${t('assistant.installFail')}: ${result.error}`,
            timeout: 10000
          })
        }
      })

    notify.value = $q.notify({
      type: 'info',
      group: false,
      timeout: 0,
      spinner: true,
      position: 'bottom-right',
      message: t('assistant.installing'),
    })
  } else {
    showDockerSettingsDialog.value = !showDockerSettingsDialog.value
  }
}

const onInstallPodman = () => {
  if (podmanBtn.value === t('asslocal.install')) {
    window.wslTerminal.execWSL(['-d', "DockerDesk", '--user', "root", '-e', "env DEBIAN_FRONTEND=noninteractive apt-get -qq -y install podman"])
      .then((result) => {
        console.log(result)
        if (result.success) {
          notify.value({
            type: 'positive',
            group: false,
            spinner: false,
            message: `${t('assistant.installSuccess')}`,
            timeout: 10000
          })

          checkPodmanInstall()
        } else {
          notify.value({
            type: 'negative',
            icon: 'done',
            spinner: false,
            message: `${t('assistant.installFail')}: ${result.error}`,
            timeout: 10000
          })
        }
      })

    notify.value = $q.notify({
      type: 'info',
      group: false,
      timeout: 0,
      spinner: true,
      position: 'bottom-right',
      message: t('assistant.installing'),
    })
  } else {
    showPodmanSettingsDialog.value = !showPodmanSettingsDialog.value
  }
}

const showDockerSettingsDialog = ref(false)
const showPodmanSettingsDialog = ref(false)


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

let getOSInfoInterval = null

const checkDockerInstall = () => {
  window.wslTerminal.execWSL([
    '-d', "DockerDesk", '--user', "root", '-e', "docker -v"
  ]).then((result) => {
    if (result.success) {
      const versionRegex = /(\d+\.\d+\.\d+)/
      const match = result.data.match(versionRegex)

      if (match) {
        const versionNumber = match[1]
        dockerInfo.value = `version: ${versionNumber}`
        dockerBtn.value =t('asslocal.settings')
      } else {
        console.log("未找到Docker版本号。")
      }
    } else {
      dockerBtn.value = t('asslocal.install')
      dockerInfo.value = t('asslocal.notInstalled')
    }
  })
}

const checkPodmanInstall = () => {
  window.wslTerminal.execWSL([
    '-d', "DockerDesk", '--user', "root", '-e', "podman -v"
  ]).then((result) => {
    console.log(result)
    if (result.success && result.data.includes("podman version ")) {
      const versionRegex = /\d+\.\d+\.\d+/
      const match = result.data.match(versionRegex)

      if (match) {
        const versionNumber = match[0]
        podmanInfo.value = `version: ${versionNumber}`
        podmanBtn.value = t('asslocal.settings')
      } else {
        console.log("未找到Podman版本号。")
      }
    } else {
      podmanBtn.value = t('asslocal.install')
      podmanInfo.value = t('asslocal.notInstalled')
    }
  })
}


const init = () => {
  showLoading ()

  checkDockerInstall()

  checkPodmanInstall()

  if (deviceInfo.value.platform === "win32") {
    window.wslTerminal.checkWSLInfo().then((result) => {
      console.log(result.data)
    })

    window.wslTerminal.getWSLList().then((result) => {
      console.log(result.data)
    })
  }


  getOSInfoInterval = setInterval(() => {
    window.client.getOSUtilization().then(({cpuUsage, memoryUsage}) => {
      cpuValue.value = parseInt(cpuUsage)
      memoryValue.value = parseInt(memoryUsage * 100)
    })
  }, 5000)
}

onMounted(() => {
  init()
})

onActivated(() => {
  if (getOSInfoInterval !== null) {
    getOSInfoInterval = setInterval(() => {
      window.client.getOSUtilization().then(({cpuUsage, memoryUsage}) => {
        cpuValue.value = parseInt(cpuUsage)
        memoryValue.value = parseInt(memoryUsage * 100)
      })
    }, 5000)
  }
})

onDeactivated(() => {
  if (getOSInfoInterval !== null) {
    clearInterval(getOSInfoInterval)
  }
})

onUnmounted(() => {

})


</script>

<style scoped>

</style>
