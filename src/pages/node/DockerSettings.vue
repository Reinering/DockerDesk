<template>
  <q-card class="q-ma-md" :style="cardStyle">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="text-h6" v-if="service" >{{firstUpper(service.serviceType) + t('panel.settings.settings')}}</div>
        <q-btn color="blue" :label="t('panel.settings.save')" @click="onSave"/>
      </div>
    </q-card-section>

    <q-separator />

    <q-scroll-area :style="scrollStyle">

<!--      basic-->
      <div class="q-pa-md">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
            <div class="col">
              <q-btn
                flat
                dense
                color="grey-6"
                style="background-color: #e9ecef; border-radius: 4px; font-size: 16px; padding: 4px 12px;"
              >
                {{t('panel.settings.basicSettings')}}
              </q-btn>
            </div>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">
            <q-input
              filled
              bottom-slots
              :disable="daemonPath.disable"
              v-model="daemonPath.path"
              label="daemon.json"
            >
              <template v-slot:append>
                <q-icon v-if="daemonPath.path !== ''" name="close" @click="daemonPath.path = ''" class="cursor-pointer" />
              </template>

              <template v-slot:after>
                <q-btn round dense flat :icon="daemonPath.icon" @click="onDaemonPathEdit">
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('panel.settings.edit')}}
                  </q-tooltip>
                </q-btn>
              </template>
            </q-input>

            <q-input
              filled
              bottom-slots
              hint="Mask: #.#.#.#,#.#.#.#"
              :disable="daemonDNS.disable"
              v-model="daemonDNS.dns"
              label="DNS"
            >
              <template v-slot:append>
                <q-icon v-if="daemonDNS.dns !== ''" name="close" @click="daemonDNS.dns = ''" class="cursor-pointer" />
              </template>

              <template v-slot:after>
                <q-btn round dense flat :icon="daemonDNS.icon" @click="onDaemonDNSEdit">
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('panel.settings.edit')}}
                  </q-tooltip>
                </q-btn>
              </template>
            </q-input>
          </div>
        </q-card>
      </div>

<!--      registry-mirror-->
      <div class="q-pa-md">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
            <div class="col">
              <q-btn
                flat
                dense
                color="grey-6"
                style="background-color: #e9ecef; border-radius: 4px; font-size: 16px; padding: 4px 12px;"
              >
                {{t('panel.settings.registryMirrors')}}
              </q-btn>
            </div>
            <div class="q-gutter-sm">
              <q-btn color="grey" :label="t('panel.settings.add')" @click="showRMDialog = !showRMDialog" />
            </div>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">
            <q-list>
              <q-item
                v-for="(item, index) in registryMirrors"
                :key="index"
              >

                <q-item-section class="bg-grey-4 q-px-sm">
                  <q-item-label >{{ item }}</q-item-label>
                </q-item-section>

                <q-item-section top side>
                  <div class="row q-gutter-xs">
                    <q-btn dense flat icon="delete" color="red" @click="onRegistryMirrorsDelete(index)">
                      <q-tooltip class="bg-amber text-black shadow-4">
                        {{t('delete')}}
                      </q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>

            </q-list>
          </div>
        </q-card>
      </div>

<!--      proxy-->
      <div class="q-pa-md">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
            <div class="col">
              <q-btn
                flat
                dense
                color="grey-6"
                style="background-color: #e9ecef; border-radius: 4px; font-size: 16px; padding: 4px 12px;"
              >
                {{t('panel.settings.proxySetting')}}
              </q-btn>
            </div>

            <div class="col text-grey text-caption q-pt-md">
              如果有稳定的网络代理，建议使用网络代理更简单
            </div>

            <q-space />

            <q-btn color="grey" :icon="daemonProxies.editIcon" @click="onProxyEdit" >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('panel.settings.edit')}}
              </q-tooltip>
            </q-btn>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">
            <div class="row q-pl-md items-center justify-between bg-grey-2">
              <div class="text-body2">{{ t('panel.settings.proxyMode') }}</div>
              <q-select
                class="bg-grey-3"
                color="blue"
                bg-color="cyan-14"
                v-model="proxyMode"
                :options="proxyModes"
                filled
                dense
                borderless
                emit-value
                transition-show="flip-up"
                transition-hide="flip-down"
                @filter="filterFn"
                style="min-width: 200px"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.desc }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <q-input
              v-if="proxyMode !== 'Disable'"
              :disable="daemonProxies.disable"
              filled
              dense
              bottom-slots
              v-model="daemonProxies.http"
              label="HTTP:"
            >
              <template v-slot:append>
                <q-icon v-if="daemonProxies.http !== ''" name="close" @click="daemonProxies.http = ''" class="cursor-pointer" />
              </template>
            </q-input>

            <q-input
              v-if="proxyMode !== 'Disable'"
              :disable="daemonProxies.disable"
              filled
              dense
              bottom-slots
              v-model="daemonProxies.https"
              label="HTTPS"
            >
              <template v-slot:append>
                <q-icon v-if="daemonProxies.https !== ''" name="close" @click="daemonProxies.https = ''" class="cursor-pointer" />
              </template>

            </q-input>

            <q-input
              v-if="proxyMode !== 'Disable'"
              :disable="daemonProxies.disable"
              filled
              dense
              bottom-slots
              v-model="daemonProxies.byPass"
              label="Bypass proxy settings for these hosts and domains:"
            >
              <template v-slot:append>
                <q-icon v-if="daemonProxies.byPass !== ''" name="close" @click="daemonProxies.byPass = ''" class="cursor-pointer" />
              </template>
            </q-input>
          </div>
        </q-card>
      </div>

