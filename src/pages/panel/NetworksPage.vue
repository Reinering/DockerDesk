<template>
  <q-card :style="cardStyle">
    <q-card-section>
      <div class="q-gutter-sm row items-center justify-between">
        <q-field
          dense
          standout
        >
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{t('panel.networks.title')}}</div>
          </template>
        </q-field>
        <q-space />
        <div class="q-gutter-sm">
          <q-btn
            icon="control_point"
            size="xs"
            padding="xs"
            color="deep-purple"
            @click="onShowCreateNetworkDialog"
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
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="account_tree"/>
          </q-item-section>

          <q-item-section>
            {{`${item.name} - ${item.network_id}`}}
          </q-item-section>

          <q-item-section side>
            <q-btn type="submit" icon="delete" size="xs" padding="xs" color="red" @click.stop="onDeleteNetwork(item)">
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.networks.delete') }}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </template>

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
                  {{t('panel.networks.onlineContainers')}}
                </q-item-section>

                <q-item-section side>
                  <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onShowBindNetworkDialog(item)">
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
                      <q-btn type="submit" icon="delete_forever" size="xs" padding="xs" color="red" @click.stop="onUnbindNetwork(item1.name, item)">
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
    <q-card class="q-gutter-sm" style="min-width: 40%; height: 380px;" >
      <q-card-section>
        <div class="text-h6">{{t('panel.networks.createNetworkTitle')}} - Bridge</div>
      </q-card-section>

      <q-form class="q-ma-md q-gutter-md">
        <q-input
          class="text-body1"
          filled
          dense
          :label="t('panel.networks.name')"
          v-model="newNetwork.name"
        />
        <q-input
          class="text-body1"
          filled
          dense
          :label="t('panel.networks.subnet')+t('panel.networks.optional')"
          v-model="newNetwork.subnet"
          hint="Mask: #.#.#.#/#"
        />
        <q-input
          class="text-body1"
          filled
          dense
          :label="t('panel.networks.gateway')+t('panel.networks.optional')"
          v-model="newNetwork.gateway"
          hint="Mask: #.#.#.#"
        />
      </q-form>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="showCreateNetworkDialog = !showCreateNetworkDialog" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onCreateNetwork" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showBindNetworkDialog">
    <q-card class="q-gutter-sm" style="min-width: 60%; height: 450px;" >
      <div class="text-h6">{{t('panel.networks.bingContainerTitle')}}</div>
      <q-item-label class="text-pink" caption lines="1" >Network: {{`${selectedNetwork.name} - ${selectedNetwork.network_id}`}}</q-item-label>

      <q-scroll-area style="height: 300px;">
        <q-list tag="label" v-ripple>
          <q-item-label header>{{t(`panel.networks.containerList`)}}</q-item-label>

          <q-item
            v-for="(item, index) in containerDatas"
            :key="index"
            tag="label"
            v-ripple
          >
            <q-item-section side top>
              <q-checkbox v-model="item['selected']" color="teal" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{`${item.names} - ${item.containerId}`}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="showBindNetworkDialog = !showBindNetworkDialog" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onBindNetwork" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { inject, onActivated, onDeactivated, onMounted, onUnmounted, reactive, ref } from 'vue'
import { firstLower, isEmptyObj, isEmptyStr } from 'src/utils/common.js'
import { parseDockerContainer, parseDockerNetwork, parsePodmanContainer } from 'src/utils/wsl.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject('$q')
const router = inject('router')
const route = inject('route')
const t = inject('t')

const service = inject('service')
const serviceCmd = ref('')

const connectState = inject('connectState')
const dockerInfo = inject('dockerInfo')
const podmanInfo = inject('podmanInfo')
const wslInfo = inject('wslInfo')

const cardStyle = reactive({
  height:
    process.env.MODE === 'electron'
      ? window.innerHeight - 150 - 48 + 'px'
      : window.innerHeight - 149 - 48 + 'px',
})

// ['network_id', 'name', 'driver', 'scope', 'subnet', 'gateway', 'ipv6', 'containers']
// containers ['id', 'name', 'mac', 'ipv4', 'ipv6']
const rows = reactive([])

const newNetwork = ref({
  name: '',
  subnet: '',
  gateway: ''
})
const showCreateNetworkDialog = ref(false)

const onShowCreateNetworkDialog = () => {
  showCreateNetworkDialog.value = !showCreateNetworkDialog.value

  newNetwork.value.name = ''
  newNetwork.value.subnet = ''
  newNetwork.value.gateway = ''
}

