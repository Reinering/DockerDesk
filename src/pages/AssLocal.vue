<template>
  <q-page q-pa-md padding >
    <div class="text-h5 q-mb-md">本地 Docker / Podman</div>

    <div class="q-pa-md row  justify-center">
      <q-card class="bg-primary " style="width: 80%; height: 250px;">
        <div class="q-ma-md row justify-evenly">
          <q-card class="bg-light-blue q-ma-md" style="width: 200px; height: 200px;">
            <div class="column items-center">
              <q-icon :name="`img:${dockerIconPath}`" style="width: 80px; height: 80px;" />
              <div class="text-h6">Docker</div>
            </div>

            <div class="column items-center">
              <div class="text-amber">{{ dockerInfo }}</div>
              <q-card-actions align="center">
                <q-btn-dropdown
                  split
                  color="primary"
                  icon="install_desktop"
                  :disable="isDockerBtn"
                  :label="dockerBtn"
                  @click="onInstallDocker"
                >
                  <q-list dense class="bg-blue-grey-13" >
                    <q-item
                      clickable
                      v-close-popup
                      size="sm"
                      :disable="isReinstallDocker"
                      @click.stop.prevent="onReinstallDocker"
                    >
                      <q-item-section>
                        <q-icon name="install_desktop" color="teal-7"/>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label caption text-weight-medium>{{t('asslocal.reinstall')}}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-close-popup
                      size="sm"
                      :disable="isRestartDocker"
                      @click.stop.prevent="onRestartDocker"
                    >
                      <q-item-section>
                        <q-icon name="restart_alt" color="red" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label caption text-weight-medium>{{t('asslocal.restart')}}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-card-actions>
            </div>
          </q-card>

          <q-card class="bg-grey-6 q-ma-md"  style="width: 200px; height: 200px;">
            <div class="column items-center">
              <q-icon :name="`img:${podmanIconPath}`"  style="width: 80px; height: 80px;" />
              <div class="text-h6">Podman</div>
            </div>

            <div class="column items-center">
              <div class="text-amber">{{ podmanInfo }}</div>
              <q-card-actions align="center">
                <q-btn-dropdown
                  split
                  color="primary"
                  icon="install_desktop"
                  :disable="isPodmanBtn"
                  :label="podmanBtn"
                  @click="onInstallPodman"
                >
                  <q-list dense class="bg-blue-grey-13" >
                    <q-item
                      clickable
                      v-close-popup
                      size="sm"
                      :disable="isReinstallPodman"
                      @click.stop.prevent="onReinstallPodman"
                    >
                      <q-item-section>
                        <q-icon name="install_desktop" color="teal-7"/>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label caption>{{t('asslocal.reinstall')}}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-close-popup
                      size="sm"
                      :disable="isRestartPodman"
                      @click.stop.prevent="onTerminal"
                    >
                      <q-item-section>
                        <q-icon name="restart_alt" color="red" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label caption>{{t('asslocal.restart')}}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-card-actions>
            </div>
          </q-card>
        </div>
      </q-card>

      <q-card class="q-ma-md">
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

<!--  <DockerSettingsDialog v-model="showDockerSettingsDialog" />-->
<!--  <PodmanSettingsDialog v-model="showPodmanSettingsDialog"/>-->
</template>