<!--      registry-->
      <div class="q-pa-md">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
            <div class="col">
              <q-btn
                flat
                dense
                color="grey-6"
                style="background-color: #e9ecef; border-radius: 4px; font-size: 16px; padding: 4px 12px;"
              >
                {{t('panel.settings.registry')}}
              </q-btn>
            </div>
            <div class="q-gutter-sm">
              <q-btn color="grey" :label="t('panel.settings.add')" @click="showRDialog = !showRDialog" />
            </div>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">
            <q-list>
              <q-item
                v-for="(item, index) in registries"
                :key="index"
              >
                <q-item-section top class="col-1 gt-sm">
                  <q-item-label class="q-mt-sm">GitHub</q-item-label>
                </q-item-section>

                <q-item-section top>
                  <q-input dense label="registry" v-model="item.url" :disable="item.disable" />
                </q-item-section>

                <q-item-section top>
                  <q-input dense label="username" :type="item.type" v-model="item.username" :disable="item.disable" />
                </q-item-section>

                <q-item-section top>
                  <q-input dense label="password" :type="item.type" v-model="item.password" :disable="item.disable" />
                </q-item-section>

                <q-item-section top side>
                  <div class="row q-gutter-xs">
                    <q-btn dense flat :icon="item.editIcon" @click="onRegistryEdit(item)">
                      <q-tooltip class="bg-amber text-black shadow-4">
                        {{t('edit')}}
                      </q-tooltip>
                    </q-btn>
                    <q-btn dense flat icon="delete" color="red" @click="onRegistryDelete(index)">
                      <q-tooltip class="bg-amber text-black shadow-4">
                        {{t('delete')}}
                      </q-tooltip>
                    </q-btn>
                    <q-btn dense flat icon="send"  color="teal" @click="onRegistryApply(item)">
                      <q-tooltip class="bg-amber text-black shadow-4">
                        {{t('apply')}}
                      </q-tooltip>
                    </q-btn>
                    <!--                    <q-btn size="12px" flat dense round icon="more_vert" />-->
                  </div>
                </q-item-section>
              </q-item>

            </q-list>
          </div>
        </q-card>
      </div>

    </q-scroll-area>
  </q-card>

  <q-dialog v-model="showRMDialog">
    <q-card style="min-width: 60%">
      <q-card-section>
        <div class="text-h6">{{t('panel.settings.rmDialogTitle')}}</div>
      </q-card-section>

      <q-card-section>
        <q-input clearable v-model="registryMirror" filled type="url" label="registry mirror url" >
          <template v-slot:append>
            <q-icon v-if="registryMirror !== ''" name="close" @click="registryMirror = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="showRMDialog = false" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="addRegistryMirror" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showRDialog">
    <q-card style="min-width: 60%">
      <q-card-section>
        <div class="text-h6">{{t('panel.settings.rDialogTitle')}}</div>
      </q-card-section>

      <q-card-section>
        <q-item>
          <q-item-section top class="col-1 gt-sm">
            <q-item-label class="q-mt-sm">GitHub</q-item-label>
          </q-item-section>

          <q-item-section top>
            <q-input dense label="registry" v-model="newRegistry.url"/>
          </q-item-section>

          <q-item-section top>
            <q-input dense label="username" v-model="newRegistry.username"/>
          </q-item-section>

          <q-item-section top>
            <q-input dense label="password" v-model="newRegistry.password"/>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="showRDialog = false" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="addRegistry" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>

