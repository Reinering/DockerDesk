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

        <q-select
          clearable
          outlined
          dense
          :model-value="search"
          use-input
          fill-input
          input-debounce="0"
          :options="options"
          @filter="filterFn"
          @input-value="setModel"
          label="Search"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:append>
            <q-icon v-if="search !== ''" name="close" @click.stop="search = ''" class="cursor-pointer" />
            <q-icon name="search" @click.stop />
          </template>
        </q-select>
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
    :onClose="() => showSettingsDialog = false"
  />

  <ContainerAppDialog
    v-if="showAppDialog"
    v-model="showAppDialog"
    :data="currentItem"
    :onClose="() => showAppDialog = false"
  />

  <AppInstallDialog
    v-if="showInstallDialog"
    v-model="showInstallDialog"
    transition-show="scale"
    transition-hide="scale"
    :item="currentItem"
    :mode="installMode"
    :onClose="() => showInstallDialog = false"
  />

  <AppCustomInstallDialog
    v-if="showCustomInstallDialog"
    v-model="showCustomInstallDialog"
    transition-show="scale"
    transition-hide="scale"
    :item="currentItem"
    :mode="installMode"
    :node="installNode"
    :onClose="() => showCustomInstallDialog = false"
  />

  <q-dialog
    v-if="showOptionDialog"
    v-model="showOptionDialog"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ t('store.confirmInstall') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ t('store.installPrompt') }}
      </q-card-section>

      <q-card-section
        v-if="configStore.userMode === 'professional'"
      >
        <div class="bg-grey-2 row">
          <q-item-section class="text-center">{{ t('store.selectNode') }}</q-item-section>
          <q-select
            v-model="installNode"
            class="bg-grey-3"
            color="blue"
            bg-color="cyan-14"
            :options="nodes"
            filled
            dense
            borderless
            transition-show="flip-up"
            transition-hide="flip-down"
            style="min-width: 50%"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-btn-toggle
          v-model="installMode"
          spread
          no-caps
          toggle-color="purple"
          color="white"
          text-color="black"
          :options="installOptions"
        />

      </q-card-section>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="() => showOptionDialog = false" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onConfirmOK"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { ref, inject, reactive, onMounted, onUnmounted, toRaw } from 'vue'
import ContainerApp from 'components/ContainerApp.vue'
import StoreSettingsDialog from 'components/dialog/StoreSettingsDialog.vue'
import ContainerAppDialog from 'components/dialog/ContainerAppDialog.vue'
import AppInstallDialog from 'components/dialog/AppInstallDialog.vue'
import AppCustomInstallDialog from 'components/dialog/AppCustomInstallDialog.vue'
import { clientConfig } from 'src/common/config.js'
import { isEmptyObj } from 'src/utils/common.js'
import { useConfigStore } from 'stores/config.js'


const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const configStore = useConfigStore()

const nodes = reactive([])

const categories = reactive([
  '',
])

const search = ref('')

const showSettingsDialog = ref(false)

const showAppDialog = ref(false)

const showOptionDialog = ref(false)
const installOptions = [
  {label: t('store.defaultInstall'), value: 'default'},
  {label: t('store.customInstall'), value: 'custom'}
]
const installMode = ref('default')
const installNode = ref('')

const showInstallDialog = ref(false)

const showCustomInstallDialog = ref(false)

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 50 + "px" : window.innerHeight - 97 + "px",
})

const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 122 + "px" : window.innerHeight - 97 - 58 + "px",
})

const dockerStoreApis = reactive([])

const storeDatas = reactive([])

const currentItem = ref(null)

const onConfirmOK = () => {
  if (configStore.userMode === 'professional' && installNode.value === '') {
    $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: t('verifyMessage.dataNotNull')
    })

    return
  }

  showOptionDialog.value = false

  if (installMode.value === 'default') {
    showInstallDialog.value = true
  } else {
    showCustomInstallDialog.value = true
  }
}

const onSettings = () => {
  showSettingsDialog.value = true
}

const onAppClick = (item) => {
  console.log("onAppClick")

  currentItem.value = item
  installNode.value = ''
  installMode.value = 'default'
  showOptionDialog.value = true
}



const onUpdate = () => {
  onRefresh()
}

const onRefresh = async () => {

  const resTmp = []
  for (const item of dockerStoreApis) {
    if (!item.enable) {
      continue
    }

    const result = await getApiData(item["url"])
    if (Object.prototype.hasOwnProperty.call(result, "apps")) {
      resTmp.push(result)
    }
  }

  if (resTmp.length > 0) {
    storeDatas.splice(0, storeDatas.length)
    storeDatas.push(...resTmp)

    await window.client.writeStoreData(JSON.stringify(storeDatas)).then((result) => {
      if (!result.success) {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('store.saveError')}`
        })
      }
    })
  }

  // if (storeDatas.length === 0) {
  //   return
  // }
}

const getApiData = async (url) => {
  return await window.myWindowAPI.fetchData(
    url,
    {method: 'get'}
  ).then((result) => {
    if (result.success && result.data) {
      return result.data
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('store.getApiError')}: ${url}`
      })

      return []
    }
  })
}

const getNodes = () => {
  window.nodes.getNodes().then((result) => {
    if (result instanceof Array) {
      if (!isEmptyObj(result)) {
        for (const node of result) {
          if (node.serviceType === "Docker" || node.serviceType === "Podman") {
            nodes.push({label: node.serviceName, value: node.id})
          }
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

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 50 + "px"
    scrollStyle.height = window.innerHeight - 122 + "px"
  } else {
    cardStyle.height = window.innerHeight - 97 + "px"
    scrollStyle.height = window.innerHeight - 97 - 58 + "px"
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

  if (configStore.userMode === 'professional') {
    getNodes()
  }
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
