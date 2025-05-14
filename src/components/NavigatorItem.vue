<template>
  <q-expansion-item
    expand-separator
    :content-inset-level="0.5"
    :icon="props.item.icon"
    :label="props.item.label"
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
  <q-item
    :clickable=props.disableNavi.clickabled
    v-ripple
    item.state
    :active="props.item.state"
    @click="changeNavigatorGoto(props.item, props.prefixRoute)"
    v-else
  >
    <q-item-section avatar >
      <q-icon :name="props.item.icon" />
    </q-item-section>
    <q-item-section>
      {{ props.item.label }}
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

const changeNavigatorGoto = inject("changeNavigatorGoto")
// const setNavigatorClick = inject("setNavigatorClick")
// setNavigatorClick(props.item, () => {
//   changeNavigatorGoto(props.item, props.prefixRoute)
// })


</script>

<style scoped>

</style>