import { ref, inject, onMounted, onUnmounted, reactive, watch } from 'vue'
import { firstUpper, isEmptyObj, isEmptyStr, encodeToBase64 } from 'src/utils/common.js'
import { clientConfig } from 'src/common/config.js'


const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const service = inject("service")
console.log("service", service)

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 130 + "px" : window.innerHeight - 97 + "px",
})
const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 130 - 70 + "px" : window.innerHeight - 97 - 122 + "px",
})

const filterFn = (val, update, abort) => {
  if (proxyModes.length !== 0) {
    // already loaded
    update()
    return
  }

  setTimeout(() => {
    update(() => {})
  }, 2000)
}

const dockerDaemon = reactive({
  path: "/etc/docker/daemon.json",
  registries: [

  ],
  proxies: {
    "http-proxy": '',
    "https-proxy": '',
    "no-proxy": '',
  },

  dns: ""
})

const daemonPath = reactive({
  path: "/etc/docker/daemon.json",
  icon: "edit",
  disable: true
})
const onDaemonPathEdit = () => {
  daemonPath.disable = !daemonPath.disable

  if (daemonPath.disable) {
    daemonPath.icon = "edit"
  } else {
    daemonPath.icon = 'edit_off'
  }
}

const daemonDNS = reactive({
  dns: "",
  icon: "edit",
  disable: true
})
const onDaemonDNSEdit = () => {
  daemonDNS.disable = !daemonDNS.disable

  if (daemonDNS.disable) {
    daemonDNS.icon = "edit"
  } else {
    daemonDNS.icon = 'edit_off'
  }
}

const registryMirrors = reactive([])
const showRMDialog = ref(false)
const registryMirror = ref('')
const onRegistryMirrorsDelete = (index) => {
  registryMirrors.splice(index, 1)
}
const addRegistryMirror = () => {
  registryMirrors.push(registryMirror.value)
  registryMirror.value = ''
  showRMDialog.value = false
}

const proxyModes = [
  { label: t('panel.settings.disableMode'), value: 'Disable', desc: 'Disable' },
  { label: t('panel.settings.systemMode'), value: 'System', desc: 'System' },
  { label: t('panel.settings.manualMode'), value: 'Manual', desc: 'Manual' },
]
const proxyMode = ref("Disable")
const daemonProxies = reactive({
  http: '',
  https: '',
  byPass: '',
  disable: true,
  editIcon: "edit"
})
const onProxyEdit = () => {
  if (proxyMode.value === "Manual") {
    daemonProxies.disable = !daemonProxies.disable
  }

  if (daemonProxies.disable) {
    daemonProxies.editIcon = "edit"
  } else {
    daemonProxies.editIcon = "edit_off"
  }
}

const registries = reactive([
  {url: "https://docker.io", username: '', password: '', disable: false, type: "password", editIcon: "edit"},
  {url: "https://quay.io", username: '', password: '', disable: false, type: "password", editIcon: "edit"},
  {url: "https://ghcr.io", username: '', password: '', disable: false, type: "password", editIcon: "edit"},
  {url: "https://gcr.io", username: '', password: '', disable: false, type: "password", editIcon: "edit"},
])
const newRegistry = reactive({
  url: '',
  username: '',
  password: '',
})

const onRegistryEdit = (item) => {
  if (item.disable) {
    item.disable = false
    item.type = "text"
    item.editIcon = "edit_off"
  } else {
    item.disable = true
    item.type = "password"
    item.editIcon = "edit"
  }
}
const onRegistryDelete = (index) => {
  registries.splice(index, 1)
}
const onRegistryApply = (item) => {
  // window.wslTerminal.dockerLoginWSL().then((result) => {
  //
  // })
}

const showRDialog = ref(false)
const addRegistry = () => {
  if (isEmptyStr(newRegistry.url)) {
    return
  }

  registries.push({url: newRegistry.url, username: newRegistry.username, password: newRegistry.password, disable: false, type: "password", editIcon: "edit"})
  showRDialog.value = false
}

