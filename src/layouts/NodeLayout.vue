<template>
  <q-page>
    <q-tabs
      no-caps
      inline-label
      active-color="purple"
      class="text-teal shadow-2"
    >
      <q-route-tab
        v-if="isShowCreate"
        name="create"
        icon="create"
        :label="t('panel.tabs.create')"
        :to="{ path: '/node/create', query: { tab: 'create' } }"
      />
      <q-route-tab
        name="containers"
        icon="border_all"
        :label="t('panel.tabs.containers')"
        :to="{ path: 'containers', query: { tab: 'containers' } }"
        exact
      />
      <q-route-tab
        name="images"
        icon="crop_square"
        :label="t('panel.tabs.images')"
        :to="{ path: 'images', query: { tab: 'images' } }"
        exact
      />
      <q-route-tab
        name="volumes"
        icon="noise_aware"
        :label="t('panel.tabs.volumes')"
        :to="{ path: 'volumes', query: { tab: 'volumes' } }"
        exact
      />
      <q-route-tab
        name="networks"
        icon="router"
        :label="t('panel.tabs.networks')"
        :to="{ path: 'networks', query: { tab: 'networks' } }"
        exact
      />
      <q-route-tab
        name="logs"
        icon="output"
        :label="t('panel.tabs.logs')"
        :to="{ path: 'logs', query: { tab: 'logs' } }"
      />
      <q-route-tab
        name="settings"
        icon="settings"
        :label="t('panel.tabs.settings')"
        :to="{ path: toSettings, query: { tab: toSettings } }"
        exact
      />
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
import { usePodmanStore } from 'src/stores/podman.js'
import { firstUpper, isEmptyObj, isEmptyStr } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const podmanStore = usePodmanStore()

const service = reactive({})
provide("service", service)

const toSettings = ref("dockerSettings")

const isShowCreate = ref(false)

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

const showCreatePage = () => {
  isShowCreate.value = true
}
provide("showCreatePage", showCreatePage)




const initDocker = () => {

}

const initPodman = () => {

  // init env
  window.client.getSettings("podman_proxy_mode").then((result) => {
    if (result.success) {
      podmanStore.mode = firstUpper(result.data.value)

      if (result.data.value === "manual") {
        window.client.getSettings("web_proxy").then((result) => {
          if (result.success) {
            if (isEmptyStr(result.data.value)) {
              return
            }

            const data = JSON.parse(result.data.value)

            if (result.data.value) {
              podmanStore.proxies.httpProxy = data.http_proxy
              podmanStore.proxies.httpsProxy = data.https_proxy
              podmanStore.proxies.noProxy = data.no_proxy
            }
          }
        })
      } else if (result.data.value === "system") {
        window.myWindowAPI.getProxy().then((result) => {
          if (!isEmptyObj(result)) {
            podmanStore.proxies.httpProxy = result.http
            podmanStore.proxies.httpsProxy = result.https
            podmanStore.proxies.noProxy = result.byPass
          }
        })
      }
    }
  })


}


const init = () => {
  if (!isEmptyObj(service)) {
    if (service.serviceType === "docker") {
      initDocker()
    } else if (service.serviceType === "podman") {
      initPodman()
    }
  }
}

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

  changeSettingRouter()

  init()

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

  init()
})

onUnmounted(() => {

})

</script>

<style scoped>

</style>
