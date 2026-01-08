<template>
  <q-scroll-area :style="scrollStyle">
    <q-card class="q-ma-md">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6" v-if="service" >{{firstUpper(service.serviceType) + t('panel.settings.settings')}}</div>
          <q-btn color="blue" :label="t('panel.settings.save')" @click="onSavePodman"/>
        </div>
      </q-card-section>

      <q-separator />


      <div class="q-pa-md">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
            <div class="col">
              <q-btn
                flat
                dense
                color="grey-6"
                style="background-color: #e9ecef; border-radius: 4px; font-size: 14px; padding: 4px 12px;"
              >
                基础用法
              </q-btn>
            </div>
            <!--            <div class="col-auto row items-center q-gutter-sm">-->
            <!--              <q-btn color="teal" label="save"/>-->
            <!--            </div>-->
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">

          </div>

        </q-card>
      </div>

      <!--      search-registries-->
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
                {{t('panel.settings.searchRegistry1')}}
              </q-btn>
            </div>
            <div class="q-gutter-sm">
              <q-btn color="grey" :label="t('panel.settings.add')" @click="showSRDialog = !showSRDialog" />
            </div>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm">
            <q-list>
              <q-item
                v-for="(item, index) in podmanConf.searchRegistries"
                :key="index"
              >
                <q-item-section dense class="text-body2" >{{ t('panel.settings.registry') }}</q-item-section>

                <q-item-section
                  top
                  side
                >
                  <q-input
                    class="text-body1"
                    outlined
                    dense
                    readonly
                    v-model="podmanConf.searchRegistries[index]"
                    :label="t('panel.settings.searchRegistry')"
                    style="min-width: 300px"
                  />
                </q-item-section>

                <q-item-section top side>
                  <q-btn dense flat icon="delete" color="red" @click="onDeleteSearchRegisty(index)">
                    <q-tooltip class="bg-amber text-black shadow-4">
                      {{t('delete')}}
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
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
                v-for="(item, index) in podmanConf.registryMirrors"
                :key="index"
              >

                <q-input
                  class="text-body1"
                  outlined
                  dense
                  input-class="text-right"
                  v-model="item.prefix"
                  label="prefix"
                  style="width: 150px"
                />

                <q-input
                  class="text-body1"
                  outlined
                  dense
                  input-class="text-right"
                  v-model="item.location"
                  label="lcoation"
                  style="width: 150px"
                />

                <q-toggle size="xs" v-model="item.insecure" val="xs" label="insecure" />

                <q-toggle size="xs" v-model="item.blocked" val="xs" label="blocked" />


                <q-item-section top side>
                  <div class="row q-gutter-xs">
                    <q-btn dense flat icon="delete" color="red" @click="onRegistryDelete(index)">
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




    </q-card>

    <q-card class="q-ma-md">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6" v-if="service" >{{t('panel.settings.otherSettings')}}</div>
        </div>
      </q-card-section>

      <q-separator />

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

            <q-btn color="grey" :label="t('panel.settings.save')" @click="onProxySave" >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('panel.settings.save')}}
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
              :disable="webProxies.disable"
              filled
              dense
              bottom-slots
              v-model="webProxies.http"
              label="HTTP:"
            >
              <template v-slot:append>
                <q-icon v-if="webProxies.http !== ''" name="close" @click="webProxies.http = ''" class="cursor-pointer" />
              </template>
            </q-input>

            <q-input
              v-if="proxyMode !== 'Disable'"
              :disable="webProxies.disable"
              filled
              dense
              bottom-slots
              v-model="webProxies.https"
              label="HTTPS"
            >
              <template v-slot:append>
                <q-icon v-if="webProxies.https !== ''" name="close" @click="webProxies.https = ''" class="cursor-pointer" />
              </template>

            </q-input>

            <q-input
              v-if="proxyMode !== 'Disable'"
              :disable="webProxies.disable"
              filled
              dense
              bottom-slots
              v-model="webProxies.byPass"
              label="Bypass proxy settings for these hosts and domains:"
            >
              <template v-slot:append>
                <q-icon v-if="webProxies.byPass !== ''" name="close" @click="webProxies.byPass = ''" class="cursor-pointer" />
              </template>
            </q-input>
          </div>
        </q-card>
      </div>

      <!--      env-->
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
                {{t('panel.settings.envSettings')}}
              </q-btn>
            </div>

            <q-space />

            <q-btn color="grey" icon="add" @click="onProxyEdit" >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('panel.settings.add')}}
              </q-tooltip>
            </q-btn>
          </q-card-section>

          <q-list>
            <q-item
              v-for="(item, index) in evns"
              :key="index"
              dense
              class="bg-grey-2"
            >
              <q-item-section class="text-body2">{{ t('panel.create.envFile') }}</q-item-section>

              <q-item-section top side>
                <q-input
                  class="text-body1"
                  outlined
                  dense
                  input-class="text-right"
                  v-model="item.key"
                  :label="t('panel.create.envKey')"
                  style="width: 150px"
                />
              </q-item-section>

              <q-item-section top side>
                <q-input
                  class="text-body1"
                  outlined
                  dense
                  input-class="text-right"
                  v-model="item.value"
                  :label="t('panel.create.envValue')"
                  style="width: 200px"
                />
              </q-item-section>

              <q-item-section top side>
                <q-btn dense flat icon="delete" color="red" @click="onDeleteENV(index)">
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('delete')}}
                  </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>


        </q-card>
      </div>
    </q-card>
  </q-scroll-area>


  <q-dialog v-model="showSRDialog">
    <q-card style="min-width: 60%">
      <q-card-section>
        <div class="text-h6">{{t('panel.settings.srDialogTitle')}}</div>
      </q-card-section>

      <q-card-section>
        <q-input clearable v-model="newSearchRegistry" filled type="url" label="search registry url" >
          <template v-slot:append>
            <q-icon v-if="newSearchRegistry !== ''" name="close" @click="newSearchRegistry = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="showSRDialog = false" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="addSearchRegistry" />
      </q-card-actions>
    </q-card>
  </q-dialog>

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

