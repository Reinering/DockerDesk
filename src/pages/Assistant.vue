<template>
  <q-page q-pa-md padding>
    <div class="text-h4 q-mb-md">引导</div>

    <div class="q-pa-md row q-gutter-md justify-evenly">
      <q-card class="bg-blue-grey-6" style="width: 40%; height: 250px">
        <q-card-section align="center">
          <div class="text-h5">{{t('assistant.local')}} Docker/Podman</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none">
          <!--          添加本地-->
        </q-card-section>

        <q-card-section />

        <q-card-section />

        <q-card-actions class="q-mt-none" align="center">
          <q-btn color="primary" size="lg" icon="settings" @click="gotoAssLocal" :disable="isAssLocalBtn"/>
        </q-card-actions>
      </q-card>

      <q-card class="bg-blue-grey-6" style="width: 40%; height: 250px">
        <q-card-section align="center">
          <div class="text-h5">{{t('assistant.remote')}} Docker/Podman</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none" />
        <q-card-section />
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
          <q-chip shaquare color="orange" text-color="white" icon="star">
            建议: WSL2
          </q-chip>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md row justify-between">
            <div class="col"><q-badge :color="wslStatusColor" rounded class="q-mr-sm" />{{wslStatus}}</div>
            <q-space />

            <q-btn
              :disable="disabledWslStatusBtn"
              color="accent"
              icon="flight_takeoff"
              style="width: 150px"
              @click="onWslStatusBtn"
            >
              {{wslStatusBtn}}
              <template v-slot:loading>
                <q-spinner-gears class="on-left" />
                Computing...
              </template>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
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
const isAssRemoteBtn = ref(true)

const wslStatusBtn = ref(t('assistant.notInstalled'))
const disabledWslStatusBtn = ref(false)
const wslStatus = ref('Stopped')
const wslStatusColor = ref('red')

const installWSLPackage = () => {
  window.wslTerminal.execSWSL([
    ['-d', "DockerDesk", '--user', "root", '-e', "apt-get update"],
    ['-d', "DockerDesk", '--user', "root", '-e', "env DEBIAN_FRONTEND=noninteractive apt-get install -y apt-transport-https ca-certificates"],
    ['-d', "DockerDesk", '--user', "root", '-e', "mv /etc/apt/sources.list /etc/apt/sources.list.bak"],
    ['-d', "DockerDesk", '--user', "root", '-e', 'bash', '-c', `"printf '${printfContent}' > /etc/apt/sources.list"`],
    ['-d', "DockerDesk", '--user', "root", '-e', "apt-get update"],
    ['-d', "DockerDesk", '--user', "root", '-e', "env DEBIAN_FRONTEND=noninteractive apt-get install -y curl"]
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
      isAssRemoteBtn.value = false
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
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('assistant.upgradeSuccess')
        })

        wslStatusBtn.value = t('assistant.installed')
      } else {
        return $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('assistant.upgradeFail')}: ${result.error}`
        })
      }
    })
  }  else if (wslStatusBtn.value === t('assistant.addSubSystem')) {
    window.wslTerminal.installSubSystem().then((result) => {
      if (result.success) {
        wslStatusBtn.value === t('assistant.addPackage')
        wslStatusColor.value = "red"
        notify.value({
          type: 'info',
          group: false,
          spinner: true,
          message: `${t('assistant.installMessage')}`,
          timeout: 0
        })

        installWSLPackage()
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
        if (! result.success && isCall) {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('assistant.startFail')}: ${result.error}`
          })
        }
      })

    setTimeout(() => {
      isCall = false
    }, 5000)

    wslStatusBtn.value = t('assistant.stop')
    wslStatus.value = "Running"
    wslStatusColor.value = "green"
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

const init = () => {
  if (process.env.MODE === 'electron' && deviceInfo.value.platform === "win32") {
    window.wslTerminal.checkWSLInfo().then((result) => {
      if (result.success) {
        const line = result.data.split('\r\n')[0]

        if (line.indexOf('WSL') !== -1) {
          wslStatusBtn.value = t('assistant.installed')

          window.wslTerminal.getWSLList().then((result) => {
            if (result.success) {
              const data = parseWSLListVersion(result.data)

              for (let index in data) {
                if (data[index].name === "DockerDesk") {
                  if (data[index].state === "Stopped") {
                    wslStatusBtn.value = t('assistant.start')
                    wslStatusColor.value = "red"
                  } else if (data[index].state === "Running") {
                    wslStatusBtn.value = t('assistant.stop')
                    wslStatusColor.value = "green"
                  }

                  isAssLocalBtn.value = false
                  isAssRemoteBtn.value = false
                  return
                }
              }
              wslStatusBtn.value = t('assistant.addSubSystem')
            }
          })
        } else {
          wslStatusBtn.value = t('assistant.needUpgrade')
        }
      } else {
        wslStatusBtn.value = t('assistant.notInstalled')
      }
    })

  }
}

onMounted(() => {
  init()
})
</script>

<style scoped></style>
