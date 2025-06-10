<template>
  <q-page>
    <q-tabs
      v-model="tab"
      no-caps
      inline-label
      active-color="purple"
      class="text-teal shadow-2"
    >
      <q-route-tab name="containers" icon="border_all" label="Containers" to="containers" exact />
      <q-route-tab name="images" icon="crop_square" label="Images" to="images" exact />
      <q-route-tab name="volumes" icon="noise_aware" label="Volumes" to="volumes" exact />
      <q-route-tab name="networks" icon="router" label="Networks" to="networks" exact />
      <q-route-tab name="settings" icon="settings" label="Settings" :to="toSettings" exact />
    </q-tabs>

    <router-view v-slot="{ Component }">
      <keep-alive >
        <component :is="Component" />
      </keep-alive>
    </router-view>

  </q-page>
</template>

<script setup>
import { ref, provide, inject, onMounted, onActivated, onDeactivated, onUnmounted, reactive } from 'vue'
import { isEmptyObj } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const service = reactive({})
provide("service", service)

const tab = ref('containers')

const toSettings = ref("dockerSettings")

const changeSettingRouter = () => {
  if (!isEmptyObj(service)) {
    if (service.serviceType === "docker") {
      toSettings.value = "dockerSettings"
    } else if (service.serviceType === "podman") {
      toSettings.value = "podmanSettings"
    }
  }
}

console.log("NodeLayout init")

onMounted(() => {
  try {
    const data = JSON.parse(route.query.data)
    if (data) {
      for (const key of Object.keys(data)) {
        service[key] = data[key]
      }
    }
  } catch (e) {
    // console.error(e)
  }
})

onActivated(() => {
  console.log("onActivated")
  try {
    const data = JSON.parse(route.query.data)
    if (data) {
      for (const key of Object.keys(data)) {
        service[key] = data[key]
      }
    }
  } catch (e) {
    // console.error(e)
  }
  console.log(service)
  changeSettingRouter()
})

onUnmounted(() => {

})

</script>

<style scoped>

</style>