<script setup>
import { ref, inject, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'
import DockerSettingsDialog from 'components/dialog/DockerSettingsDialog.vue'
import PodmanSettingsDialog from 'components/dialog/PodmanSettingsDialog.vue'
import {  QSpinnerGears } from 'quasar'
import { getResourcePath, truncateMsg } from 'src/utils/common.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")
const deviceInfo = inject("deviceInfo")

let notify = ref(null)
const dockerIconPath = getResourcePath('png/docker-512x512.png')
const podmanIconPath = getResourcePath('png/podman-512x512.png')

const gotoNodePanel = (serviceType) => {
  router.push({path: '/node/containers',
    query: {data:
        JSON.stringify(
          {serviceType: serviceType, connectionType: t('node.localNode')}
        )}
  })
}

const cpuValue = ref(0)
const memoryValue = ref(0)

const dockerBtn = ref(t('asslocal.install'))
const podmanBtn = ref(t('asslocal.install'))
const isDockerBtn = ref(true)
const isReinstallDocker = ref(true)
const isRestartDocker = ref(true)
const isPodmanBtn = ref(true)
const isReinstallPodman = ref(true)
const isRestartPodman = ref(true)
const dockerInfo = ref(t('asslocal.notInstalled'))
const podmanInfo = ref(t('asslocal.notInstalled'))

const mirrors = ["Aliyun", "AzureChinaCloud"]

const onInstallDocker = () => {
  if (dockerBtn.value === t('asslocal.install')) {
    window.wslTerminal.execSWSL([
      // https://raw.githubusercontent.com/docker/docker-install/master/install.sh https://get.docker.com
      // ['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', `"curl -fsSL https://raw.githubusercontent.com/docker/docker-install/master/install.sh | bash -s docker --mirror ${mirrors[1]} && systemctl enable --now docker >/dev/null 2>&1"`],
      ['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', "\"curl -fsSL https://get.docker.com | bash -s docker && systemctl enable --now docker >/dev/null 2>&1\""],
    ]).then((installDockerResult) => {
      window.wslTerminal.execWSL(
        ['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', `"docker --version"`]
      ).then((result) => {
        if (!result.success) {
          isDockerBtn.value = false

          return notify.value({
            type: 'negative',
            icon: 'done',
            spinner: false,
            message: `${t('assistant.dockerInstallFail')}: ${truncateMsg(installDockerResult.error)}`,
            timeout: 10000
          })
        }

        window.wslTerminal.execWSL(
          // ['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', "\"curl -L https://github.com/docker/compose/releases/download/v2.36.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose && ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose\""]
          ['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', "\"curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose && ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose\""]
        ).then((installDCResult) => {
          window.wslTerminal.execWSL(
            ['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', `"docker-compose --version"`]
          ).then((result) => {
            if (result.success) {
              notify.value({
                type: 'positive',
                group: false,
                spinner: false,
                message: `${t('assistant.installSuccess')}`,
                timeout: 10000
              })

              checkDockerInstall()

              window.nodes.updateNode(JSON.stringify({
                id: '11111111',
                delete_flags: 2
              })).then((result) => {
                if (result.success) {

                } else {

                }
              })
            } else {
              notify.value({
                type: 'negative',
                icon: 'done',
                spinner: false,
                message: `${t('assistant.dcInstallFail')}: ${truncateMsg(installDCResult.error)}`,
                timeout: 10000
              })
            }

            isDockerBtn.value = false
          })
        })
      })
    })

    isDockerBtn.value = true
    notify.value = $q.notify({
      type: 'info',
      group: false,
      timeout: 0,
      spinner: true,
      position: 'bottom-right',
      message: t('assistant.installing'),
    })
  } else if (dockerBtn.value === t('asslocal.panel')) {
    gotoNodePanel("docker")
  } else {
    showDockerSettingsDialog.value = !showDockerSettingsDialog.value
  }
}

const onInstallPodman = () => {
  if (podmanBtn.value === t('asslocal.install')) {
    window.wslTerminal.execWSL(['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', "env DEBIAN_FRONTEND=noninteractive apt-get -qq -y install podman podman-compose"])
      .then((result) => {
        window.wslTerminal.execWSL(
          ['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', `"podman-compose -v"`]
        ).then((result) => {
          if (result.success) {
            notify.value({
              type: 'positive',
              group: false,
              spinner: false,
              message: `${t('assistant.installSuccess')}`,
              timeout: 10000
            })

            checkPodmanInstall()

            window.nodes.updateNode(JSON.stringify({
              id: '11111112',
              delete_flags: 2
            })).then((result) => {
              if (result.success) {

              } else {

              }
            })
          } else {
            isDockerBtn.value = false

            notify.value({
              type: 'negative',
              icon: 'done',
              spinner: false,
              message: `${t('assistant.installFail')}: ${result.error}`,
              timeout: 10000
            })
          }

          isPodmanBtn.value = false
        })
      })

    isPodmanBtn.value = true
    notify.value = $q.notify({
      type: 'info',
      group: false,
      timeout: 0,
      spinner: true,
      position: 'bottom-right',
      message: t('assistant.installing'),
    })
  } else if (podmanBtn.value === t('asslocal.panel')) {
    gotoNodePanel("podman")
  } else {
    showPodmanSettingsDialog.value = !showPodmanSettingsDialog.value
  }
}

const onReinstallDocker = () => {
  if (dockerBtn.value === t('asslocal.panel')) {
    window.wslTerminal.execSWSL([
      ['-d', "DockerDesk", '--user', "root", '-e', "env DEBIAN_FRONTEND=noninteractive apt-get remove docker"],
    ]).then((result) => {
      if (result.success) {
        dockerBtn.value = t('asslocal.install')
        dockerInfo.value = t('asslocal.notInstalled')
        isReinstallDocker.value = true

        notify.value({
          type: 'positive',
          group: false,
          spinner: false,
          message: `${t('assistant.uninstallSuccess')}`,
          timeout: 10000
        })
      } else {
        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: `${t('assistant.uninstallFail')}: ${result.error}`,
          timeout: 10000
        })
      }

      onInstallDocker()
    })

    notify.value = $q.notify({
      type: 'info',
      group: false,
      timeout: 0,
      spinner: true,
      position: 'bottom-right',
      message: t('assistant.uninstalling'),
    })
  } else {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('asslocal.notInstalled')}`
    })
  }

  isDockerBtn.value = true
}

const onRestartDocker = () => {
  if (dockerBtn.value === t('asslocal.panel')) {
    window.wslTerminal.execSWSL([
      ['-d', "DockerDesk", '--user', "root", '-e', "systemctl restart docker"],
    ]).then((result) => {
      if (result) {
        notify.value({
          type: 'positive',
          group: false,
          spinner: false,
          message: `${t('assistant.restartSuccess')}`,
          timeout: 10000
        })
      } else {
        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: `${t('assistant.restartFail')}: ${result.error}`,
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
      message: t('assistant.restarting'),
    })
  } else {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('asslocal.notInstalled')}`
    })
  }
}

