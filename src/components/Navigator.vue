/*
* 导航栏或者菜单栏 初始化数据由上层组件初始化时传入store，此组件根据store数据进行渲染
* 导航栏或者菜单栏 运行时数据存入store中，在store中进行持久化，页面刷新时，导航栏可以根据持久化数据进行渲染
* */
<template>
  <q-scroll-area class="fit">
    <NavigatorItem
      :disableNavi="props.disableNavi"
      v-for="( item ) in navigatorStore.naviItems"
      v-bind:key="item.id"
      v-bind:item="item"
    />
  </q-scroll-area>
</template>

<script setup>

import { provide, inject } from 'vue'
import NavigatorItem from "./NavigatorItem.vue"
import { useNavigatorStore } from 'stores/navigator.js'
import { isEmptyProxy, isEmptyStr, findItem } from "../utils/common.js"
import { changeNavigatorGoto } from "../utils/router.js"

const props = defineProps({
  naviGoto: {
    type: Function,
    default: () => {}
  },
  disableNavi: {
    type: Object,
    default: () => {}
  }
})

// const { naviGoto, disableNavi } = toRefs(props)

const router = inject("router")

const navigatorStore = useNavigatorStore()

// const changeNavigatorGoto = (item) => {
//   if (!isEmptyProxy(navigatorStore.lastNaviItem)) {
//     navigatorStore.setLastNaviItemState(false)
//   }
//   navigatorStore.setNaviItemState([item, true])
//   navigatorStore.setLastNaviItem(item)
//   if (isEmptyStr(item.route)) {
//     router.push(navigatorStore.mainUri)
//   } else {
//
//     if (navigatorStore.mainUri[navigatorStore.mainUri.length - 1] === '/') {
//       router.push(navigatorStore.mainUri + item.route)
//     } else {
//       router.push(navigatorStore.mainUri + '/' + item.route)
//     }
//   }
// }
provide("changeNavigatorGoto", changeNavigatorGoto)

const setNavigatorClick = (item, func) => {
  const currentItem = findItem(navigatorStore.naviItems, item)
  navigatorStore.setNaviItemClick = [currentItem, func]
}
provide("setNavigatorClick", setNavigatorClick)

// 初始化 && 刷新后的数据更新
if (isEmptyProxy(navigatorStore.lastNaviItem)) {
  navigatorStore.setLastNaviItem(navigatorStore.naviItems[0])
  navigatorStore.setNaviItemState([navigatorStore.naviItems[0], true])
} else {
  const lastNaviItem = findItem(navigatorStore.naviItems, navigatorStore.lastNaviItem)
  if (lastNaviItem === undefined) {
    navigatorStore.setLastNaviItem(navigatorStore.naviItems[0])
    navigatorStore.setNaviItemState([navigatorStore.naviItems[0], true])
    changeNavigatorGoto(router, navigatorStore.naviItems[0])
  } else {
    navigatorStore.setLastNaviItem(lastNaviItem)
  }
}



</script>

<style scoped>

</style>
