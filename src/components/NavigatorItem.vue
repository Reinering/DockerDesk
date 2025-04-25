<template>
  <q-expansion-item
    expand-separator
    :content-inset-level="0.5"
    :icon="props.item.icon"
    :label="props.item.label"
    v-if="props.item.children.length > 0"
  >
    <NavigatorItem
      :disableNavi="props.disableNavi"
      v-for="( child ) in props.item.children"
      v-bind:key="child.id"
      v-bind:item="child"
    />
  </q-expansion-item>
  <q-item
    :clickable=props.disableNavi.clickabled
    v-ripple
    item.state
    :active="props.item.state"
    @click="changeNavigatorGoto(props.item)"
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
  item: {
    type: Object,
    default: () => ({
      icon: "",
      label: "",
      children: [],
      state: false
    })
  },
  disableNavi: {
    type: Object,
    default: () => {}
  }
})

const changeNavigatorGoto = inject("changeNavigatorGoto")
const setNavigatorClick = inject("setNavigatorClick")
setNavigatorClick(props.item, () => {
  changeNavigatorGoto(props.item)
})

</script>

<style scoped>

</style>
