<template>
  <q-page>
    <q-tabs
      no-caps
      inline-label
      v-model="tab"
      active-color="purple"
      class="text-teal shadow-2"
    >
      <q-route-tab
        v-if="isShowCreate"
        name="create"
        icon="create"
        :label="t('panel.tabs.create')"
        :to="{ path: '/nodesMg/panel/create', query: { tab: 'create' } }"
      />
      <q-route-tab
        name="containers"
        icon="border_all"
        :label="t('panel.tabs.containers')"
        :to="{ path: '/nodesMg/panel/containers', query: { tab: 'containers' } }"
        exact
      />
      <q-route-tab
        name="images"
        icon="crop_square"
        :label="t('panel.tabs.images')"
        :to="{ path: '/nodesMg/panel/images', query: { tab: 'images' } }"
        exact
      />
      <q-route-tab
        name="volumes"
        icon="noise_aware"
        :label="t('panel.tabs.volumes')"
        :to="{ path: '/nodesMg/panel/volumes', query: { tab: 'volumes' } }"
        exact
      />
      <q-route-tab
        name="networks"
        icon="router"
        :label="t('panel.tabs.networks')"
        :to="{ path: '/nodesMg/panel/networks', query: { tab: 'networks' } }"
        exact
      />
      <q-route-tab
        name="logs"
        icon="output"
        :label="t('panel.tabs.logs')"
        :to="{ path: '/nodesMg/panel/logs', query: { tab: 'logs' } }"
      />
      <q-route-tab
        name="settings"
        icon="settings"
        :label="t('panel.tabs.settings')"
        :to="{ path: toSettings, query: { tab: 'settings' } }"
      />
    </q-tabs>

    <router-view v-slot="{ Component }">
      <keep-alive >
        <component :is="Component" />
      </keep-alive>
    </router-view>

  </q-page>
</template>

<script setup>
import { ref, provide, inject, onMounted, onActivated, onDeactivated, onUnmounted, reactive } from 'vue'
import { usePodmanStore } from 'src/stores/podman.js'
import { firstUpper, firstLower, isEmptyObj, isEmptyStr } from 'src/utils/common.js'
import { QSpinnerGears } from 'quasar'
import { parseWSLListVersion } from 'src/utils/wsl.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")
const deviceInfo = inject('deviceInfo')

const podmanStore = usePodmanStore()

const tab = ref('containers')

const wslInfo = reactive({
  enable: false,
})
provide("wslInfo", wslInfo)

const connectState = ref(false)
provide("connectState", connectState)

const dockerInfo = reactive({
  enable: false,
  version: ''
})
provide("dockerInfo", dockerInfo)
const podmanInfo = reactive({
  enable: false,
  version: ''
})
provide("podmanInfo", podmanInfo)

const service = reactive({})
provide("service", service)

const toSettings = ref("dockerSettings")

const isShowCreate = ref(false)

const changeSettingRouter = () => {
  if (!isEmptyObj(service)) {
    if (firstLower(service.serviceType) === "docker") {
      toSettings.value = "/nodesMg/panel/dockerSettings"
    } else if (firstLower(service.serviceType) === "podman") {
      toSettings.value = "/nodesMg/panel/podmanSettings"
    }
  }
}

const showCreatePage = () => {
  isShowCreate.value = true
}
provide("showCreatePage", showCreatePage)


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

