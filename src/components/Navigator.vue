/*
* 导航栏或者菜单栏 初始化数据由上层组件初始化时传入store，此组件根据store数据进行渲染
* 导航栏或者菜单栏 运行时数据存入store中，在store中进行持久化，页面刷新时，导航栏可以根据持久化数据进行渲染
*
[
  {
    name: 'Home',
    label: ’home,
    icon: "home",
    route: '', // 相对路径
    state: false,
    // click: null,
    children: [
      {
        name: 'Home',
        label: ’home,
        icon: "home",
        route: '', // 相对路径
        state: false,
        children: []
      }
    ]
  },
]
*
* */

<template>
  <q-scroll-area class="fit">
    <NavigatorItem
      v-for="( item ) in naviItems"
      :key="item.id"
      :item="item"
      :disableNavi="props.disableNavi"
    />
  </q-scroll-area>
</template>

<script setup>

import { provide, inject, onMounted, reactive, computed, isProxy } from 'vue'
import NavigatorItem from "./NavigatorItem.vue"
import { useNavigatorStore } from 'stores/navigator.js'
import { isEmptyProxy, isEmptyStr, findItem, isEmptyObj } from '../utils/common.js'
// import { changeNavigatorGoto } from "../utils/router.js"

const props = defineProps({

  disableNavi: {
    type: Object,
    default: () => {}
  }
})

const router = inject("router")
const t = inject("t")  // i18

const navigatorStore = useNavigatorStore()

const naviItems = reactive([
  {
    name: 'Home',
    label: 'navigator.home',
    icon: "home",
    route: '',
    state: false,
    children: []
  },

  {
    name: 'nodes',
    label: 'navigator.nodes',
    icon: "hub",
    route: 'nodes',
    state: false,
    children: []
  },

  {
    name: 'nodesMg',
    label: 'navigator.nodesMg',
    icon: "dialpad",
    route: 'nodesMg',
    state: false,
    children: [
      {
        name: 'Docker',
        label:  'navigator.dockerNode',
        icon: "grain",
        route: 'dockerNode',
        state: false,
        children: []
      },
      {
        name: "Terminal",
        label: 'navigator.terminal',
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
    label: 'navigator.settings',
    icon: "settings",
    route: 'settings',
    state: false,
    children: []
  }
])


// export ../utils/router.js
const changeNavigatorGoto = (item, prefix='') => {
  if (!isEmptyProxy(navigatorStore.lastNaviItem)) {
    navigatorStore.setLastNaviItemState(false)
  }

  navigatorStore.setNaviItemState([item, true])
  navigatorStore.setLastNaviItem(item, prefix)

  if (navigatorStore.mainUri[navigatorStore.mainUri.length - 1] === '/') {
    if (isEmptyStr(prefix) || isEmptyObj(prefix)) {
      router.push(navigatorStore.mainUri + item.route)
    } else {
      router.push(navigatorStore.mainUri + prefix + '/' + item.route)
    }
  } else {
    if (isEmptyStr(prefix) || isEmptyObj(prefix)) {
      router.push(navigatorStore.mainUri + '/' + item.route)
    } else {
      router.push(navigatorStore.mainUri + '/' + prefix + '/' + item.route)
    }
  }
}

// const changeNavigatorGoto1 = (item, prefix='') => {
//   console.log("mark")
//   if (!isEmptyProxy(navigatorStore.lastNaviItem)) {
//     navigatorStore.setLastNaviItemState(false)
//   }
//   navigatorStore.setNaviItemState([item, true])
//   navigatorStore.setLastNaviItem(item, prefix)
//   if (isEmptyStr(item.route)) {
//
//     naviItems[0].state = true
//     navigatorStore.setLastNaviItem(navigatorStore.naviItems[0], '')
//     navigatorStore.setNaviItemState([navigatorStore.naviItems[0], true])
//     changeNavigatorGoto(navigatorStore.naviItems[0], navigatorStore.naviItems[0].route)
//   } else {
//     if (navigatorStore.mainUri[navigatorStore.mainUri.length - 1] === '/') {
//       if (isEmptyStr(prefix) || isEmptyObj(prefix)) {
//         router.push(navigatorStore.mainUri + item.route)
//       } else {
//         router.push(navigatorStore.mainUri + prefix + '/' + item.route)
//       }
//     } else {
//       if (isEmptyStr(prefix) || isEmptyObj(prefix)) {
//         router.push(navigatorStore.mainUri + '/' + item.route)
//       } else {
//         router.push(navigatorStore.mainUri + '/' + prefix + '/' + item.route)
//       }
//     }
//   }
// }

provide("changeNavigatorGoto", changeNavigatorGoto)

// const setNavigatorClick = (item, func) => {
//   const currentItem = findItem(navigatorStore.naviItems, item)
//   navigatorStore.setNaviItemClick = [currentItem, func]
// }
// provide("setNavigatorClick", setNavigatorClick)

// const initNavigator1 = () => {
//   console.log("Navigator mark ")
//   // 初始化 && 刷新后的数据更新
//   if (isEmptyProxy(navigatorStore.lastNaviItem)) {
//     console.log("Navigator mark1 ")
//     navigatorStore.setLastNaviItem(navigatorStore.naviItems[0], '')
//     navigatorStore.setNaviItemState([navigatorStore.naviItems[0], true])
//   } else {
//     const lastNaviItem = findItem(navigatorStore.naviItems, navigatorStore.lastNaviItem.item)
//     if (lastNaviItem === undefined) {
//       navigatorStore.setLastNaviItem(navigatorStore.naviItems[0], '')
//       navigatorStore.setNaviItemState([navigatorStore.naviItems[0], true])
//       changeNavigatorGoto(navigatorStore.naviItems[0], navigatorStore.naviItems[0].route)
//     } else {
//       changeNavigatorGoto(navigatorStore.lastNaviItem.item, navigatorStore.lastNaviItem.prefix)
//     }
//   }
// }

const initNavigator = () => {
  navigatorStore.naviItems = naviItems

  // 初始化 && 刷新后的数据更新
  if (isEmptyStr(navigatorStore.mainUri)) {
    navigatorStore.mainUri = router.currentRoute.value.path
  }

  if (isEmptyProxy(navigatorStore.lastNaviItem)) {
    navigatorStore.setLastNaviItem(naviItems[0], '')
    changeNavigatorGoto(naviItems[0], naviItems[0].route)
  } else {
    const lastNaviItem = findItem(naviItems, navigatorStore.lastNaviItem.item)

    if (lastNaviItem === undefined) {
      navigatorStore.setLastNaviItem(naviItems[0], '')
      navigatorStore.setNaviItemState([naviItems[0], true])

      changeNavigatorGoto(naviItems[0], naviItems[0].route)
    } else {
      changeNavigatorGoto(navigatorStore.lastNaviItem.item, navigatorStore.lastNaviItem.prefix)
    }
  }
}

onMounted(() => {
  initNavigator()
})


</script>

<style scoped>

</style>
