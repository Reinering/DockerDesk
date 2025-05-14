<template>
  <q-layout view="hHh lpR lFf" :layout="layout">

    <q-header elevated class="bg-primary text-white" height-hint="98" >
      <ToolBar />

      <q-toolbar style="height: 70px;">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-avatar>
          <img src="public/icons/favicon-128x128.png" />
        </q-avatar>

        <q-toolbar-title>
          Docker Management
        </q-toolbar-title>

        <q-space />
        <q-item-label>关于</q-item-label>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :behavior="behavior"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      :width="210"
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
import { reactive, inject, toRefs } from 'vue'
import Navigator from 'components/Navigator.vue'
import ToolBar from 'components/ToolBar.vue'
import { useNavigatorStore } from 'stores/navigator.js'
import { isEmptyStr, isEmptyProxy } from 'src/utils/common.js'

const navigatorStore = useNavigatorStore()

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

if (process.env.MODE === 'electron') {
  pageState.isBarHide = true
} else {
  pageState.isBarHide = false
}

const naviDatas = reactive([
  {
    name: 'Home',
    label: t('navigator.home'),
    icon: "home",
    route: '',
    state: true,
    children: []
  },

  {
    name: 'nodes',
    label: t('navigator.nodes'),
    icon: "hub",
    route: 'nodes',
    state: false,
    children: []
  },

  {
    name: 'nodesMg',
    label: t('navigator.nodesMg'),
    icon: "dialpad",
    route: 'nodesMg',
    state: false,
    children: [
      {
        name: 'Docker',
        label:  t('navigator.dockerNode'),
        icon: "grain",
        route: 'dockerNode',
        state: false,
        children: []
      },
      {
        name: "Terminal",
        label: t('navigator.terminal'),
        icon: "terminal",
        route: 'terminal',
        state: false,
        children: []
      },
      {
        name: 'Edge',
        label: "边缘节点列表",
        icon: "commit",
        route: 'edge_nodes',
        state: false,
        children: []
      },
    ]
  },

  {
    name: "Settings",
    label: t('navigator.settings'),
    icon: "settings",
    route: 'settings',
    state: false,
    children: []
  }
])

if (isEmptyStr(navigatorStore.mainUri)) {
  navigatorStore.mainUri = router.currentRoute.value.path
}
if (isEmptyProxy(navigatorStore.naviItems)) {
  navigatorStore.naviItems = naviDatas
}
// const naviGoto = (func) => {
//   func()
// }


// 导航栏是否禁用
const disableNavi = reactive({
  disabled: null, // 是否禁用导航栏 null/true
  clickabled: true // 是否禁用导航栏的点击事件
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}



</script>