const initDocker = () => {
  console.log("initDocker")
  if (service.connectionType === t('node.remoteNode')) {
    if (!connectState.value) {
      return
    }

    window.containerTerminal.exec({
      connID: service.id,
      command: `docker -v`
    }).then((result) => {
      if (result.success) {
        const versionRegex = /(\d+\.\d+\.\d+)/
        const match = result.data.match(versionRegex)

        if (match) {
          dockerInfo.enable = true
          dockerInfo.version = match[1]
        } else {
          dockerInfo.enable = false

          $q.dialog({
            title: 'Alert',
            message: `${t('nodePanel.dockerNotInstall')}`,
            ok: {
              push: true,
              color: 'negative'
            },
            position: 'bottom'
          })
        }
      } else {
        dockerInfo.enable = false

        $q.dialog({
          title: 'Alert',
          message: `${t('nodePanel.dockerNotInstall')}`,
          ok: {
            push: true,
            color: 'negative'
          },
          position: 'bottom'
        })
      }
    })
  } else {
    window.wslTerminal.execWSL([
      '-d', service.address, '--user', "root", '-e', "docker -v"
    ]).then((result) => {
      if (result.success) {
        const versionRegex = /(\d+\.\d+\.\d+)/
        const match = result.data.match(versionRegex)

        if (match) {
          dockerInfo.enable = true
          dockerInfo.version = match[1]

        } else {
          dockerInfo.enable = false

          $q.dialog({
            title: 'Alert',
            message: `${t('nodePanel.dockerNotInstall')}`,
            ok: {
              push: true,
              color: 'negative'
            },
            position: 'bottom'
          })
        }
      } else {
        dockerInfo.enable = false

        $q.dialog({
          title: 'Alert',
          message: `${t('nodePanel.dockerNotInstall')}`,
          ok: {
            push: true,
            color: 'negative'
          },
          position: 'bottom'
        })
      }
    })
  }
}

const initPodman = () => {
  console.log("initPodman")
  if (service.connectionType === t('node.remoteNode')) {
    if (!connectState.value) {
      return
    }

    window.containerTerminal.exec({
      connID: service.id,
      command: `podman -v`
    }).then((result) => {
      if (result.success && result.data.includes("podman version ")) {
        const versionRegex = /\d+\.\d+\.\d+/
        const match = result.data.match(versionRegex)

        if (match) {
          podmanInfo.enable = true
          podmanInfo.version = match[0]
        } else {
          podmanInfo.enable = false

          $q.dialog({
            title: 'Alert',
            message: `${t('nodePanel.podmanNotInstall')}`,
            ok: {
              push: true,
              color: 'negative'
            },
            position: 'bottom'
          })
        }
      } else {
        podmanInfo.enable = false

        $q.dialog({
          title: 'Alert',
          message: `${t('nodePanel.podmanNotInstall')}`,
          ok: {
            push: true,
            color: 'negative'
          },
          position: 'bottom'
        })
      }
    })
  } else {
    window.wslTerminal.execWSL([
      '-d', service.address, '--user', "root", '-e', "podman -v"
    ]).then((result) => {
      if (result.success && result.data.includes("podman version ")) {
        const versionRegex = /\d+\.\d+\.\d+/
        const match = result.data.match(versionRegex)

        if (match) {
          podmanInfo.enable = true
          podmanInfo.version = match[0]
        } else {
          podmanInfo.enable = false

          $q.dialog({
            title: 'Alert',
            message: `${t('nodePanel.podmanNotInstall')}`,
            ok: {
              push: true,
              color: 'negative'
            },
            position: 'bottom'
          })
        }
      } else {
        podmanInfo.enable = false

        $q.dialog({
          title: 'Alert',
          message: `${t('nodePanel.podmanNotInstall')}`,
          ok: {
            push: true,
            color: 'negative'
          },
          position: 'bottom'
        })
      }
    })
  }

  // init env
  window.client.getSettings("podman_proxy_mode").then((result) => {
    if (result.success) {
      podmanStore.mode = firstUpper(result.data.value)

      if (result.data.value === "manual") {
        window.client.getSettings("web_proxy").then((result) => {
          if (result.success) {
            if (isEmptyStr(result.data.value)) {
              return
            }

            const data = JSON.parse(result.data.value)

            if (result.data.value) {
              podmanStore.proxies.httpProxy = data.http_proxy
              podmanStore.proxies.httpsProxy = data.https_proxy
              podmanStore.proxies.noProxy = data.no_proxy
            }
          }
        })
      } else if (result.data.value === "system") {
        window.myWindowAPI.getProxy().then((result) => {
          if (!isEmptyObj(result)) {
            podmanStore.proxies.httpProxy = result.http
            podmanStore.proxies.httpsProxy = result.https
            podmanStore.proxies.noProxy = result.byPass
          }
        })
      }
    }
  })
}

