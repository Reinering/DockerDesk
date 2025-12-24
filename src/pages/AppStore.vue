<template>
  <q-card :style="cardStyle">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="q-gutter-sm">
          <q-btn
            icon="settings"
            size="xs"
            padding="xs"
            color="pink"
            @click="onSettings"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('store.settings') }}
            </q-tooltip>
          </q-btn>

          <q-btn
            icon="refresh"
            size="xs"
            padding="xs"
            color="green"
            @click="onRefresh"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('store.refresh') }}
            </q-tooltip>
          </q-btn>
        </div>

        <q-separator />

        <q-input v-model="search" dense label="Search" outlined clearable >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-separator />

    <q-scroll-area :style="scrollStyle">
      <div
        v-for="(store, index) in storeDatas"
        :key="index"
        class="q-gutter-md q-pa-md row justify-center"
      >
          <ContainerApp
            v-for="(item, index) in store.apps"
            :key="index"
            :storeName="store.name"
            :data="item"
            @click="onAppClick(item)"
          />
      </div>

    </q-scroll-area>

  </q-card>

  <StoreSettingsDialog
    v-if="showSettingsDialog"
    v-model="showSettingsDialog"
    :data="{
      storeApis: dockerStoreApis
    }"
    :onUpdate="onUpdate"
    :onClose="onSettingsClose"
  />

  <ContainerAppDialog
    v-if="showAppDialog"
    v-model="showAppDialog"
    :onClose="onAppClose"
  />
</template>

<script setup>
import { ref, inject, reactive, onMounted, onUnmounted, toRaw } from 'vue'
import ContainerApp from 'components/ContainerApp.vue'
import StoreSettingsDialog from 'components/dialog/StoreSettingsDialog.vue'
import ContainerAppDialog from 'components/dialog/ContainerAppDialog.vue'
import { clientConfig } from 'src/common/config.js'
import { parseWSLListVersion } from 'src/utils/wsl.js'
import { isEmptyObj } from 'src/utils/common.js'
import { useConfigStore } from 'stores/config.js'


const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const configStore = useConfigStore()

const services = reactive([])

const WSLList = reactive([])

const search = ref('')

const showSettingsDialog = ref(false)

const showAppDialog = ref(false)

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 102 + "px" : window.innerHeight - 149 + "px",
})

const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 174 + "px" : window.innerHeight - 149 - 58 + "px",
})

const dockerStoreApis = reactive([])

const storeDatas = reactive([])

const onSettingsClose = () => {
  showSettingsDialog.value = !showSettingsDialog.value
}

const onAppClose = () => {
  showAppDialog.value = !showAppDialog.value
}


const onSettings = () => {
  showSettingsDialog.value = true
}



const onAppClick = (item) => {
  console.log("onAppClick")

  showAppDialog.value = true

  // $q.dialog({
  //   title: t('store.confirm'),
  //   message: 'Would you like to turn on the wifi?',
  //   ok: {
  //     push: true
  //   },
  //   cancel: {
  //     push: true,
  //     color: 'negative'
  //   },
  //   persistent: true
  // }).onOk(() => {
  //   // console.log('>>>> OK')
  // }).onCancel(() => {
  //   // console.log('>>>> Cancel')
  // }).onDismiss(() => {
  //   // console.log('I am triggered on both OK and Cancel')
  // })
}



const onUpdate = () => {
  onRefresh()
}

const onRefresh = async () => {
  storeDatas.splice(0, storeDatas.length)

  for (const item of dockerStoreApis) {
    if (!item.enable) {
      continue
    }
    await getApiData(item["url"])
  }

  await window.client.writeStoreData(JSON.stringify(storeDatas)).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: `${t('store.saveSuccess')}`
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('store.saveError')}`
      })
    }
  })

  if (storeDatas.length === 0) {
    return
  }

  if (configStore.userMode === 'professional') {
    getWSLList()
  }

  getNodes()

}

const getApiData = async (url) => {
  await window.myWindowAPI.fetchData(
    url,
    {method: 'get'}
  ).then((result) => {
    if (result.success && result.data) {
      storeDatas.push(result.data)
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('store.getApiError')}: ${url}`
      })
    }
  })
}

const getNodes = () => {
  services.length = 0
  window.nodes.getNodes().then((result) => {
    if (result instanceof Array) {
      if (!isEmptyObj(result)) {
        for (const node of result) {
          if (node.connectionType === "local") {
            node.connectionType = t('node.localNode')
          } else if (node.connectionType === "remote") {
            node.connectionType = t('node.remoteNode')
          }

          if (node.protocol === "telnet") {
            node.protocol = "Telnet"
          } else if (node.protocol === "ssh") {
            node.protocol = "SSH"
          }

          if (node.authType === "password") {
            node.authType = t('node.password')
          } else if (node.authType === "key") {
            node.authType = t('node.key')
          }

          services.push(node)
        }
      }
    } else {
      if (result.success === false) {

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('database.accessFail') + ': ' + result.error
        })
      }
    }
  })
}

const getWSLList = () => {
  window.wslTerminal.getWSLList().then((result) => {
    if (result.success) {
      const data = parseWSLListVersion(result.data)
      for (let index in data) {
        WSLList.push(data[index].name)
      }
    }
  })
}

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 102 + "px"
    scrollStyle.height = window.innerHeight - 174 + "px"
  } else {
    cardStyle.height = window.innerHeight - 149 + "px"
    scrollStyle.height = window.innerHeight - 149 - 58 + "px"
  }
}

const init =() => {

  window.client.getSettings("storeApis").then((result) => {
    if (result.success && result.data && result.data.type === "json") {
      const data = JSON.parse(result.data.value)
      dockerStoreApis.push(...data)
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('store.getApiError')}`
      })
    }
  })

  window.client.readStoreData().then((result) => {
    if (result.success && result.data) {
      storeDatas.splice(0, storeDatas.length)

      for (const item of JSON.parse(result.data)) {
        storeDatas.push(item)
      }
    } else {
      onRefresh()
    }
  })

}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {

  window.removeEventListener('resize', checkScreenSize)
})


</script>

<style scoped>

</style>
