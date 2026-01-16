<template>
  <q-page q-pa-md padding>
    <div class="text-h4 q-mb-md">引导</div>

    <div class="q-pa-md row q-gutter-md justify-evenly">
      <q-card class="bg-blue-grey-6" style="width: 40%; height: 250px">
        <q-card-section align="center">
          <div class="text-h5">{{t('assistant.local')}}</div>
          <div class="text-h5 text-brown-8">Docker/Podman</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none">
          <!--          添加本地-->
        </q-card-section>

        <q-card-section />

        <q-card-actions class="q-mt-none" align="center">
          <q-btn color="primary" size="lg" icon="settings" @click="gotoAssLocal" :disable="isAssLocalBtn"/>
        </q-card-actions>
      </q-card>

      <q-card class="bg-blue-grey-6" style="width: 40%; height: 250px">
        <q-card-section align="center">
          <div class="text-h5">{{t('assistant.remote')}}</div>
          <div class="text-h5 text-brown-8">Docker/Podman</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none" />
        <q-card-section />

        <q-card-actions class="q-mt-none" align="center">
          <q-btn color="primary" icon="settings" size="lg" @click="gotoAssRemote" :disable="isAssRemoteBtn"/>
        </q-card-actions>
      </q-card>
    </div>

    <div class="q-pa-md row q-gutter-md justify-center">
      <q-card class="bg-primary" style="width: 80%; height: 250px">
        <div class="text-h5 q-pa-md text-secondary">
          Windows Subsystem for Linux（WSL）
          <q-btn
            href="https://learn.microsoft.com/zh-cn/windows/wsl"
            :label="t('wsl.officialTutorial')"
            target="_blank"
            outline
            color="purple"
          />
        </div>

        <q-separator />

        <q-card-section>
          <div class="row items-center justify-between">
            <div class="col">
              <q-chip shaquare color="orange" text-color="white" icon="star">
                {{wslVersionHint}}
              </q-chip>
            </div>

            <q-space />

            <q-btn
              flat
              icon="settings"
              color="secondary"
              @click="onWSLSettings"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('assistant.wslSettings')}}
              </q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md row items-center justify-between">
            <div class="col"><q-badge :color="wslStatusColor" rounded class="q-mr-sm" />{{wslStatus}}</div>
            <q-space />

            <q-btn-dropdown
              split
              :disable="disabledWslStatusBtn"
              color="accent"
              icon="flight_takeoff"
              :label="wslStatusBtn"
              style="width: 150px"
              @click="onWslStatusBtn"
            >
              <q-list >
                <q-item :disable="isBgStart" class="bg-amber-14" clickable v-close-popup @click="onBackgroundStart">
                  <q-item-section avatar>
                    <q-icon name="play_arrow" color="white" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-white" >{{t('assistant.bgStart')}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog
      v-if="showWSLSettingsDialog"
      v-model="showWSLSettingsDialog"
    >
      <q-card style="min-width: 80%" class="q-pa-md">
        <q-card-section>
          <div class="text-h6">{{t('assistant.wslSettings')}}</div>
        </q-card-section>

        <div class="q-gutter-sm">
          <q-expansion-item
            expand-separator
            flat bordered
            :label="t('assistant.basicSettings')"
            header-class="text-grey-6"
            style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; font-size: 16px; "
          >
            <div class="q-pa-md q-gutter-sm">
              <q-item class="bg-grey-4">
                <q-item-section>
                  <q-item-label>{{t('assistant.defaultInstallDir')}}</q-item-label>
                  <q-item-label caption>{{wslDefaultDir}}</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-btn dense round flat color="white" text-color="primary" icon="edit" size="md" @click="onWSLDirEdit" >
                    <q-tooltip class="bg-amber text-black shadow-4">
                      {{t('wsl.edit')}}
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>

            </div>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            flat bordered
            :label="t('assistant.startupBehavior')"
            header-class="text-grey-6"
            style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; font-size: 16px; "
          >
            <div class="q-pa-md q-gutter-sm">
              <q-item class="bg-grey-4">
                <q-item-section>
                  <q-item-label caption>Start With App</q-item-label>
                  <q-item-label >{{t('assistant.startWithApp')}}</q-item-label>
                </q-item-section>
                <q-item-section top side>
                  <q-toggle
                    v-model="settingsDatas.startWithApp"
                    color="green"
                    @update:model-value="onStartWithApp"
                  />
                </q-item-section>
              </q-item>

              <q-item class="bg-grey-4">
                <q-item-section>
                  <q-item-label caption>Stop With App</q-item-label>
                  <q-item-label >{{t('assistant.stopWithApp')}}</q-item-label>
                </q-item-section>
                <q-item-section top side>
                  <q-toggle
                    v-model="settingsDatas.stopWithApp"
                    color="green"
                    @update:model-value="onStopWithApp"
                  />
                </q-item-section>
              </q-item>
            </div>
          </q-expansion-item>
        </div>

        <q-card-actions align="right">
          <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="showWSLSettingsDialog = false" />
          <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="showWSLSettingsDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, inject, onMounted, reactive, onUnmounted } from 'vue'