const onCreateNetwork = () => {
  if (isEmptyStr(newNetwork.value.name)) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('panel.networks.paramsError')}`,
    })
  }
  let command = []

  if (!isEmptyStr(newNetwork.value.subnet)) {
    command.push("--subnet")
    command.push(newNetwork.value.subnet)
  }

  if (!isEmptyStr(newNetwork.value.gateway)) {
    command.push("--gateway")
    command.push(newNetwork.value.gateway)
  }

  command.push(newNetwork.value.name)

  if (service.connectionType === t('node.remoteNode')) {
    if (!connectState.value) {
      return
    }

    if (serviceCmd.value === "docker" && !dockerInfo.enable) {
      return
    } else if (serviceCmd.value === "podman" && !podmanInfo.enable) {
      return
    }

    window.containerTerminal.exec({
      connID: service.id,
      command: `${serviceCmd.value} network create ${command.join(' ')}`
    }).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.createNetworkSuccess')}`,
        })

        showCreateNetworkDialog.value = false
        getNetworkList()
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.createNetworkFail')}: ${result.error}`
        })
      }
    })
  } else {
    if (!wslInfo.enable) {
      return
    }

    window.wslTerminal.execWSL(
      [ '-d', 'DockerDesk', '--user', 'root', '-e', "bash", '-c', `"${serviceCmd.value} network create ${command.join(' ')}"` ]
    ).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.createNetworkSuccess')}`,
        })

        showCreateNetworkDialog.value = false
        getNetworkList()
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.createNetworkFail')}: ${result.error}`
        })
      }
    })
  }
}

const showBindNetworkDialog = ref(false)
const containerDatas = reactive([])
const selectedNetwork = ref(null)

const onShowBindNetworkDialog = (item) => {
  selectedNetwork.value = item

  getContainerList()

  showBindNetworkDialog.value = true
}

const onBindNetwork = async () => {
  for (const item of containerDatas) {
    if (item["selected"] === true) {
      await window.wslTerminal.execWSL(
        [ '-d', 'DockerDesk', '--user', 'root', '-e', "bash", '-c', `"${serviceCmd.value} network connect ${selectedNetwork.value.network_id} ${item.containerId}"` ]
      ).then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.networkBindSuccess')}`,
          })
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.networkBindFail')}: ${result.error}`
          })
        }
      })
    }
  }
  getNetworkDetail(selectedNetwork.value)
  showBindNetworkDialog.value = false
}

const onUnbindNetwork = (name, network) => {
  $q.dialog({
    title: t('confirm'),
    message: t('panel.networks.unbindMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    if (service.connectionType === t('node.remoteNode')) {
      if (!connectState.value) {
        return
      }

      if (serviceCmd.value === "docker" && !dockerInfo.enable) {
        return
      } else if (serviceCmd.value === "podman" && !podmanInfo.enable) {
        return
      }

      window.containerTerminal.exec({
        connID: service.id,
        command: `${serviceCmd.value} network disconnect ${network.network_id} ${name}`
      }).then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.networkUnbindSuccess')}`,
          })

          getNetworkDetail(network)
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.networkUnbindFail')}: ${result.error}`
          })
        }
      })
    } else {
      if (!wslInfo.enable) {
        return
      }

      window.wslTerminal.execWSL(
        [ '-d', 'DockerDesk', '--user', 'root', '-e', "bash", '-c', `"${serviceCmd.value} network disconnect ${network.network_id} ${name}"` ]
      ).then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.networkUnbindSuccess')}`,
          })

          getNetworkDetail(network)
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.networkUnbindFail')}: ${result.error}`
          })
        }
      })
    }
  })
}

const onRefresh = () => {
  getNetworkList()
}

const onDeleteNetwork = (item) => {
  if (item.containers.length > 0) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('panel.networks.networkBindFail')}`
    })
  }

  $q.dialog({
    title: t('confirm'),
    message: t('panel.networks.deleteNetworkMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    if (service.connectionType === t('node.remoteNode')) {
      if (!connectState.value) {
        return
      }

      if (serviceCmd.value === "docker" && !dockerInfo.enable) {
        return
      } else if (serviceCmd.value === "podman" && !podmanInfo.enable) {
        return
      }

      window.containerTerminal.exec({
        connID: service.id,
        command: `${serviceCmd.value} network rm ${item.network_id}`
      }).then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.deleteNetworkSuccess')}`,
          })

          for (let i=0; i < rows.length; i++) {
            if (rows[i].name === item.name) {
              rows.splice(i, 1)

              break
            }
          }
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.deleteNetworkFail')}: ${result.error}`
          })
        }
      })
    } else {
      if (!wslInfo.enable) {
        return
      }

      window.wslTerminal.execWSL(
        ['-d', 'DockerDesk', '--user', 'root', '-e', "bash", '-c', `"${serviceCmd.value} network rm ${item.network_id}"`]
      ).then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.deleteNetworkSuccess')}`,
          })

          for (let i=0; i < rows.length; i++) {
            if (rows[i].name === item.name) {
              rows.splice(i, 1)

              break
            }
          }
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.deleteNetworkFail')}: ${result.error}`
          })
        }
      })
    }
  })
}

