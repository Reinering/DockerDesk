<template>
  <q-layout :layout="layout">

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
      <navigator :naviGoto="naviGoto" :disableNavi="disableNavi" :disabled=disableNavi.disabled />
    </q-drawer>

    <q-page-container>
      <router-view />
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

const naviDatas = [
  {
    label: t('navigator.home'),
    icon: "home",
    route: '',
    state: true,
    click: null,
    children: []
  },
  {
    label: "Docker节点",
    icon: "dialpad",
    route: 'dockerNodes',
    state: false,
    click: null,
    children: []
  },
  {
    label: "节点管理",
    icon: "dialpad",
    router: '',
    state: false,
    click: null,
    children: [
      {
        label: "节点列表",
        icon: "grain",
        route: 'nodes',
        state: false,
        click: null,
        children: []
      },
      {
        label: "边缘节点列表",
        icon: "commit",
        route: 'edge_nodes',
        state: false,
        click: null,
        children: []
      },
      {
        label: "用户节点列表",
        icon: "spa",
        route: 'leafs',
        state: false,
        click: null,
        children: []
      },
      {
        label: "节点拓扑",
        icon: "hub",
        route: 'topology',
        state: false,
        click: null,
        children: []
      }
    ]
  },
  {
    label: "用户管理",
    icon: "manage_accounts",
    route: '',
    state: false,
    click: null,
    children: [
      {
        label: "用户账户",
        icon: "settings",
        route: 'users',
        state: false,
        click: null,
        children: []
      },
      {
        label: "用户权限",
        icon: "app_registration",
        route: 'cainvite',
        state: false,
        click: null,
        children: []
      }
    ]
  },
  {
    label: "帮助",
    icon: "help",
    route: '',
    state: false,
    click: null,
    children: [
      {
        label: "联系我们",
        icon: "call",
        route: '',
        state: false,
        click: null,
        children: []
      },
      {
        label: "报告问题",
        icon: "report_problem",
        route: '',
        state: false,
        click: null,
        children: []
      },
      {
        label: "常见问题",
        icon: "settings",
        route: '',
        state: false,
        click: null,
        children: []
      }
    ]
  },
  {
    label: t('navigator.settings'),
    icon: "settings",
    route: 'settings',
    state: false,
    click: null,
    children: []
  }
]

if (isEmptyStr(navigatorStore.mainUri)) {
  navigatorStore.mainUri = router.currentRoute.value.path
}
if (isEmptyProxy(navigatorStore.naviItems)) {
  navigatorStore.naviItems = naviDatas
}
const naviGoto = (func) => {
  func()
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