import { clientConfig } from 'src/common/config.js'
import { parseWSLListVersion } from 'src/utils/wsl.js'
import { isEmptyObj } from 'src/utils/common.js'

const $q = inject('$q')
const router = inject('router')
const route = inject('route')
const t = inject('t')
const deviceInfo = inject('deviceInfo')

const gotoAssLocal = () => {
  router.push('/assistant/asslocal')
}

const gotoAssRemote = () => {

}

let notify = ref(null)

const debianSourcesLines = [
  'deb https://mirrors.aliyun.com/debian/ bookworm main non-free non-free-firmware contrib',
  'deb-src https://mirrors.aliyun.com/debian/ bookworm main non-free non-free-firmware contrib',
  'deb https://mirrors.aliyun.com/debian-security/ bookworm-security main',
  'deb-src https://mirrors.aliyun.com/debian-security/ bookworm-security main',
  'deb https://mirrors.aliyun.com/debian/ bookworm-updates main non-free non-free-firmware contrib',
  'deb-src https://mirrors.aliyun.com/debian/ bookworm-updates main non-free non-free-firmware contrib',
  'deb https://mirrors.aliyun.com/debian/ bookworm-backports main non-free non-free-firmware contrib',
  'deb-src https://mirrors.aliyun.com/debian/ bookworm-backports main non-free non-free-firmware contrib'
]

const printfContent = debianSourcesLines.join('\\n') + '\\n'

const isAssLocalBtn = ref(true)
const isAssRemoteBtn = ref(false)

const wslVersionHint = ref('')
const wslStatusBtn = ref(t('assistant.notInstalled'))
const disabledWslStatusBtn = ref(false)
const isBgStart = ref(true)
const wslStatus = ref('Stopped')
const wslStatusColor = ref('orange')
const showWslStatusBtn = ref(true)

const showWSLSettingsDialog = ref(false)
const settingsDatas = reactive({
  startWithApp: false,
  stopWithApp: false
})

const wslDefaultDir = ref('')

const installWSLPackage = () => {
  window.wslTerminal.execSWSL([
    ['-d', "DockerDesk", '--user', "root", '-e', "apt-get update"],
    ['-d', "DockerDesk", '--user', "root", '-e', "env DEBIAN_FRONTEND=noninteractive apt-get install -y apt-transport-https ca-certificates"],
    ['-d', "DockerDesk", '--user', "root", '-e', "mv /etc/apt/sources.list /etc/apt/sources.list.bak"],
    ['-d', "DockerDesk", '--user', "root", '-e', 'bash', '-c', `"printf '${printfContent}' > /etc/apt/sources.list"`],
    ['-d', "DockerDesk", '--user', "root", '-e', "apt-get update"],
    ['-d', "DockerDesk", '--user', "root", '-e', "env DEBIAN_FRONTEND=noninteractive apt-get install -y curl dbus dbus-x11 git "]
  ]).then((result) => {
    console.log(result)
    if (result.success) {
      notify.value({
        type: 'positive',
        group: false,
        spinner: false,
        message: `${t('assistant.installSuccess')}`,
        timeout: 10000
      })

      isAssLocalBtn.value = false
      wslStatusBtn.value = t('assistant.start')
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

  if (isEmptyObj(notify.value)) {
    notify.value = $q.notify({
      type: 'info',
      group: false,
      timeout: 0,
      spinner: true,
      position: 'bottom-right',
      message: t('assistant.installing'),
    })
  }
}

const onWslStatusBtn = () => {
  if (wslStatusBtn.value === t('assistant.notInstalled')) {

  } else if (wslStatusBtn.value === t('assistant.needUpgrade')) {
    window.wslTerminal.upgradeWSL().then((result) => {
      if (result.success) {
        notify.value({
          type: 'positive',
          icon: 'done',
          spinner: false,
          message: `${t('assistant.upgradeSuccess')}`,
          timeout: 10000
        })

        // wslStatusBtn.value = t('assistant.rebootSystem')
        // wslStatusBtn.value = true
        setTimeout(() => {
          init()
        }, 15000)
      } else {
        return notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: `${t('assistant.upgradeFail')}: ${result.error}`,
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
      message: t('assistant.updating'),
    })
  }  else if (wslStatusBtn.value === t('assistant.addSubSystem')) {
    window.wslTerminal.installSubSystem().then((result) => {
      if (result.success) {
        wslStatusBtn.value === t('assistant.addPackage')
        wslStatusColor.value = "red"
        wslStatus.value = 'Stopped'

        notify.value({
          type: 'info',
          group: false,
          spinner: true,
          message: `${t('assistant.installMessage')}`,
          timeout: 0
        })

        installWSLPackage()
        disabledWslStatusBtn.value = true
      }else if (wslStatusBtn.value === t('assistant.addPackage')) {
        installWSLPackage()
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
  } else if (wslStatusBtn.value === t('assistant.start')) {
      let isCall = true
      window.wslTerminal.startSubSystem().then((result) => {
        if (!result.success && isCall) {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('assistant.startFail')}: ${result.error}`
          })
        } else {
          isAssLocalBtn.value = false
          wslStatusBtn.value = t('assistant.stop')
          wslStatus.value = "Running"
          wslStatusColor.value = "green"
        }
      })

    setTimeout(() => {
      isCall = false
    }, 5000)


  } else if (wslStatusBtn.value === t('assistant.stop')) {
    window.wslTerminal.stopSubSystem().then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('assistant.stopSuccess')
        })

        wslStatusBtn.value = t('assistant.start')
        wslStatus.value = "Stopped"
        wslStatusColor.value = "red"
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('assistant.stopFail')}: ${result.error}`
        })
      }
    })
  }
}

const onBackgroundStart = () => {
  if (wslStatusBtn.value === t('assistant.start')) {
    let isCall = true
    window.wslTerminal.startBGSubSystem().then((result) => {
      console.log("result", result)
      if (! result.success && isCall) {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('assistant.startFail')}: ${result.error}`
        })
      } else {
        isAssLocalBtn.value = false

        wslStatusBtn.value = t('assistant.stop')
        wslStatus.value = "Running"
        wslStatusColor.value = "green"
      }
    })

    setTimeout(() => {
      isCall = false
    }, 5000)
  }
}

const onWSLSettings = () => {
  window.wslTerminal.getWSLLaunch("DockerDesk").then((result) => {
    if (result.success) {
      if (Object.prototype.hasOwnProperty.call(result.data, "startWithApp")) {
        settingsDatas.startWithApp = result.data.startWithApp
      }

      if (Object.prototype.hasOwnProperty.call(result.data, "stopWithApp")) {
        settingsDatas.stopWithApp = result.data.stopWithApp
      }
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('assistant.getSettingError')}: ${result.error}`
      })
    }
  })

  showWSLSettingsDialog.value = true
}

const onStartWithApp = () => {
  window.wslTerminal.setWSLLaunch(JSON.stringify({
      wslName: "DockerDesk",
      startWithApp: settingsDatas.startWithApp
    })
  ).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('assistant.setSuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('assistant.setFail')}`
      })
    }
  })
}

