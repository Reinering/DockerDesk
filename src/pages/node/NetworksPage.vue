<template>
  <q-card :style="cardStyle">
    <q-card-section>
      <div class="q-gutter-sm row items-center justify-between">
        <div class="text-h6">{{ t('panel.networks.title') }}</div>
        <q-space />
        <div class="q-gutter-sm">
          <q-btn
            icon="control_point"
            size="xs"
            padding="xs"
            color="deep-purple"
            @click="showCreateNetworkDialog = !showCreateNetworkDialog"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('panel.networks.create') }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="refresh" size="xs" padding="xs" color="green" @click="onRefresh">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('panel.networks.refresh') }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-list bordered padding class="rounded-borders text-primary">
      <q-expansion-item
        v-for="(item, index) in rows"
        :key="index"
        group="somegroup"
        icon="commit"
        :label="`${item.name} - ${item.network_id}`"
        header-class="text-primary"
      >
        <q-card>
          <q-card-section>
            <q-item tag="label" v-ripple dense>
              <q-item-section>
                <q-item-label>{{ t('panel.networks.driver') }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                {{ item.driver }}
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple dense>
              <q-item-section>
                <q-item-label>{{ t('panel.networks.subnet') }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                {{ item.subnet }}
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple dense>
              <q-item-section>
                <q-item-label>{{ t('panel.networks.gateway') }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                {{ item.gateway }}
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple dense>
              <q-item-section>
                <q-item-label>IPv6</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                {{ t(`panel.networks.${item.ipv6}`) }}
              </q-item-section>
            </q-item>
            <q-expansion-item
              expand-separator
              icon="share"
              :label="t('panel.networks.containers')"
              header-class="text-primary"
            >
              <template v-slot:header>
                <q-item-section avatar>
                  <q-icon name="share"/>
                </q-item-section>

                <q-item-section>
                  {{t('panel.networks.containers')}}
                </q-item-section>

                <q-item-section side>
                  <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="showBindNetworkDialog = !showBindNetworkDialog">
                    <q-tooltip class="bg-amber text-black shadow-4">
                      {{ t('panel.networks.bind') }}
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </template>

              <q-list>
                <q-expansion-item
                  v-for="(item1, index1) in item.containers"
                  :key="index1"
                  :header-inset-level="1"
                  :content-inset-level="2"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon name="room"/>
                    </q-item-section>

                    <q-item-section>
                      {{item1.name}}
                    </q-item-section>

                    <q-item-section side>
                      <q-btn type="submit" icon="delete_forever" size="xs" padding="xs" color="red" @click.stop="onUnbindNetwork(item1.name, item.network_id)">
                        <q-tooltip class="bg-amber text-black shadow-4">
                          {{ t('panel.networks.unbind') }}
                        </q-tooltip>
                      </q-btn>
                    </q-item-section>
                  </template>

                  <q-item tag="label" v-ripple dense>
                    <q-item-section>
                      <q-item-label>container id</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      {{ item1.id }}
                    </q-item-section>
                  </q-item>
                  <q-item tag="label" v-ripple dense>
                    <q-item-section>
                      <q-item-label>MAC</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      {{ item1.mac }}
                    </q-item-section>
                  </q-item>
                  <q-item tag="label" v-ripple dense>
                    <q-item-section>
                      <q-item-label>IPv4</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      {{ item1.ipv4 }}
                    </q-item-section>
                  </q-item>
                  <q-item tag="label" v-ripple dense>
                    <q-item-section>
                      <q-item-label>IPv6</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      {{ item1.ipv6 }}
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-list>
            </q-expansion-item>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-card>

  <q-dialog v-model="showCreateNetworkDialog">
    <q-card class="q-gutter-sm" style="min-width: 60%; height: 330px;" >
      <q-card-section>
        <div class="text-h6">{{t('panel.networks.createNetworkTitle')}}</div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showBindNetworkDialog">
    <q-card class="q-gutter-sm" style="min-width: 60%; height: 330px;" >
      <q-card-section>
        <div class="text-h6">{{t('panel.networks.bingContainerTitle')}}</div>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { inject, onActivated, onDeactivated, onMounted, onUnmounted, reactive, ref } from 'vue'
import { isEmptyObj } from 'src/utils/common.js'
import { parseDockerNetwork } from 'src/utils/wsl.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject('$q')
const router = inject('router')
const route = inject('route')
const t = inject('t')

const service = inject('service')
const serviceCmd = ref('')

const cardStyle = reactive({
  height:
    process.env.MODE === 'electron'
      ? window.innerHeight - 150 + 'px'
      : window.innerHeight - 149 + 'px',
})

// ['network_id', 'name', 'driver', 'scope', 'subnet', 'gateway', 'ipv6', 'containers']
// containers ['id', 'name', 'mac', 'ipv4', 'ipv6']
const rows = reactive([])

const showCreateNetworkDialog = ref(false)

const showBindNetworkDialog = ref(false)

const onCreateNetwork = () => {

}

const onRefresh = () => {
  getNetworkList()
}

const onBindNetwork = () => {

}

const onUnbindNetwork = (name, network_id) => {
  $q.dialog({
    title: t('confirm'),
    message: t('panel.images.deleteMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {

  })
}

const getNetworkDetail = async (row) => {
  window.wslTerminal
    .execWSL([
      '-d',
      'DockerDesk',
      '--user',
      'root',
      '-e',
      `${serviceCmd.value} network inspect ${row.network_id}`,
    ])
    .then((result) => {
      if (result.success) {
        const data = JSON.parse(result.data)
        if (data[0]['IPAM']['Config']) {
          row.subnet = data[0]['IPAM']['Config'][0]['Subnet']
          row.gateway = data[0]['IPAM']['Config'][0]['Gateway']
        } else {
          row.subnet = ''
          row.gateway = ''
        }

        row.ipv6 = data[0]['EnableIPv6']

        const tmpList = []
        Object.keys(data[0]['Containers']).forEach((item) => {
          tmpList.push({
            id: item.slice(0, 12),
            name: data[0]['Containers'][item]['Name'],
            mac: data[0]['Containers'][item]['MacAddress'],
            ipv4: data[0]['Containers'][item]['IPv4Address'],
            ipv6: data[0]['Containers'][item]['IPv6Address'],
          })
        })

        row['containers'] = tmpList
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.getNetworkInfoError')}: ${row.network_id}: ${result.error}`,
        })
      }
    })
}

const getNetworkList = async () => {
  await window.wslTerminal
    .execWSL(['-d', 'DockerDesk', '--user', 'root', '-e', `${serviceCmd.value} network ls`])
    .then((result) => {
      if (result.success) {
        rows.length = 0
        const data = parseDockerNetwork(result.data)
        if (data.length > 0) {
          rows.push(...data)
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.getNetworksError')}: ${result.error}`,
        })
      }
    })

  for (const row of rows) {
    getNetworkDetail(row)
  }
}

const init = () => {
  getNetworkList()
}

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 182 + 'px'
  } else {
    cardStyle.height = window.innerHeight - 149 + 'px'
  }
}

onMounted(() => {
  serviceCmd.value = service.serviceType
  if (isEmptyObj(serviceCmd.value)) {
    return
  }

  init()

  window.addEventListener('resize', checkScreenSize)
})

onActivated(() => {})

onDeactivated(() => {})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped></style>
