<!--
notify ('positive', 'negative', 'warning', 'info', 'ongoing')
-->
<template>
  <router-view />
</template>

<script setup>
//

import { ref, provide, onBeforeMount, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from 'stores/config.js'
import { usePreCmdsStore } from 'stores/precmds.js'
import { isEmptyStr } from 'src/utils/common.js'


const $q = useQuasar()
provide("$q", $q)

const router = useRouter()
provide("router", router)
const route = useRoute()
provide("route", route)

const { t } = useI18n()
provide("t", t)

$q.loadingBar.setDefaults({
  color: 'teal',
  size: '3px',
  position: 'bottom'
})

const deviceInfo = ref(null)
provide("deviceInfo", deviceInfo)

const configStore = useConfigStore()
const preCmdsStore = usePreCmdsStore()

const init = () => {
  // 这里可以做一些初始化的操作，比如获取用户信息等
  console.log("init", navigator.language)
  if (isEmptyStr(configStore.lang)) {
    // configStore.setLang("zh-CN")
    configStore.lang = navigator.language
  }

  if (process.env.MODE === 'electron') {

  }

  // theme
  if (configStore.theme === 'dark') {
    $q.dark.set(true)
  }

  preCmdsStore.isSync = "0"

  window.client.getOSInfo().then((result) => {
    deviceInfo.value = result
  })
}

onBeforeMount(() => {
  init()
  window.addEventListener('orientationchange', () => {
    console.log("orientationchange")
    location.reload()
  })
})

onUnmounted(() => {
  // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
})

</script>

<style>
html, body {
  height: 100%;
}

body {
  background-color:	#EAECEE;
  margin: 0;
  font-family: Helvetica, sans-serif;
  overflow: hidden;
}

</style>
