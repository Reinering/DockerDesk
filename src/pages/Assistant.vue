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
          <q-btn :label="t('assistant.addService')" color="primary" size="lg" @click="gotoAss2" />
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
          <q-btn :label="t('assistant.addService')" color="primary" size="lg" @click="gotoAss2" />
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


const $q = inject('$q')
const router = inject('router')
const route = inject('route')
const t = inject('t')
const deviceInfo = inject('deviceInfo')

const gotoAss2 = () => {
  router.push('/assistant/asslocal')
}

const wslStatusBtn = ref(t('assistant.notInstalled'))
const disabledWslStatusBtn = ref(false)
const wslStatus = ref('Stopped')
const wslStatusColor = ref('red')

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
          message: `${t('assistant.upgradeError')}: ${result.error}`
        })
      }
    })
  }  else if (wslStatusBtn.value === t('assistant.addSubSystem')) {
    // window.wslTerminal.installSubSystem().then((result) => {
    //
    // })
  } else if (wslStatusBtn.value === t('assistant.start')) {
      let isCall = true
      window.wslTerminal.startSubSystem().then((result) => {
        if (! result.success && isCall) {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('assistant.startError')}: ${result.error}`
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
          message: `${t('assistant.stopError')}: ${result.error}`
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
                  } else if (data[index].state === "Running") {
                    wslStatusBtn.value = t('assistant.stop')
                  }
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
