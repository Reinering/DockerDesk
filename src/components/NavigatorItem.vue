<template>
  <q-expansion-item
    expand-separator
    :content-inset-level="0.5"
    :icon="props.item.icon"
    :label="t(props.item.label)"
    v-if="children.length > 0"
  >
    <NavigatorItem
      v-for="( child ) in children"
      :key="child.id"
      :item="child"
      :prefixRoute="prefixRoute === '' ? props.item.route : prefixRoute + '/' + props.item.route"
      :disableNavi="props.disableNavi"
    />
  </q-expansion-item>

<!--  // text-pink bg-primary-->
  <q-item
    :clickable=props.disableNavi.clickabled
    v-ripple
    item.state
    :active="props.item.state"
    active-class="text-pink"
    @click="changeNavigatorGoto(props.item, props.prefixRoute)"
    v-else-if="isShow"
  >
    <q-item-section avatar >
      <q-icon :name="props.item.icon" />
<!--      // 导航文字位置-->
<!--      {{ t(props.item.label) }} -->
    </q-item-section>
    <q-item-section>
<!--      // 导航文字位置-->
      {{ t(props.item.label) }}
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  prefixRoute: {
    type: String,
    default: "",
  },

  item: {
    type: Object,
    default: () => ({
      name: '',
      label: '',
      icon: '',
      route: '',
      mode: '',
      state: false,
      children: []
    })
  },

  disableNavi: {
    type: Object,
    default: () => {}
  }
})

import { ref, reactive, inject, onMounted, onUnmounted, watch } from "vue"
import NavigatorItem from "./NavigatorItem.vue"
import { useConfigStore } from 'stores/config.js'

const t = inject("t")  // i18
const changeNavigatorGoto = inject("changeNavigatorGoto")
const configStore = useConfigStore()

const isShow = ref(true)

const children = reactive([])

const show = () => {
  if (props.item.mode === '' || props.item.mode === configStore.userMode) {
    isShow.value = true
  } else {
    isShow.value = false
  }
}

const initChildren = () => {
  children.length = 0
  for (const child of props.item.children) {
    if (child.mode === '' || child.mode === configStore.userMode) {
      children.push(child)
    }
  }
}

const init = () => {
  initChildren()
}

onMounted(() => {
  init()

  show()
})

onUnmounted(() => {

})


watch(() => configStore.userMode, (newVal, oldVal) => {
  initChildren()

  show()
})

</script>

<style scoped>

</style>