import { inject, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { firstUpper, firstLower, isEmptyObj, isEmptyStr } from 'src/utils/common.js'
import { usePodmanStore } from 'src/stores/podman.js'
import { clientConfig } from 'src/common/config.js'


const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const podmanStore = usePodmanStore()

const service = inject("service")
console.log("service", service)

const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 114 + "px" : window.innerHeight - 97 + "px",
})

const showSRDialog = ref(false)

const podmanConf = reactive({
  path: "/etc/containers/registries.conf",
  searchRegistries: [],
  registryMirrors: [],
})

const podmanContent = ref(null)

const registryDefault = {
  prefix: '',
  location: '',
  insecure: false,
  blocked: false
}
const registryMirrorDefault = {
  location: '',
  insecure: false
}

const newSearchRegistry = ref('')

const newRegistry = ref({
  prefix: '',
  location: '',
  insecure: false,
  blocked: false
})

const newRegistryMirror = ref({
  location: '',
  insecure: false
})

const evns = ref([])
const envDefault = reactive({
  key: '',
  value: ''
})





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
const webProxies = reactive({
  http: '',
  https: '',
  byPass: '',
  disable: true,
  editIcon: "edit"
})
const onProxyEdit = () => {
  if (proxyMode.value === "Manual") {
    webProxies.disable = !webProxies.disable
  }

  if (webProxies.disable) {
    webProxies.editIcon = "edit"
  } else {
    webProxies.editIcon = "edit_off"
  }
}

