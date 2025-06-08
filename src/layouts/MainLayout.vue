<template>
  <q-layout view="hHh lpR lFf" :layout="layout">

    <q-header elevated class="bg-primary text-white" height-hint="98" >
      <ToolBar />

      <q-toolbar style="height: 70px;">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-avatar>
          <img
            alt="logo"
            :src="faviconPath"
          />
        </q-avatar>

        <q-toolbar-title>
          App for Docker
        </q-toolbar-title>

        <q-space />
        <q-item-label>关于</q-item-label>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      bordered
      v-model="leftDrawerOpen"
      side="left"
      :behavior="behavior"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      :width="260"
      content-class="bg-grey-3"
    >
      <!-- drawer content -->
      <navigator :disableNavi="disableNavi" :disabled=disableNavi.disabled />
    </q-drawer>

    <q-page-container>
<!--      缓存页面，结合route中meta.keepalive属性，判断是否缓存-->
      <router-view v-slot="{ Component, route }">
        <keep-alive v-if="route.meta.keepAlive">
          <component :is="Component" />
        </keep-alive>

        <component v-else :is="Component" />
      </router-view>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, reactive, inject, toRefs } from 'vue'
import Navigator from 'components/Navigator.vue'
import ToolBar from 'components/ToolBar.vue'
import { getResourcePath } from 'src/utils/common.js'


const $q = inject("$q")
const deviceInfo = $q.platform.is
const router = inject("router")
const t = inject("t")

const pageState = reactive({
  layout: 'hHh lpR fFf',
  behavior: 'default',
  leftDrawerOpen: false,
  // isBarHide: false,
  miniState: true
})

const { layout, behavior, leftDrawerOpen, miniState } = toRefs(pageState)

if (deviceInfo.platform === 'ios' || deviceInfo.platform === 'Andriod') {
  pageState.layout = 'lHh lpR fFf'
  pageState.behavior = "mobile"
} else {
  pageState.layout = 'hHh lpR fFf'
  pageState.behavior = 'default'
}

const faviconPath = getResourcePath("icons/favicon-128x128.png")

if (process.env.MODE === 'electron') {
  pageState.isBarHide = true
} else {
  pageState.isBarHide = false
}


// 导航栏是否禁用
const disableNavi = reactive({
  disabled: null, // 是否禁用导航栏 null/true
  clickabled: true // 是否禁用导航栏的点击事件
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}



</script>