const onStopWithApp = () => {
  window.wslTerminal.setWSLLaunch(JSON.stringify({
      wslName: "DockerDesk",
      stopWithApp: settingsDatas.stopWithApp
    })
  ).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('assistant.setSuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('assistant.setFail')}`
      })
    }
  })
}

const onWSLDirEdit = () => {
  window.myWindowAPI.selectFolders().then((result) => {
    if (result) {
      wslDefaultDir.value = result[0]
    } else {
      wslDefaultDir.value = ''
    }

    window.wslTerminal.setWSLSettings(JSON.stringify({
      key: "defaultInstallDir",
      value: wslDefaultDir.value
    })).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('assistant.setSuccess')
        })
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('assistant.setFail')}: ${result.error}`
        })
      }
    })
  })
}

const checkSubSystem = async () => {
  window.wslTerminal.checkSubSystem().then((result) => {
    console.log(result)
  })
}

const init = () => {
  if (process.env.MODE === 'electron' && deviceInfo.value.platform === "win32") {
    window.wslTerminal.checkWSLInfo().then((result) => {
      if (result.success) {
        const line = result.data.split('\r\n')[0]

        if (line.indexOf('WSL') !== -1) {
          wslVersionHint.value = t('assistant.wslVersionHint1')
          wslStatusBtn.value = t('assistant.installed')

          window.wslTerminal.getWSLList().then((result) => {
            if (result.success) {
              const data = parseWSLListVersion(result.data)

              for (let index in data) {
                if (data[index].name === "DockerDesk") {
                  if (data[index].state === "Stopped") {
                    wslStatusBtn.value = t('assistant.start')
                    wslStatusColor.value = "red"
                    wslStatus.value = "Stopped"
                    isAssLocalBtn.value = true
                  } else if (data[index].state === "Running") {
                    wslStatusBtn.value = t('assistant.stop')
                    wslStatusColor.value = "green"
                    wslStatus.value = "Running"
                    isAssLocalBtn.value = false
                  }

                  isBgStart.value = false
                  showWslStatusBtn.value = false
                  checkSubSystem()
                  return
                }
              }
              wslStatusBtn.value = t('assistant.addSubSystem')
            } else {
              wslStatusBtn.value = t('assistant.addSubSystem')
            }
          })
        } else {
          wslStatusBtn.value = t('assistant.needUpgrade')
          wslVersionHint.value = t('assistant.wslVersionHint')
        }
      } else {
        window.wslTerminal.checkWSLInfo('utf8').then((result) => {
          if (!result.success && result.error.indexOf("Command failed: wsl -v") !== -1) {
            wslStatusBtn.value = t('assistant.needUpgrade')
            wslVersionHint.value = t('assistant.wslVersionHint')
          } else {
            wslStatusBtn.value = t('assistant.notInstalled')
          }
        })
      }
    })

    window.wslTerminal.getWSLSettings("defaultInstallDir").then((result) => {
      if (result.success) {
        wslDefaultDir.value = result.data
      }
    })
  }
}

onMounted(() => {
  init()
})

onUnmounted(() => {

})

</script>

<style scoped></style>
