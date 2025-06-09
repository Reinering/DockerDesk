<template>
  <q-card class="q-ma-md" :style="cardStyle">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="text-h6" v-if="service" >{{service.serviceType + t('panel.settings.settings')}}</div>
      </div>
    </q-card-section>

    <q-separator />

    <q-scroll-area :style="scrollStyle">
      <div class="q-pa-md">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
            <div class="col">
              <q-btn
                flat
                dense
                color="grey-6"
                style="background-color: #e9ecef; border-radius: 4px; font-size: 16px; padding: 4px 12px;"
              >
                基础用法
              </q-btn>
            </div>
            <div class="col-auto row items-center q-gutter-sm">
              <q-btn color="teal" label="save"/>
            </div>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">

          </div>

        </q-card>
      </div>

      <div class="q-pa-md">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
            <div class="col">
              <q-btn
                flat
                dense
                color="grey-6"
                style="background-color: #e9ecef; border-radius: 4px; font-size: 16px; padding: 4px 12px;"
              >
                注册
              </q-btn>
            </div>
            <div class="col-auto row items-center q-gutter-sm">
              <q-btn color="blue" label="save"/>
            </div>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">

          </div>

        </q-card>
      </div>

      <div class="q-pa-md">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
            <div class="col">
              <q-btn
                flat
                dense
                color="grey-6"
                style="background-color: #e9ecef; border-radius: 4px; font-size: 16px; padding: 4px 12px;"
              >
                代理设置
              </q-btn>
            </div>
            <div class="col-auto row items-center q-gutter-sm">
              <q-btn color="teal" label="save"/>
            </div>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">
            <q-input filled bottom-slots :disable="isDisableDaemon" v-model="dockerDaemon.path" label="daemon.json" >
              <template v-slot:append>
                <q-icon v-if="dockerDaemon.path !== ''" name="close" @click="dockerDaemon.path = ''" class="cursor-pointer" />
              </template>

              <template v-slot:after>
                <q-btn round dense flat icon="edit" @click="isDisableDaemon = false" />
              </template>
            </q-input>
          </div>

        </q-card>
      </div>

    </q-scroll-area>

  </q-card>

</template>

<script setup>

import { ref, inject, onMounted, onUnmounted, reactive } from 'vue'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

// const service = inject("service")
const service = {
  serviceType: "docker", connectionType: "本地节点"
}
console.log("service", service)

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 182 + "px" : window.innerHeight - 149 + "px",
})
const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 183 - 55 + "px" : window.innerHeight - 149 - 122 + "px",
})

const dockerDaemon = reactive({
  path: "/etc/docker/daemon.json"

})
const daemon = reactive({})

const isDisableDaemon = ref(true)


const checkScreenSize = () => {
  console.log('check screenSize', window.innerHeight)

  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 182 + "px"
    scrollStyle.height = window.innerHeight - 183 - 55 + "px"
  } else {
    cardStyle.height = window.innerHeight - 149 + "px"
    scrollStyle.height = window.innerHeight - 149 - 122 + "px"
  }
}

const init = async () => {
  window.wslTerminal.execWSL(
    ['-d', "DockerDesk", '--user', "root", '-e', `cat ${dockerDaemon.path}`]
  ).then((result) => {
    console.log(result)
    if (result.success) {

    } else {
      if (result.error.includes("daemon.json: No such file or directory")) {
        return $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.settings.fileNotExist')}: ${result.error}`
        })
      }
    }
  })
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
