<template>
  <q-expansion-item
    expand-separator
    :content-inset-level="0.5"
    :icon="props.item.icon"
    :label="t(props.item.label)"
    v-if="props.item.children.length > 0"
  >
    <NavigatorItem
      v-for="( child ) in props.item.children"
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
    v-else
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

import { inject } from "vue"
import NavigatorItem from "./NavigatorItem.vue"


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
      state: false,
      children: []
    })
  },

  disableNavi: {
    type: Object,
    default: () => {}
  }
})

const t = inject("t")  // i18

const changeNavigatorGoto = inject("changeNavigatorGoto")

</script>

<style scoped>

</style>