const onReinstallPodman = () => {
  if (podmanBtn.value === t('asslocal.panel')) {
    window.wslTerminal.execSWSL([
      ['-d', "DockerDesk", '--user', "root", '-e', "env DEBIAN_FRONTEND=noninteractive apt-get remove podman"],
    ]).then((result) => {
      podmanBtn.value = t('asslocal.install')
      podmanInfo.value = t('asslocal.notInstalled')
      isReinstallPodman.value = true

      if (result) {
        notify.value({
          type: 'positive',
          group: false,
          spinner: false,
          message: `${t('assistant.uninstallSuccess')}`,
          timeout: 10000
        })
      } else {
        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: `${t('assistant.uninstallFail')}: ${result.error}`,
          timeout: 10000
        })
      }

      onInstallDocker()
    })

    notify.value = $q.notify({
      type: 'info',
      group: false,
      timeout: 0,
      spinner: true,
      position: 'bottom-right',
      message: t('assistant.uninstalling'),
    })
  } else {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('asslocal.notInstalled')}`
    })
  }

  isPodmanBtn.value = true
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

const getOSInfo = () => {
  window.client.getOSUtilization().then(({cpuUsage, memoryUsage}) => {
    // console.log("getOSUtilization")
    cpuValue.value = parseInt(cpuUsage)
    memoryValue.value = parseInt(memoryUsage * 100)
  })
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
        dockerInfo.value = `docker: ${versionNumber}`
        dockerBtn.value = t('asslocal.panel')
        isReinstallDocker.value = false
        isRestartDocker.value = false
      } else {
        console.log("未找到Docker版本号。")
      }
    } else {
      dockerBtn.value = t('asslocal.install')
      dockerInfo.value = t('asslocal.notInstalled')
      isReinstallDocker.value = true
      isRestartDocker.value = true
    }

    isDockerBtn.value = false
  })
}

const checkPodmanInstall = () => {
  window.wslTerminal.execWSL([
    '-d', "DockerDesk", '--user', "root", '-e', "podman -v"
  ]).then((result) => {
    if (result.success && result.data.includes("podman version ")) {
      const versionRegex = /\d+\.\d+\.\d+/
      const match = result.data.match(versionRegex)

      if (match) {
        const versionNumber = match[0]
        podmanInfo.value = `podman: ${versionNumber}`
        podmanBtn.value = t('asslocal.panel')
        isReinstallPodman.value = false
        isRestartPodman.value = false
      } else {
        console.log("未找到Podman版本号。")
      }
    } else {
      podmanBtn.value = t('asslocal.install')
      podmanInfo.value = t('asslocal.notInstalled')
      isReinstallPodman.value = true
      isRestartPodman.value = true
    }

    isPodmanBtn.value = false
  })
}


const init = () => {
  showLoading ()

  if (deviceInfo.value.platform === "win32") {

    // checkDockerInstall()
    //
    // checkPodmanInstall()

    getOSInfoInterval = setInterval(() => {
      getOSInfo()
    }, 10000)
  }
}

onMounted(() => {
  init()
})

onActivated(() => {
  if (getOSInfoInterval === null) {
    getOSInfoInterval = setInterval(() => {
      getOSInfo()
    }, 10000)
  }

  if (deviceInfo.value.platform === "win32") {

    checkDockerInstall()

    setTimeout(() => {
      checkPodmanInstall()
    }, 2000)

  }
})

onDeactivated(() => {
  if (getOSInfoInterval !== null) {
    clearInterval(getOSInfoInterval)
    getOSInfoInterval = null
  }
})

onUnmounted(() => {
  if (getOSInfoInterval !== null) {
    clearInterval(getOSInfoInterval)
    getOSInfoInterval = null
  }
})


</script>

<style scoped>

</style>