const initWSL = () => {
  if (process.env.MODE === 'electron' && deviceInfo.value.platform === "win32") {
    window.wslTerminal.checkWSLInfo().then((result) => {
      if (result.success) {
        const line = result.data.split('\r\n')[0]

        if (line.indexOf('WSL') === -1) {
          wslInfo.enable = false

          return $q.dialog({
            title: 'Alert',
            message: `${t('nodePanel.wslNotInstall')}`,
            ok: {
              push: true,
              color: 'negative'
            },
            position: 'bottom'
          })
        }

        window.wslTerminal.getWSLList().then((result) => {
          if (result.success) {
            const data = parseWSLListVersion(result.data)

            for (let index in data) {
              if (data[index].name === service.address) {
                if (data[index].state === "Stopped") {
                  wslInfo.enable = false

                  $q.dialog({
                    title: 'Alert',
                    message: `${t('nodePanel.wslSubNotStart')}`,
                    ok: {
                      push: true,
                      color: 'negative'
                    },
                    position: 'bottom'
                  })
                } else if (data[index].state === "Running") {
                  wslInfo.enable = true

                  if (firstLower(service.serviceType) === "docker") {
                    initDocker()
                  } else if (firstLower(service.serviceType) === "podman") {
                    initPodman()
                  }
                }
                return
              }
            }

            return $q.dialog({
              title: 'Alert',
              message: `${t('nodePanel.wslSubNotFound')}`,
              ok: {
                push: true,
                color: 'negative'
              },
              position: 'bottom'
            })
          }

          return $q.dialog({
            title: 'Alert',
            message: `${t('nodePanel.wslSubNotFound')}`,
            ok: {
              push: true,
              color: 'negative'
            },
            position: 'bottom'
          })
        })
      } else {
        wslInfo.enable = false
        window.wslTerminal.checkWSLInfo('utf8').then((result) => {
          if (!result.success && result.error.indexOf("Command failed: wsl -v") !== -1) {
            return $q.dialog({
              title: 'Alert',
              message: `${t('nodePanel.wslNeedUpgrade')}`,
              ok: {
                push: true,
                color: 'negative'
              },
              position: 'bottom'
            })
          } else {
            return $q.dialog({
              title: 'Alert',
              message: `${t('nodePanel.wslNotInstall')}`,
              ok: {
                push: true,
                color: 'negative'
              },
              position: 'bottom'
            })
          }
        })
      }
    })
  }
}

const init = async () => {
  if (!isEmptyObj(service)) {
    if (service.connectionType === t('node.remoteNode')) {
      window.containerTerminal.connect(service.id).then(async (result) => {
        if (result.success) {
          connectState.value = true

          console.log("service", service)
          await setTimeout(() => {
            if (firstLower(service.serviceType) === "docker") {
              initDocker()
            } else if (firstLower(service.serviceType) === "podman") {
              initPodman()
            }
          }, 2000)

        } else {
          connectState.value = false

          $q.dialog({
            title: 'Alert',
            message: `${t('nodePanel.connectError')}: ${result.error}`,
            ok: {
              push: true,
              color: 'negative'
            },
            position: 'bottom'
          })
        }
      })

      window.containerTerminal.receiveState((result) => {
        if (result.uuid !== service.id){
          return
        }

        connectState.value = false

        $q.dialog({
          title: 'Alert',
          message: `${t('nodePanel.connectClose')}`,
          ok: {
            push: true,
            color: 'negative'
          },
          position: 'bottom'
        }).onOk(() => {
          // console.log('OK')
        }).onCancel(() => {
          // console.log('Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      })
    } else {
      initWSL()
    }
  }
}

const addTab = () => {
  try {
    const data = JSON.parse(route.query.data).data
    if (data) {
      showLoading()
      for (const key of Object.keys(data)) {
        service[key] = data[key]
      }
    }
  } catch (e) {
    // console.error(e)
  }
}

onMounted(() => {

  addTab()

  changeSettingRouter()

  init()
})

// onActivated(() => {
//   addTab()
//
//   changeSettingRouter()
//
//   init()
// })

onDeactivated(() => {

})

onUnmounted(() => {

})

</script>

<style scoped>

</style>