const onProxySave = () => {
  if (proxyMode.value === "Disable" || proxyMode.value === "System") {
    window.client.updateSettings([
      {
        field: "podman_proxy_mode",
        value: firstLower(proxyMode.value)
      }
    ]).then((result) => {
      console.log(result)
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.settings.proxySaveSuccess')}`,
        })

        if (proxyMode.value === "Disable") {
          podmanStore.proxies.httpProxy = ''
          podmanStore.proxies.httpsProxy = ''
          podmanStore.proxies.noProxy = ''
        } else {
          podmanStore.proxies.httpProxy = webProxies.http
          podmanStore.proxies.httpsProxy = webProxies.https
          podmanStore.proxies.noProxy = webProxies.byPass
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.settings.proxySaveFail')}: ${result.error}`
        })
      }
    })
  } else {
    if (isEmptyStr(webProxies.http) && isEmptyStr(webProxies.https)) {
      return
    }

    const data = {
      http_proxy: webProxies.http,
      https_proxy: webProxies.https,
      no_proxy: webProxies.byPass,
    }

    window.client.updateSettings([
      {
        field: "web_proxy",
        value: JSON.stringify(data)
      },
      {
        field: "podman_proxy_mode",
        value: firstLower(proxyMode.value)
      },
    ]).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.settings.proxySaveSuccess')}`,
        })

        podmanStore.proxies.httpProxy = webProxies.http
        podmanStore.proxies.httpsProxy = webProxies.https
        podmanStore.proxies.noProxy = webProxies.byPass
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.settings.proxySaveFail')}: ${result.error}`
        })
      }
    })
  }
}



const registries = reactive([
  {url: "https://docker.io", username: '', password: '', disable: false, type: "password", editIcon: "edit"},
  {url: "https://quay.io", username: '', password: '', disable: false, type: "password", editIcon: "edit"},
  {url: "https://ghcr.io", username: '', password: '', disable: false, type: "password", editIcon: "edit"},
  {url: "https://gcr.io", username: '', password: '', disable: false, type: "password", editIcon: "edit"},
])
const newRegistry1 = reactive({
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
// const addRegistry = () => {
//   if (isEmptyStr(newRegistry.url)) {
//     return
//   }
//
//   registries.push({url: newRegistry.url, username: newRegistry.username, password: newRegistry.password, disable: false, type: "password", editIcon: "edit"})
//   showRDialog.value = false
// }
//
// const onDeleteSearchRegisty = (index) => {
//   podmanConf.searchRegistries.splice(index, 1)
// }
//
// const addSearchRegistry = () => {
//   podmanConf.searchRegistries.push(newSearchRegistry.value)
//   newSearchRegistry.value = ''
//   showSRDialog.value = false
// }




const onSavePodman = () => {

}









const checkScreenSize = () => {
  console.log('check screenSize', window.innerHeight)

  if (process.env.MODE === 'electron') {
    scrollStyle.height = window.innerHeight - 114 + "px"
  } else {
    scrollStyle.height = window.innerHeight - 97 + "px"
  }
}

const init = () => {
  window.wslTerminal.readPodmanConfWSL(
    ['-d', "DockerDesk", '--user', "root", '-e', `cat ${podmanConf.path}`]
  ).then((result) => {
    console.log(result)

    if (result.success) {
      podmanContent.value = result.data

      if (Object.hasOwnProperty.call(podmanContent.value, "unqualified-search-registries")) {
      }

      if (Object.hasOwnProperty.call(podmanContent.value, "registry")) {
      } else {
        podmanContent.value["registry"] = {}
      }
    } else {

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
  })

  window.client.getSettings("podman_proxy_mode").then((result) => {
    console.log(result)
    if (result.success) {
      proxyMode.value = firstUpper(result.data.value)
      podmanStore.proxies.mode = result.data.value

      if (result.data.value === "manual") {
        window.client.getSettings("web_proxy").then((result) => {
          if (result.success) {
            if (isEmptyStr(result.data.value)) {
              return
            }

            const data = JSON.parse(result.data.value)

            if (result.data.value) {
              webProxies.http = data.http_proxy
              webProxies.https = data.https_proxy
              webProxies.byPass = data.no_proxy

              podmanStore.proxies.httpProxy = data.http_proxy
              podmanStore.proxies.httpsProxy = data.https_proxy
              podmanStore.proxies.noProxy = data.no_proxy
            }
          }
        })
      }
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

watch(proxyMode, (newVal, oldVal) => {
  if (newVal === "System") {
    webProxies.disable = true
    window.myWindowAPI.getProxy().then((result) => {
      if (!isEmptyObj(result)) {
        webProxies.http = result.http
        webProxies.https = result.https
        webProxies.byPass = result.byPass
      }
    })
  } else if (newVal === "Manual") {
    webProxies.disable = false
  } else {
    // webProxies.http = ''
    // webProxies.https = ''
    // webProxies.byPass = ''
  }
})

</script>

<style scoped>

</style>