const onSave = () => {
  const data = {}

  if (registryMirrors.length > 0) {
    const insecure = []
    const secure = []
    for (const item of registryMirrors) {
      if (item.indexOf("https://") !== -1) {
        secure.push(item)
        continue
      }

      if (item.indexOf("http://") !== -1) {
        insecure.push(item)
        continue
      }

      secure.push(item)
    }
    data["registry-mirrors"] = secure
    data["insecure-registries"] = insecure
  }

  if (!isEmptyStr(daemonDNS.dns)) {
    try{
      let tmp = daemonDNS.dns.split(',')
      if (tmp.length > 0 ) {
        data["dns"] = tmp
      }
    } catch (error) {
      return $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.settings.dnsParseError')}: ${error}`
      })
    }
  }

  if (proxyMode.value !== "Disable") {
    data["proxies"] = {
      "http-proxy": daemonProxies.http,
      "https-proxy": daemonProxies.https,
      "no-proxy": daemonProxies.byPass,
    }
  }

  const base64Data =  encodeToBase64(data)
  window.wslTerminal.execSWSL([
    ['-d', "DockerDesk", '--user', "root", '-e', 'bash', '-c', `"echo '${base64Data}' | base64 -d > ${dockerDaemon.path}"`],
    ['-d', "DockerDesk", '--user', "root", '-e', "systemctl restart docker"]
  ]).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('panel.settings.saveSuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.settings.saveFail')}: ${result.error}`
      })
    }
  })

  let registryList
  if (registries.length > 0 ) {
    registryList = JSON.parse(JSON.stringify(registries))
    for (const item of registryList) {
      delete item["disable"]
      delete item["type"]
      delete item["editIcon"]
    }
  }
  window.client.updateSettings(
    {
      field: "docker_registries",
      value: JSON.stringify(registryList)
    }
  ).then((result) => {
    console.log(result)
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('panel.settings.dbSaveSuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.settings.dbSaveFail')}: ${result.error}`
      })
    }
  })
}

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 130 + "px"
    scrollStyle.height = window.innerHeight - 131 - 70 + "px"
  } else {
    cardStyle.height = window.innerHeight - 97 + "px"
    scrollStyle.height = window.innerHeight - 97 - 122 + "px"
  }
}

const init = async () => {
  window.wslTerminal.execWSL(
    ['-d', "DockerDesk", '--user', "root", '-e', `cat ${dockerDaemon.path}`]
  ).then((result) => {
    if (result.success) {
      try {
        const data = JSON.parse(result.data)
        console.log(data)

        if(Object.prototype.hasOwnProperty.call(data, "dns")) {
          const dns = data["dns"]
          daemonDNS.dns = dns.join(',')
        }
        if(Object.prototype.hasOwnProperty.call(data, "registry-mirrors")) {
          const secure = data["registry-mirrors"]
          registryMirrors.push(...secure)
        }
        if(Object.prototype.hasOwnProperty.call(data, "insecure-registries")) {
          const insecure = data["insecure-registries"]
          registryMirrors.push(...insecure)
        }
        if(Object.prototype.hasOwnProperty.call(data, "proxies")) {
          const proxies = data["proxies"]

          let http = ''
          let https = ''
          let byPass = ''

          if(Object.prototype.hasOwnProperty.call(proxies, "http-proxy")) {
            http = proxies["http-proxy"]
          }

          if(Object.prototype.hasOwnProperty.call(proxies, "https-proxy")) {
            https = proxies["https-proxy"]
          }

          if(Object.prototype.hasOwnProperty.call(proxies, "no-proxy")) {
            byPass = proxies["no-proxy"]
          }
          if (http.length > 0 || https.length > 0) {
            proxyMode.value = "Manual"

            setTimeout(() => {
              daemonProxies.http = http
              daemonProxies.https = https
              daemonProxies.byPass = byPass
            }, 5000)
          }
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      // if (result.error.includes("daemon.json: No such file or directory")) {
      //   return $q.notify({
      //     type: 'negative',
      //     position: clientConfig.quasar.notify.position,
      //     message: `${t('panel.settings.fileNotExist')}: ${result.error}`
      //   })
      // }
    }
  })

  window.client.getSettings("docker_registries").then((result) => {
    console.log(result)
    if (result.success) {
      registries.length = 0
      for (const item of JSON.parse(result.data.value)) {
        item["disable"] = true
        item["type"] = "password"
        item["editIcon"] = "edit"
        registries.push(item)
      }
    }
    console.log(registries)
  })
}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

watch(proxyMode, (newVal, oldVal) => {
  if (newVal === "System") {
    window.myWindowAPI.getProxy().then((result) => {
      if (!isEmptyObj(result)) {
        daemonProxies.http = result.http
        daemonProxies.https = result.https
        daemonProxies.byPass = result.byPass
      }
    })
  } else {
    // daemonProxies.http = ''
    // daemonProxies.https = ''
    // daemonProxies.byPass = ''
  }
})

</script>

<style scoped>

</style>