const getContainerList = () => {
  if (service.connectionType === t('node.remoteNode')) {
    if (!connectState.value) {
      return
    }

    if (serviceCmd.value === "docker" && !dockerInfo.enable) {
      return
    } else if (serviceCmd.value === "podman" && !podmanInfo.enable) {
      return
    }

    window.containerTerminal.exec({
      connID: service.id,
      command: `${serviceCmd.value}  ps -a`
    }).then((result) => {
      if (result.success) {
        containerDatas.length = 0

        if (serviceCmd.value === "docker") {
          const containerNames = []
          for (const it of selectedNetwork.value["containers"]) {
            containerNames.push(it["name"])
          }

          const items = parseDockerContainer(result.data)
          containerDatas.length = 0
          for (const item of items) {
            if (containerNames.indexOf(item["names"]) === -1) {
              item["selected"] = false
              containerDatas.push(item)
            }
          }
        } else if (serviceCmd.value === "podman") {
          const items = parsePodmanContainer(result.data)
          containerDatas.length = 0
          for (const item of items) {
            item["selected"] = false
            containerDatas.push(item)
          }
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.containers.getContainersError')}: ${result.error}`,
        })
      }
    })
  } else {
    if (!wslInfo.enable) {
      return
    }

    window.wslTerminal.execWSL([
      '-d', 'DockerDesk', '--user', 'root', '-e', `${serviceCmd.value} ps -a`
    ]).then((result) => {
      if (result.success) {
        containerDatas.length = 0

        if (serviceCmd.value === "docker") {
          const containerNames = []
          for (const it of selectedNetwork.value["containers"]) {
            containerNames.push(it["name"])
          }

          const items = parseDockerContainer(result.data)
          containerDatas.length = 0
          for (const item of items) {
            if (containerNames.indexOf(item["names"]) === -1) {
              item["selected"] = false
              containerDatas.push(item)
            }
          }
        } else if (serviceCmd.value === "podman") {
          const items = parsePodmanContainer(result.data)
          containerDatas.length = 0
          for (const item of items) {
            item["selected"] = false
            containerDatas.push(item)
          }
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.containers.getContainersError')}: ${result.error}`,
        })
      }
    })
  }
}

const getNetworkDetail = async (row) => {
  if (service.connectionType === t('node.remoteNode')) {
    if (!connectState.value) {
      return
    }

    if (serviceCmd.value === "docker" && !dockerInfo.enable) {
      return
    } else if (serviceCmd.value === "podman" && !podmanInfo.enable) {
      return
    }

    window.containerTerminal.exec({
      connID: service.id,
      command: `${serviceCmd.value} network inspect ${row.network_id}`
    }).then((result) => {
      if (result.success) {
        const data = JSON.parse(result.data)
        if (serviceCmd.value ==="docker") {
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
        } else if (serviceCmd.value ==="podman") {
          if (data[0]['subnets']) {
            row.subnet = data[0]['subnets'][0]['subnet']
            row.gateway = data[0]['subnets'][0]['gateway']
          } else {
            row.subnet = ''
            row.gateway = ''
          }

          row.ipv6 = data[0]['ipv6_enabled']

          // podman 4.x.x 不支持containers  5.x.x 支持
          const tmpList = []
          row['containers'] = tmpList
        }

      } else {
        if (!wslInfo.enable) {
          return
        }

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.getNetworkInfoError')}: ${row.network_id}: ${result.error}`,
        })
      }
    })
  } else {
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
          if (serviceCmd.value ==="docker") {
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
          } else if (serviceCmd.value ==="podman") {
            if (data[0]['subnets']) {
              row.subnet = data[0]['subnets'][0]['subnet']
              row.gateway = data[0]['subnets'][0]['gateway']
            } else {
              row.subnet = ''
              row.gateway = ''
            }

            row.ipv6 = data[0]['ipv6_enabled']

            // podman 4.x.x 不支持containers  5.x.x 支持
            const tmpList = []
            row['containers'] = tmpList
          }

        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.networks.getNetworkInfoError')}: ${row.network_id}: ${result.error}`,
          })
        }
      })
  }
}

const getNetworkList = async () => {
  if (service.connectionType === t('node.remoteNode')) {
    if (!connectState.value) {
      return
    }

    if (serviceCmd.value === "docker" && !dockerInfo.enable) {
      return
    } else if (serviceCmd.value === "podman" && !podmanInfo.enable) {
      return
    }

    await window.containerTerminal.exec({
      connID: service.id,
      command: `${serviceCmd.value} network ls`
    }).then((result) => {
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
  } else {
    if (!wslInfo.enable) {
      return
    }

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
  }

  for (const row of rows) {
    getNetworkDetail(row)
  }
}

const init = () => {
  getNetworkList()
}

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 182 - 48 + 'px'
  } else {
    cardStyle.height = window.innerHeight - 149 - 48 + 'px'
  }
}

onMounted(() => {
  serviceCmd.value = firstLower(service.serviceType)
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
