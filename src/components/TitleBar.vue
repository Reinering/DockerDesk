<template>
  <!-- 无边框状态时的标题栏，最小化按钮、最大化按钮、关闭按钮、 -->
  <!--    q-electron-drag / q-electron-drag--exception 拖拽双/击放大 的作用区域-->
  <q-bar class="q-electron-drag" v-if="isBarHide">
<!--    <q-icon name="laptop_chromebook" class="q-electron-drag--exception" />-->
    <q-icon :name="'img:'+props.logoSrc" class="q-electron-drag--exception" />
    <div>Docker Tools</div>

    <q-space />

    <q-btn dense flat icon="minimize" @click="minimize" />
    <q-btn dense flat icon="crop_square" @click="maximize" />
    <q-btn dense flat icon="close" @click="closeApp" />
  </q-bar>
</template>

<script setup>
const props = defineProps({
  logoSrc: {
    type: String,
    default: ''
  },

  toggle: {
    type: Function,
    default: () => {}
  }
})

import { ref } from "vue"

const isBarHide = ref(false)

if (process.env.MODE === 'electron') {
  isBarHide.value = true
} else {
  isBarHide.value = false
}

const minimize = () => {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.minimize()
  }
}

const maximize = () => {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.toggleMaximize()
  }
}

const closeApp = () => {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.close()
  }
}

</script>

<style scoped>

</style>
